const express = require("express");
const router = express.Router();
const {
  saveCertificate,
  getMyCertificates,
  getStudentCertificates,
  getBranchCertificates,
} = require("../controllers/studentCertificateController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");
const { upload } = require("../config/cloudinary");

// Student
router.post("/save", authMiddleware, upload.single("certificateFile"), saveCertificate);

router.get("/me", authMiddleware,checkRole("student"), getMyCertificates);

// Teacher/Admin
router.get("/all", authMiddleware,checkRole("teacher", "admin"), getBranchCertificates);
router.get("/:studentId", authMiddleware,checkRole("teacher", "admin"), getStudentCertificates);

module.exports = router;
