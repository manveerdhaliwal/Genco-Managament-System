const express = require("express");
const { getStudentFullDetail } = require("../controllers/StudentdetailController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// teacher/admin fetch full student details
router.get("/full/:studentId", authMiddleware, checkRole("teacher", "admin"), getStudentFullDetail);

module.exports = router;
