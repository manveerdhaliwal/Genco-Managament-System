const express = require("express");
const { saveStudentInfo, getMyInfo, getStudentInfo } = require("../controllers/studentInfoController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// student fills/updates info (only students)
router.post("/save", authMiddleware, checkRole("student"), saveStudentInfo);

// student sees their own info
router.get("/me", authMiddleware, checkRole("student"), getMyInfo);

// teacher/admin fetch student info by ID
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getStudentInfo);

module.exports = router;
