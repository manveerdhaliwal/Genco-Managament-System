// routes/branchRoutes.js
const express = require("express");
const StudentBranch = require("../models/StudentBranch");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const branches = await StudentBranch.find();
    res.json({ success: true, branches });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch branches" });
  }
});

module.exports = router;
