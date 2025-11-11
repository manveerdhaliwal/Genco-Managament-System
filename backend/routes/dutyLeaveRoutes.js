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

// 🔹 Advisor routes (teachers viewing their mentees' leaves)
router.get("/advisor-leaves", authMiddleware, checkRole("teacher"), getAdvisorDutyLeaves);
router.put("/advisor-approval", authMiddleware, checkRole("teacher"), advisorApproval);

// 🔹 HoD routes
router.get("/hod-leaves", authMiddleware, checkRole("teacher"), getHodDutyLeaves);
router.put("/hod-approval", authMiddleware, checkRole("teacher"), hodApproval);

// 🔹 Combined route for teachers (returns both advisor and hod leaves)
router.get("/teacher", authMiddleware, checkRole("teacher"), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Get leaves where teacher is advisor
    const advisorLeaves = await require("../models/DutyLeave")
      .find({ advisor: teacherId })
      .populate({
        path: "student",
        select: "name email CRN URN section year branch",
        populate: { path: "branch", select: "name" }
      })
      .populate("advisor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: advisorLeaves });
  } catch (error) {
    console.error("Error fetching teacher leaves:", error);
    res.status(500).json({ success: false, message: "Error fetching duty leaves" });
  }
});

// 🔹 Admin route
router.get("/all", authMiddleware, checkRole("admin"), getAllDutyLeaves);

module.exports = router;