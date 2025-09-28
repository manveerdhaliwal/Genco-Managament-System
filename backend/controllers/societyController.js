const Society = require("../models/Society");

// GET all societies (fetch only present values in DB)
exports.getSocieties = async (req, res) => {
  try {
    const societies = await Society.find(); // ✅ only present DB values
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching societies", error });
  }
};

// POST new society (optional, future admin use)
exports.createSociety = async (req, res) => {
  try {
    const { society_name, society_contact_person, society_contact_person_phone_no } = req.body;
    const society = new Society({
      society_name,
      society_contact_person,
      society_contact_person_phone_no
    });
    await society.save();
    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ message: "Error adding society", error });
  }
};

module.exports = {
  getSocieties,
  createSociety
};