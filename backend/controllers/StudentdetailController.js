const mongoose = require("mongoose");
const StudentInfo = require("../models/StudentInfo");
const StudentTraining = require("../models/StudentTraining");
const StudentCertificate = require("../models/StudentCertificate");

exports.getStudentFullDetail = async (req, res) => {
  const { studentId } = req.params;

  // Validate studentId
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing studentId" });
  }

  try {
    const personalInfo = await StudentInfo.findOne({ student: studentId }).populate(
      "advisor",
      "name email"
    );

    const trainingInfo = await StudentTraining.find({ student: studentId });
    const certificates = await StudentCertificate.find({ student: studentId });

    if (!personalInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Student info not found" });
    }

    res.json({
      success: true,
      personalInfo,
      trainingInfo,
      certificates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
