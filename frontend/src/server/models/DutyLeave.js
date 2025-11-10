const mongoose = require("mongoose");

const DutyLeaveSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    event_name: { 
      type: String, 
      required: true 
    },
    event_venue: { 
      type: String, 
      required: true 
    },
    event_date: { 
      type: Date, 
      required: true 
    },
    certificate_url: { 
      type: String 
    },
    reason: { 
      type: String, 
      required: true 
    },

    // Level 1: Advisor approval
    advisor_approval: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected"], 
      default: "Pending" 
    },
    advisor_remarks: {
      type: String,
      default: ""
    },
    advisor_action_date: {
      type: Date
    },

    // Level 2: HoD approval
    hod_approval: { 
      type: String, 
      enum: ["Pending", "Approved", "Rejected", "Not Required"], 
      default: "Not Required"
    },
    hod_remarks: {
      type: String,
      default: ""
    },
    hod_action_date: {
      type: Date
    },

    overall_status: {
      type: String,
      enum: ["Pending", "Advisor Approved", "Fully Approved", "Rejected"],
      default: "Pending"
    }
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.DutyLeave || mongoose.model("DutyLeave", DutyLeaveSchema);
