const express = require("express");
const router = express.Router();
const { getSocieties, createSociety } = require("../controllers/societyController");

// GET all societies
router.get("/", getSocieties);

// POST new society
router.post("/", createSociety);

module.exports = router;
