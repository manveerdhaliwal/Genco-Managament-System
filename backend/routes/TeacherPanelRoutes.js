const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/auth-controller");
const { getStudentsByBranch, getMyMentees } = require("../controllers/teacherController");

// 🔹 Teacher fetch students (all in branch)
router.get("/mystudents", authMiddleware, getStudentsByBranch);

// 🔹 Teacher fetch mentees (only assigned students)
router.get("/mymentees", authMiddleware, getMyMentees);

module.exports = router;