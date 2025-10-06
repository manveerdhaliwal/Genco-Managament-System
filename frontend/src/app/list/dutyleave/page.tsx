const express = require("express");
const router = express.Router();
const { 
  createDutyLeave, 
  getMyDutyLeaves,
  getAdvisorDutyLeaves,
  advisorApproval,
  getHodDutyLeaves,
  hodApproval,
  getAllDutyLeaves 
} = require("../controllers/dutyLeaveController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

// 🔹 Student routes
// Student submits duty leave
router.post("/", authMiddleware, checkRole("student"), createDutyLeave);

// Student sees their own duty leaves
router.get("/my-leaves", authMiddleware, checkRole("student"), getMyDutyLeaves);

// 🔹 Advisor routes
// Advisor sees duty leaves assigned to them
router.get("/advisor-leaves", authMiddleware, checkRole("teacher"), getAdvisorDutyLeaves);

// Advisor approves/rejects duty leave (Level 1)
router.put("/advisor-approval", authMiddleware, checkRole("teacher"), advisorApproval);

// 🔹 HoD routes
// HoD sees duty leaves where advisor approved (from their branch)
router.get("/hod-leaves", authMiddleware, checkRole("teacher"), getHodDutyLeaves);

// HoD final approves/rejects duty leave (Level 2)
router.put("/hod-approval", authMiddleware, checkRole("teacher"), hodApproval);

// 🔹 Admin route (optional)
// Admin sees all duty leaves
router.get("/all", authMiddleware, checkRole("admin"), getAllDutyLeaves);

module.exports = router;