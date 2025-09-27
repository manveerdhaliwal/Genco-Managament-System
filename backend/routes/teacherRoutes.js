const express = require("express");
const { getAdvisorsForStudent } = require("../controllers/teacherController");

const router = express.Router();

// API endpoint: GET /api/teachers/advisors/:studentId
router.get("/advisors/:studentId", getAdvisorsForStudent);

module.exports = router;