const express = require("express");
const { getAdvisorsForStudent } = require("../controllers/advisorController");

const router = express.Router();

// API endpoint: GET /api/teachers/advisors/:studentId
router.get("/advisors/:studentId", getAdvisorsForStudent);

module.exports = router;