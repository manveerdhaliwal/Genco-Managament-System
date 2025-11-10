const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true }, // ← use Date type
    description: { type: String },
  },
  { timestamps: true }
);

module.exports =  mongoose.models.Event || mongoose.model("Event", EventSchema);
