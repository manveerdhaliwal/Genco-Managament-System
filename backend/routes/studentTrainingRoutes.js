const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");
const { upload } = require("../config/cloudinary");
const {
  createTraining,
  getMyTraining,
  updateTraining,
  getAllTraining,
  getTrainingByStudent,
} = require("../controllers/studentTrainingController");

// Student-only routes
router.post("/", authMiddleware, checkRole("student"), upload.single("certificatepdf"), createTraining);
router.get("/me", authMiddleware, checkRole("student"), getMyTraining);
router.put("/:id", authMiddleware, checkRole("student"), upload.single("certificatepdf"), updateTraining);

// Teacher/Admin routes
router.get("/", authMiddleware, checkRole("teacher", "admin"), getAllTraining);
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getTrainingByStudent);

module.exports = router;
