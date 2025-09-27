const mongoose = require("mongoose");

const StudentCertificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },
    nameOfCertification: {
      type: String,
      required: true,
      trim: true,
    },
    organisationDetails: {
      type: String,
      required: true,
      trim: true,
    },
    certificationDocument: {
      type: String, // Should be a URL to the uploaded document
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent a student from having duplicate certifications
StudentCertificationSchema.index({ student: 1, nameOfCertification: 1 }, { unique: true });

try {
  StudentCertificationSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {
  // mongoose-autopopulate not installed
}

const StudentCertification = mongoose.model(
  "StudentCertification",
  StudentCertificationSchema
);

module.exports = StudentCertification;

