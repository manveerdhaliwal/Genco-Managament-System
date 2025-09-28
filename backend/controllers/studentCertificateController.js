const StudentCertificate = require("../models/StudentCertificate");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { uploadToCloudinary } = require("../config/cloudinary");

// 🔹 Add / Update Certificate
const saveCertificate = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type, eventName, date } = req.body;

    let certificateUrl = "";

    // Upload file to Cloudinary if exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "student_certificates");
      certificateUrl = result.secure_url;
    }

    // Check if certificate already exists
    let existing = await StudentCertificate.findOne({ student: studentId, type, eventName });

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
      );
      return res.json({ success: true, message: "Certificate updated!", data: existing });
    }

    // Create new
    const newCert = new StudentCertificate({
      student: studentId,
      type,
      eventName,
      date,
      certificateUrl,
    });

    await newCert.save();
    await newCert.populate("student", "name email role");

    res.status(201).json({ success: true, message: "Certificate saved!", data: newCert });
  } catch (error) {
    console.error("Error saving certificate:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's certificates
const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;
    const certs = await StudentCertificate.find({ student: studentId }).sort({ date: -1 });
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

    if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
    if (!teacher.branch) return res.status(400).json({ success: false, message: "Teacher has no branch assigned" });

    const students = await Student.find({ branch: teacher.branch }).select("_id");
    if (!students.length) return res.status(404).json({ success: false, message: "No students found in your branch" });

    const studentIds = students.map((s) => s._id);

    const certs = await StudentCertificate.find({ student: { $in: studentIds } })
      .populate({
        path: "student",
        select: "name URN section year branch",
        populate: { path: "branch", select: "name" },
      })
      .sort({ date: -1 });

    if (!certs.length) {
      return res.status(200).json({ success: false, message: "No certificates found for your branch" });
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
    const certs = await StudentCertificate.find({ student: studentId }).sort({ date: -1 });

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
  getMyCertificates,
  getStudentCertificates,
  getBranchCertificates,
};
