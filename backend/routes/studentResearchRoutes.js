const express = require("express");
const router = express.Router();
const { saveResearchPaper, getMyResearchPapers, getStudentResearch , getBranchResearchPapers } = require("../controllers/studentResearchController");
const { authMiddleware } = require("../controllers/auth-controller");
const checkRole = require("../middlewares/roleMiddleware");

// student fills/updates research paper (only students)
router.post("/save", authMiddleware, checkRole("student"), saveResearchPaper);

// student sees their own research papers
router.get("/me", authMiddleware, checkRole("student"), getMyResearchPapers);


// teacher/admin fetch all research papers
router.get("/studentpapers", authMiddleware, checkRole("teacher", "admin"), getBranchResearchPapers);

// teacher/admin fetch research papers of any student by ID
router.get("/:studentId", authMiddleware, checkRole("teacher", "admin"), getStudentResearch);


module.exports = router;
