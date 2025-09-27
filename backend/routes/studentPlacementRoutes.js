const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");
const { upload } = require("../config/cloudinary");
const {
  createPlacement,
  getMyPlacements,
  updatePlacement,
  getAllPlacements,
  getPlacementByStudent,
} = require("../controllers/studentPlacementController");

// Student-only routes
router.post("/", authMiddleware, checkRole("student"), upload.single("offerLetter"), createPlacement);
router.get("/me", authMiddleware, checkRole("student"), getMyPlacements);
router.put("/:id", authMiddleware, checkRole("student"), upload.single("offerLetter"), updatePlacement);

// Teacher/Admin routes
router.get("/", authMiddleware, checkRole("teacher", "admin"), getAllPlacements);
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getPlacementByStudent);

module.exports = router;
