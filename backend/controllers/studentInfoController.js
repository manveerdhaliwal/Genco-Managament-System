const StudentInfo = require("../models/StudentInfo");

// 🔹 Add/Update Student Info
const saveStudentInfo = async (req, res) => {
  try {
    console.log("Student Info Save Called");
    console.log("Student ID from token:", req.user?.id);
    console.log("Request Body:", req.body);

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
      )
        
        .populate("student", "name email role URN section year")

        .populate("advisor", "name"); // 👈 Added advisor population

      return res.json({
        success: true,
        message: "Info updated!",
        data: existing,
      });
    }

    // create new record
    const newInfo = new StudentInfo({
      ...info,
      student: studentId,
    });

    await newInfo.save();
    await newInfo.populate("student", "name email role URN section year")

    await newInfo.populate("advisor", "name email _id Emp_id"); // 👈 Added advisor population

    // send student._id at top-level for easier frontend use
    const responseData = {
      ...newInfo.toObject(),
      studentId: newInfo.student._id,
    };

    res
      .status(201)
      .json({ success: true, message: "Info saved!", data: responseData });
  } catch (error) {
    console.error("Error saving student info:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's info
const getMyInfo = async (req, res) => {
  try {
    const studentId = req.user.id;
    const info = await StudentInfo.findOne({ student: studentId })
     .populate("student", "name email role URN section year")

      .populate("advisor", "name email _id Emp_id"); // 👈 Added advisor population

    if (!info) {
      return res
        .status(404)
        .json({ success: false, message: "No info found!" });
    }

    // send student._id at top-level
    const responseData = {
      ...info.toObject(),
      studentId: info.student._id,
    };

    res.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error in getMyInfo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get info of any student by ID
const getStudentInfo = async (req, res) => {
  try {
    const { studentId } = req.params;

    const info = await StudentInfo.findOne({ student: studentId })
      .populate("student", "name email role URN section year")

      .populate("advisor", "name email _id Emp_id"); // 👈 Added advisor population

    if (!info) {
      return res
        .status(404)
        .json({ success: false, message: "No info found!" });
    }

    res.json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllStudentInfo = async (req, res) => {
  try {
    const info = await StudentInfo.find()
      .populate("student", "name email role URN section year")

      .populate("advisor", "name email _id Emp_id"); // 👈 Added advisor population

    if (!info || info.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No student info found!" });
    }

    res.json({ success: true, data: info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get student info by URN
const getStudentInfoByURN = async (req, res) => {
  try {
    const { urn } = req.query; // get URN from query string
    if (!urn) return res.status(400).json({ success: false, message: "URN is required" });

    const info = await StudentInfo.findOne()
      .populate("student", "name email role URN section year")
      .populate("advisor", "name email _id Emp_id");

    if (!info) {
      return res.status(404).json({ success: false, message: "No info found!" });
    }

    // Check if student matches URN
    if (info.student.URN !== urn) {
      return res.status(404).json({ success: false, message: "Student not found with this URN" });
    }

    res.json({ success: true, data: info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  saveStudentInfo,
  getMyInfo,
  getStudentInfo,
  getAllStudentInfo,
  getStudentInfoByURN,
};
