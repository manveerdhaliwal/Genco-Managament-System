const mongoose = require("mongoose");

const StudentResearchSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },
    type: {
      type: String,
      enum: ["Journal", "Conference", "Workshop"],
      required: true,
    },
    paperTitle: {
      type: String,
      required: true,
      trim: true,
    },
    journalName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    linkOfPaper: {
      type: String,
      required: true,
      trim: true,
    },
    doi: {
      type: String,
      trim: true,
    },
    facultyMentor: {
      type: String,
      //required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

try {
  StudentResearchSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {
  // mongoose-autopopulate not installed
}

const StudentResearch = mongoose.model("StudentResearch", StudentResearchSchema);

module.exports = StudentResearch;
