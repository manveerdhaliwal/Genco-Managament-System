// models/student_branch.js
const mongoose = require("mongoose");

const StudentBranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "CSE"
    code: { type: Number, required: true, unique: true }, // e.g. 101
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentBranch", StudentBranchSchema);
