// models/Society.js
import mongoose from "mongoose";

const SocietySchema = new mongoose.Schema(
  {
    society_name: { type: String, required: true, trim: true },
    society_contact_person: { type: String, required: true, trim: true },
    society_contact_person_phone_no: { type: String, required: true, trim: true },
    applied_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Society || mongoose.model("Society", SocietySchema);
