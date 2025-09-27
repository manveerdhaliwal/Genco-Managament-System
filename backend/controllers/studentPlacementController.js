const StudentPlacement = require("../models/StudentPlacement");
const { uploadToCloudinary } = require("../config/cloudinary");

// 🔹 Create Placement (with PDF upload)
const createPlacement = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { companyName, role, package: pkg, companyDescription, yearOfPlacement } = req.body;

    let offerLetterUrl = "";

    // Upload PDF if file exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "student_placements");
      offerLetterUrl = result.secure_url;
    }

    // Check if placement already exists for this student & company
    let existing = await StudentPlacement.findOne({ student: studentId, companyName, yearOfPlacement });

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
      );
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
    await newPlacement.populate("student", "name email role");

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
    const placements = await StudentPlacement.find({ student: studentId }).populate("student", "name email role");
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
      const result = await uploadToCloudinary(req.file.buffer, "student_placements");
      updates.offerLetterUrl = result.secure_url;
    }

    const updated = await StudentPlacement.findByIdAndUpdate(id, updates, { new: true }).populate("student", "name email role");

    if (!updated) return res.status(404).json({ success: false, message: "Placement not found" });

    res.json({ success: true, message: "Placement updated!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: get all placements
const getAllPlacements = async (req, res) => {
  try {
    const placements = await StudentPlacement.find().populate("student", "name email role");
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
    const placements = await StudentPlacement.find({ student: studentId }).populate("student", "name email role");
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
