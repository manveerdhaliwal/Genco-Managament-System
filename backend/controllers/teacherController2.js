const Teacher = require("../models/Teacher");

// ✅ Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("branch", "name")
      .select("name email branch");

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({ success: false, message: "No info found!" });
    }

    res.status(200).json({ success: true, teachers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { getAllTeachers };
