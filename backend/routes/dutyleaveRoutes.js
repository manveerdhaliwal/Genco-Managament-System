const express = require("express");
const router = express.Router();
const { createDutyLeave, getDutyLeaves, updateApproval } = require("../controllers/dutyLeaveController");

// Student creates duty leave
router.post("/", createDutyLeave);

// Get all duty leaves
router.get("/", getDutyLeaves);

// HoD / Mentor updates approval
router.put("/approval", updateApproval);

module.exports = router;
