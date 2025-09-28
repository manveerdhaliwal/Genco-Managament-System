const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/auth-controller");
const { getStudentsByBranch } = require("../controllers/teacherController");

// 🔹 Teacher fetch students
router.get("/mystudents", authMiddleware, getStudentsByBranch);

module.exports = router;
