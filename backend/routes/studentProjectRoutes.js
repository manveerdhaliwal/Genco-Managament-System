const express = require("express");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

const {
  createProject,
  getMyProjects,
  updateProject,
  getAllProjects,
  getProjectsByStudent,
} = require("../controllers/studentProjectController");

const router = express.Router();

// Student
router.post("/", authMiddleware, checkRole("student"), createProject);
router.get("/me", authMiddleware, checkRole("student"), getMyProjects);
router.put("/:id", authMiddleware, checkRole("student"), updateProject);

// Teacher/Admin
router.get("/", authMiddleware, checkRole("teacher", "admin"), getAllProjects);
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getProjectsByStudent);

module.exports = router;
