const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { authMiddleware } = require("../controllers/auth-controller");

// Get current logged-in student
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate("branch");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Send only relevant fields
    res.json({
      success: true,
      student: {
        name: student.name,
        rollNo: student.CRN,
        department: student.branch ? student.branch.name : "N/A", // branch name
        year: student.year,
        dob: student.dob || "",
        gender: student.gender || "",
        address: student.address || "",
        email: student.email,
        phone: student.phone || "",
        linkedin: student.linkedin || "",
        github: student.github || "",
        instagram: student.instagram || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
