const express = require("express");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");
const {
  createTraining,
  getMyTraining,
  updateTraining,
  getAllTraining,
  getTrainingByStudent,
} = require("../controllers/studentTrainingController");

const router = express.Router();

// Student-only routes
router.post("/", authMiddleware, checkRole("student"), createTraining);
router.get("/me", authMiddleware, checkRole("student"), getMyTraining);
router.put("/:id", authMiddleware, checkRole("student"), updateTraining);

// Teacher/Admin routes
router.get("/", authMiddleware, checkRole("teacher", "admin"), getAllTraining);
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getTrainingByStudent);

module.exports = router;
