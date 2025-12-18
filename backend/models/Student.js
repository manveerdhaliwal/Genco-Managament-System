const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentBranch",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    CRN: {
      type: String,
      required: true,
      unique: true,
    },
    URN: {
      type: String,
      required: true,
      unique: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
