const mongoose = require("mongoose");

const StudentTrainingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },
    trainingField: {
      type: String,
      enum: ["TR101", "TR102", "TR103"],
      required: true,
    },
    organisationName: {
      type: String,
      required: true,
    },
    organisationDetails: {
      type: String,
      required: true,
    },
    organisationSupervisor: {
      type: String,
      required: true,
    },
    fieldOfWork: {
      type: String,
      required: true,
    },
    projectsMade: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    trainingDuration: {
      type: String,
      required: true, // make it required so student must enter like "4 weeks" or "6 weeks"
    },
    certificateAwarded: {
      type: Boolean,
      required: true,
      default: false,
    },
    certificatepdf: {
      type: String,
      required: function () {
        return this.certificateAwarded;
      },
    },
  },
  { timestamps: true }
);

// Compound unique index: one record per student per trainingField
StudentTrainingSchema.index({ student: 1, trainingField: 1 }, { unique: true });

try {
  StudentTrainingSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {}

const StudentTraining = mongoose.model("StudentTraining", StudentTrainingSchema);

module.exports =
  mongoose.models.StudentTraining || mongoose.model("StudentTraining", StudentTrainingSchema);
