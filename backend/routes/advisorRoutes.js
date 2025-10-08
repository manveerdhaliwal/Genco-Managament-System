const express = require("express");
const { getAdvisorsForStudent, getMyAdvisors } = require("../controllers/advisorController");
const { authMiddleware } = require("../controllers/auth-controller");
const router = express.Router();

// GET /api/advisors/my-advisors - Get advisors for logged-in student (same branch)
router.get("/my-advisors", authMiddleware, getMyAdvisors);

// GET /api/advisors/student/:studentId - Get advisors for specific student
router.get("/advisors/:studentId", authMiddleware, getAdvisorsForStudent);

module.exports = router;