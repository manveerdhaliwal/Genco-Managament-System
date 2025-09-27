const StudentTraining = require("../models/StudentTraining");

// 🟢 Create Training Form (Student only)
const createTraining = async (req, res) => {
  try {
    const newForm = new StudentTraining({
      ...req.body,
      student: req.user.id, // studentId from token
    });

    await newForm.save();
    res.status(201).json({
      success: true,
      message: "Training form submitted successfully!",
      data: newForm,
    });
  } catch (error) {
    console.error("Create training error:", error);
    res.status(500).json({ success: false, message: "Error creating training form" });
  }
};

// 🟢 Get own training forms (Student only)
const getMyTraining = async (req, res) => {
  try {
    const forms = await StudentTraining.find({ student: req.user.id });
    res.json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching forms" });
  }
};

// 🟢 Update Training Form (Student only)
const updateTraining = async (req, res) => {
  try {
    const updatedForm = await StudentTraining.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id }, // only update own form
      req.body,
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ success: false, message: "Form not found or not yours!" });
    }

    res.json({ success: true, message: "Form updated successfully", data: updatedForm });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating form" });
  }
};

// 🟢 Get all forms (Teacher/Admin only)
const getAllTraining = async (req, res) => {
  try {
    const forms = await StudentTraining.find().populate("student", "name email branch year");
    res.json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all forms" });
  }
};

// 🟢 Get forms by student ID (Teacher/Admin only)
const getTrainingByStudent = async (req, res) => {
  try {
    const forms = await StudentTraining.find({ student: req.params.studentId })
      .populate("student", "name email branch year");
    res.json({ success: true, data: forms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching forms" });
  }
};

module.exports = {
  createTraining,
  getMyTraining,
  updateTraining,
  getAllTraining,
  getTrainingByStudent,
};
