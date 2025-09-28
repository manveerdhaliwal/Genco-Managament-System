const express = require("express");
const router = express.Router();
const { getSocieties, addSociety } = require("../controllers/societyController");

router.get("/", getSocieties);
router.post("/", addSociety);

module.exports = router;
