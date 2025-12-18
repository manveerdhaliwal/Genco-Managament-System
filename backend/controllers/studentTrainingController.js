const StudentTraining = require("../models/StudentTraining");
const { uploadToCloudinary } = require("../config/cloudinary");

// 🔹 Create Training (with PDF upload)
const createTraining = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      trainingField,
      organisationName,
      organisationDetails,
      organisationSupervisor,
      fieldOfWork,
      projectsMade,
      projectDescription,
      trainingDuration,
      certificateAwarded,
    } = req.body;

    let certificatepdfUrl = "";

    // Upload PDF to Cloudinary if file exists
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "student_trainings"
      );
      certificatepdfUrl = result.secure_url;
    }

    // Check if training already exists
    let existing = await StudentTraining.findOne({
      student: studentId,
      trainingField,
    });
    if (existing) {
      existing = await StudentTraining.findOneAndUpdate(
        { student: studentId, trainingField },
        {
          trainingField,
          organisationName,
          organisationDetails,
          organisationSupervisor,
          fieldOfWork,
          projectsMade,
          projectDescription,
          trainingDuration,
          certificateAwarded,
          certificatepdf: certificatepdfUrl || existing.certificatepdf,
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Training updated!",
        data: existing,
      });
    }

    // Create new training
    const newTraining = new StudentTraining({
      student: studentId,
      trainingField,
      organisationName,
      organisationDetails,
      organisationSupervisor,
      fieldOfWork,
      projectsMade,
      projectDescription,
      trainingDuration,
      certificateAwarded,
      certificatepdf: certificatepdfUrl,
    });

    await newTraining.save();
    await newTraining.populate("student", "name email role URN section year");

    res
      .status(201)
      .json({ success: true, message: "Training saved!", data: newTraining });
  } catch (error) {
    console.error("Error creating training:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's trainings
const getMyTraining = async (req, res) => {
  try {
    const studentId = req.user.id;
    const trainings = await StudentTraining.find({
      student: studentId,
    }).populate("student", "name email role URN section year");
    res.json({ success: true, data: trainings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update training by ID
const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "student_trainings"
      );
      updates.certificatepdf = result.secure_url;
    }

    const updated = await StudentTraining.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("student", "name email role URN section year");
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Training not found" });

    res.json({ success: true, message: "Training updated!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: get all trainings
const getAllTraining = async (req, res) => {
  try {
    const trainings = await StudentTraining.find().populate(
      "student",
      "name email role URN section year"
    );
    res.json({ success: true, data: trainings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: get trainings of a specific student
const getTrainingByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const trainings = await StudentTraining.find({
      student: studentId,
    }).populate("student", "name email role URN section year");
    res.json({ success: true, data: trainings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createTraining,
  getMyTraining,
  updateTraining,
  getAllTraining,
  getTrainingByStudent,
};
