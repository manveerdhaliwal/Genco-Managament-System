// models/Society.js
const mongoose = require("mongoose");

const SocietySchema = new mongoose.Schema(
  {
    society_name: { type: String, required: true, trim: true },
    society_contact_person: { type: String, required: true, trim: true },
    society_contact_person_phone_no: { type: String, required: true, trim: true },
    applied_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Society || mongoose.model("Society", SocietySchema);
