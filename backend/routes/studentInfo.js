const express = require("express");
const { saveStudentInfo, getMyInfo, getStudentInfo ,getAllStudentInfo } = require("../controllers/studentInfoController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// student fills/updates info (only students)
router.post("/save", authMiddleware, checkRole("student"), saveStudentInfo);

// student sees their own info
router.get("/me", authMiddleware, checkRole("student"), getMyInfo);

// teacher/admin fetch student info by ID
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getStudentInfo);

// teacher/admin fetch all students info 
router.get("/", authMiddleware, checkRole("teacher", "admin"), getAllStudentInfo);


module.exports = router;
