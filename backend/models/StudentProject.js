const mongoose = require("mongoose");

const StudentProjectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    projectDescription: {
      type: String,
      required: true,
      trim: true,
    },

    projectGuide: {
      type: String,
      required: true,
      trim: true,
    },

    projectStatus: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },

    githubRepoUrl: {
      type: String,
      trim: true,
    },

    hostedUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate project names per student
StudentProjectSchema.index({ student: 1, projectName: 1 }, { unique: true });

try {
  StudentProjectSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {}

module.exports = mongoose.model("StudentProject", StudentProjectSchema);
