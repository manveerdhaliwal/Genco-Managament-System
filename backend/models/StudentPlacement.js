const mongoose = require("mongoose");

const StudentPlacementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      autopopulate: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    package: {
      type: String,
      required: true,
      trim: true,
    },
    companyDescription: {
      type: String,
      required: true,
      trim: true,
    },
    offerLetterUrl: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfPlacement: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

try {
  StudentPlacementSchema.plugin(require("mongoose-autopopulate"));
} catch (e) {
  // mongoose-autopopulate not installed
}

const StudentPlacement = mongoose.model("StudentPlacement", StudentPlacementSchema);

module.exports = StudentPlacement;
