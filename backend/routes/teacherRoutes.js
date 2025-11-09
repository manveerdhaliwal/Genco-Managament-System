// const express = require("express");
// const { getAdvisorsForStudent } = require("../controllers/advisorController");

// const router = express.Router();

// // API endpoint: GET /api/teachers/advisors/:studentId
// router.get("/advisors/:studentId", getAdvisorsForStudent);

// module.exports = router;

const express = require("express");
const { getAllTeachers } = require("../controllers/teacherController2");

const router = express.Router();

// ✅ Fetch all teachers
router.get("/all", getAllTeachers);

module.exports = router;
