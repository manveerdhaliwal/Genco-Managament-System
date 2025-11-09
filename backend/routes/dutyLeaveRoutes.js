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
router.post("/", authMiddleware, checkRole("student"), createDutyLeave);
router.get("/my-leaves", authMiddleware, checkRole("student"), getMyDutyLeaves);

// 🔹 Advisor routes
router.get("/advisor-leaves", authMiddleware, checkRole("teacher"), getAdvisorDutyLeaves);
router.put("/advisor-approval", authMiddleware, checkRole("teacher"), advisorApproval);

// 🔹 HoD routes
router.get("/hod-leaves", authMiddleware, checkRole("teacher"), getHodDutyLeaves);
router.put("/hod-approval", authMiddleware, checkRole("teacher"), hodApproval);

// 🔹 Admin route
router.get("/all", authMiddleware, checkRole("admin"), getAllDutyLeaves);

module.exports = router;