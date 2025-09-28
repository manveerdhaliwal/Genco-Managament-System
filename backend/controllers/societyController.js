const Society = require("../models/Society");

const getSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching societies", error });
  }
};

const addSociety = async (req, res) => {
  try {
    const { society_name, society_contact_person, society_contact_person_phone_no } = req.body;
    const society = new Society({ society_name, society_contact_person, society_contact_person_phone_no });
    await society.save();
    res.status(201).json(society);
  } catch (error) {
    res.status(500).json({ message: "Error adding society", error });
  }
};

module.exports = { getSocieties, addSociety };
