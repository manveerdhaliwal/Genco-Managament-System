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

// Compound unique index to prevent a student from having duplicate project names
StudentProjectSchema.index({ student: 1, projectName: 1 }, { unique: true });

try {
  StudentProjectSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {
  // mongoose-autopopulate not installed
}

const StudentProject = mongoose.model("StudentProject", StudentProjectSchema);

module.exports = StudentProject;

