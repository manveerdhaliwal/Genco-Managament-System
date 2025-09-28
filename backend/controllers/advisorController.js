const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// Get advisors for a student (same branch teachers)
const getAdvisorsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student with branch populated
    const student = await Student.findById(studentId).populate("branch");
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Find teachers in same branch
    const advisors = await Teacher.find({ branch: student.branch._id });

    res.json(advisors);  // <-- returns array of teachers
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAdvisorsForStudent };
