const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// Get advisors for a student (same branch teachers)
const getAdvisorsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).populate("branch");
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (!student.branch) {
      return res.status(400).json({ error: "Student has no branch assigned" });
    }

    const advisors = await Teacher.find({ branch: student.branch._id }).select("name email _id");
    res.json({ success: true, data: advisors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAdvisorsForStudent };