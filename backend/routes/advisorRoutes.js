const express = require("express");
const { getTeachersByBranch } = require("../controllers/advisorController");
const { authMiddleware } = require("../controllers/auth-controller");
const { getAdvisorsForStudent } = require("../controllers/advisorController");
const router = express.Router();

// GET /api/teachers/my-branch
router.get("/my-branch", authMiddleware, getTeachersByBranch);
router.get("/advisors/:studentId", authMiddleware, getAdvisorsForStudent);

module.exports = router;
