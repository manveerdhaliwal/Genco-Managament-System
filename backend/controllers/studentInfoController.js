const StudentInfo = require("../models/StudentInfo");

// 🔹 Add/Update Student Info
const saveStudentInfo = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware
    const info = req.body;   

    // check if info already exists
    let existing = await StudentInfo.findOne({ student: studentId });

    if (existing) {
      // update if already exists
      existing = await StudentInfo.findOneAndUpdate(
        { student: studentId },
        { $set: info },
        { new: true }
      );
      return res.json({ success: true, message: "Info updated!", data: existing });
    }

    // create new record
    const newInfo = new StudentInfo({
      ...info,
      student: studentId,
    });

    await newInfo.save();
    await newInfo.populate("student", "name email role");

    res.status(201).json({ success: true, message: "Info saved!", data: newInfo });

  } catch (error) {
    console.error("Error saving student info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's info
const getMyInfo = async (req, res) => {
  try {
    const studentId = req.user.id;
    const info = await StudentInfo.findOne({ student: studentId }).populate("student", "name email role");

    if (!info) {
      return res.status(404).json({ success: false, message: "No info found!" });
    }

    res.json({ success: true, data: info });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get info of any student by ID
const getStudentInfo = async (req, res) => {
  try {
    const { studentId } = req.params;

    const info = await StudentInfo.findOne({ student: studentId }).populate("student", "name email role");

    if (!info) {
      return res.status(404).json({ success: false, message: "No info found!" });
    }

    res.json({ success: true, data: info });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { saveStudentInfo, getMyInfo, getStudentInfo };
