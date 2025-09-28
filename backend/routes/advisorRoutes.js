const express = require("express");
const { getTeachersByBranch } = require("../controllers/advisorController");
const { authMiddleware } = require("../controllers/auth-controller");

const router = express.Router();

// GET /api/teachers/my-branch
router.get("/my-branch", authMiddleware, getTeachersByBranch);

module.exports = router;
