const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// Get advisors for a student (same branch teachers)
// Get advisors for a student (same branch teachers)
const getAdvisorsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("StudentId from params:", studentId);

    const student = await Student.findById(studentId).populate("branch");
    if (!student) return res.status(404).json({ error: "Student not found" });

    console.log("Student found:", student);

    const advisors = await Teacher.find({ branch: student.branch._id }).select("name email _id");

    console.log("Advisors fetched:", advisors);

    res.json({ success: true, data: advisors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 Get students of same branch as teacher, categorized by year
const getStudentsByBranch = async (req, res) => {
  try {
    const teacherId = req.user.id; // from auth middleware
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!teacher.branch) {
      return res.status(400).json({ success: false, message: "Teacher has no branch assigned" });
    }

    // Find students in same branch
    const students = await Student.find({ branch: teacher.branch._id }).select(
      "-password -__v"
    );

    // Ensure we always return an array
    if (!students || !Array.isArray(students)) {
      return res.status(200).json({ success: true, students: [] });
    }

    res.json({ success: true, students });

  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getStudentsByBranch, getAdvisorsForStudent };
