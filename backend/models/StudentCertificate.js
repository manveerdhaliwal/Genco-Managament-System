const mongoose = require("mongoose");

const StudentCertificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },
    type: {
      type: String,
      enum: ["Technical", "Cultural", "Sport"],
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    certificateUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

try {
  StudentCertificateSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {
  // mongoose-autopopulate not installed
}

const StudentCertificate = mongoose.model("StudentCertificate", StudentCertificateSchema);

module.exports = StudentCertificate;
