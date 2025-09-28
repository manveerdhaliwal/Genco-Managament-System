const mongoose = require("mongoose");

const DutyLeaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    event_name: { type: String, required: true },
    event_venue: { type: String, required: true },
    event_date: { type: Date, required: true },
    certificate_url: { type: String }, // uploaded certificate file link
    reason: { type: String, required: true },

    // Approval status
    hod_approval: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    mentor_approval: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DutyLeave", DutyLeaveSchema);
