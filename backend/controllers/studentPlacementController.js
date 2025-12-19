const StudentPlacement = require("../models/StudentPlacement");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const { uploadToCloudinary } = require("../config/cloudinary");

// Helper function to create safe filenames
const createSafeFilename = (companyName, studentName, originalName) => {
  const slugify = (text) =>
    text.toString().toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "")
      .substring(0, 50);
  
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${slugify(companyName)}_${slugify(studentName)}_${timestamp}.${extension}`;
};

// 🔹 Create Placement (with PDF upload)
const createPlacement = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { companyName, role, package: pkg, companyDescription, yearOfPlacement } = req.body;

    // Get student info for filename
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    let offerLetterUrl = "";

    // Upload PDF if file exists
    if (req.file) {
      const safeFilename = createSafeFilename(
        companyName,
        student.name,
        req.file.originalname
      );
      
      const result = await uploadToCloudinary(
        req.file.buffer,
        safeFilename,
        "student_placements"
      );
      offerLetterUrl = result.secure_url;
    }

    // Check if placement already exists for this student & company
    let existing = await StudentPlacement.findOne({ 
      student: studentId, 
      companyName, 
      yearOfPlacement 
    });

    if (existing) {
      existing = await StudentPlacement.findOneAndUpdate(
        { student: studentId, companyName, yearOfPlacement },
        {
          companyName,
          role,
          package: pkg,
          companyDescription,
          yearOfPlacement,
          offerLetterUrl: offerLetterUrl || existing.offerLetterUrl,
        },
        { new: true }
      ).populate("student", "name email role URN section year");
      
      return res.json({ success: true, message: "Placement updated!", data: existing });
    }

    // Create new placement
    const newPlacement = new StudentPlacement({
      student: studentId,
      companyName,
      role,
      package: pkg,
      companyDescription,
      yearOfPlacement,
      offerLetterUrl,
    });

    await newPlacement.save();
    await newPlacement.populate("student", "name email role URN section year");

    res.status(201).json({ success: true, message: "Placement saved!", data: newPlacement });
  } catch (error) {
    console.error("Error creating placement:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's placements
const getMyPlacements = async (req, res) => {
  try {
    const studentId = req.user.id;
    const placements = await StudentPlacement.find({ student: studentId })
      .populate("student", "name email role URN section year");
    res.json({ success: true, data: placements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update placement by ID
const updatePlacement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      // Get placement to access student info
      const placement = await StudentPlacement.findById(id).populate("student", "name");
      if (placement) {
        const safeFilename = createSafeFilename(
          updates.companyName || placement.companyName,
          placement.student.name,
          req.file.originalname
        );
        
        const result = await uploadToCloudinary(
          req.file.buffer,
          safeFilename,
          "student_placements"
        );
        updates.offerLetterUrl = result.secure_url;
      }
    }

    const updated = await StudentPlacement.findByIdAndUpdate(id, updates, { new: true })
      .populate("student", "name email role URN section year");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Placement not found" });
    }

    res.json({ success: true, message: "Placement updated!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: get all placements (same branch only)
const getAllPlacements = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!teacher.branch) {
      return res.status(400).json({ success: false, message: "Teacher has no branch assigned" });
    }

    // Find students in same branch
    const students = await Student.find({ branch: teacher.branch }).select("_id");

    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found in your branch" });
    }

    const studentIds = students.map((s) => s._id);

    const placements = await StudentPlacement.find({ student: { $in: studentIds } })
      .populate({
        path: "student",
        select: "name URN section year branch",
        populate: { path: "branch", select: "name" },
      })
      .sort({ yearOfPlacement: -1, createdAt: -1 });

    if (!placements.length) {
      return res.status(200).json({ success: false, message: "No placements found for your branch" });
    }

    res.json({ success: true, data: placements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: get placements of a specific student
const getPlacementByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const placements = await StudentPlacement.find({ student: studentId })
      .populate("student", "name email role URN section year")
      .sort({ yearOfPlacement: -1 });
    res.json({ success: true, data: placements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createPlacement,
  getMyPlacements,
  updatePlacement,
  getAllPlacements,
  getPlacementByStudent,
};