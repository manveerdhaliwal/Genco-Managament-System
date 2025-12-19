const StudentCertificate = require("../models/StudentCertificate");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { uploadToCloudinary } = require("../config/cloudinary");

// Helper function to create safe filenames
const createSafeFilename = (eventName, studentName, type, originalName) => {
  const slugify = (text) =>
    text.toString().toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "")
      .substring(0, 40);
  
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${slugify(type)}_${slugify(eventName)}_${slugify(studentName)}_${timestamp}.${extension}`;
};

// 🔹 Add / Update Certificate
const saveCertificate = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type, eventName, date } = req.body;

    // Get student info for filename
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    let certificateUrl = "";

    // Upload file to Cloudinary if exists
    if (req.file) {
      const safeFilename = createSafeFilename(
        eventName,
        student.name,
        type,
        req.file.originalname
      );
      
      const result = await uploadToCloudinary(
        req.file.buffer,
        safeFilename,
        "student_certificates"
      );
      certificateUrl = result.secure_url;
    }

    // Check if certificate already exists
    let existing = await StudentCertificate.findOne({
      student: studentId,
      type,
      eventName,
    });

    if (existing) {
      existing = await StudentCertificate.findOneAndUpdate(
        { _id: existing._id },
        {
          type,
          eventName,
          date,
          certificateUrl: certificateUrl || existing.certificateUrl,
        },
        { new: true }
      ).populate("student", "name email role URN section year");
      
      return res.json({
        success: true,
        message: "Certificate updated!",
        data: existing,
      });
    }

    // Create new certificate
    const newCert = new StudentCertificate({
      student: studentId,
      type,
      eventName,
      date,
      certificateUrl,
    });

    await newCert.save();
    await newCert.populate("student", "name email role URN section year");

    res.status(201).json({ 
      success: true, 
      message: "Certificate saved!", 
      data: newCert 
    });
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update Certificate by ID
const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      // Get certificate to access student info
      const certificate = await StudentCertificate.findById(id).populate("student", "name");
      if (certificate) {
        const safeFilename = createSafeFilename(
          updates.eventName || certificate.eventName,
          certificate.student.name,
          updates.type || certificate.type,
          req.file.originalname
        );
        
        const result = await uploadToCloudinary(
          req.file.buffer,
          safeFilename,
          "student_certificates"
        );
        updates.certificateUrl = result.secure_url;
      }
    }

    const updated = await StudentCertificate.findByIdAndUpdate(id, updates, { new: true })
      .populate("student", "name email role URN section year");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, message: "Certificate updated!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's certificates
const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;
    const certs = await StudentCertificate.find({ student: studentId })
      .sort({ date: -1 });
    res.json({ success: true, data: certs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get certificates of students in same branch
const getBranchCertificates = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    
    if (!teacher.branch) {
      return res.status(400).json({ success: false, message: "Teacher has no branch assigned" });
    }

    const students = await Student.find({ branch: teacher.branch }).select("_id");
    
    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found in your branch" });
    }

    const studentIds = students.map((s) => s._id);

    const certs = await StudentCertificate.find({
      student: { $in: studentIds },
    })
      .populate({
        path: "student",
        select: "name URN section year branch",
        populate: { path: "branch", select: "name" },
      })
      .sort({ date: -1 });

    if (!certs.length) {
      return res.status(200).json({
        success: false,
        message: "No certificates found for your branch",
      });
    }

    res.json({ success: true, data: certs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get certificates of any student by ID
const getStudentCertificates = async (req, res) => {
  try {
    const { studentId } = req.params;
    const certs = await StudentCertificate.find({ student: studentId })
      .populate("student", "name email role URN section year")
      .sort({ date: -1 });

    if (!certs || certs.length === 0) {
      return res.status(404).json({ success: false, message: "No certificates found!" });
    }

    res.json({ success: true, data: certs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  saveCertificate,
  updateCertificate,
  getMyCertificates,
  getStudentCertificates,
  getBranchCertificates,
};