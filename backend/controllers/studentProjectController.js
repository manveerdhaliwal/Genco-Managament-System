const StudentProject = require("../models/StudentProject");

// Create new project (Student only)
const createProject = async (req, res) => {
  try {
    const newProject = new StudentProject({
      ...req.body,
      student: req.user.id, // studentId from token
    });

    await newProject.save();
    res.status(201).json({ success: true, message: "Project created successfully!", data: newProject });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ success: false, message: "Error creating project" });
  }
};

// Get own projects (Student only)
const getMyProjects = async (req, res) => {
  try {
    const projects = await StudentProject.find({ student: req.user.id });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching projects" });
  }
};

// Update project (Student only)
const updateProject = async (req, res) => {
  try {
    const updatedProject = await StudentProject.findOneAndUpdate(
      { _id: req.params.id, student: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ success: false, message: "Project not found or not yours!" });
    }

    res.json({ success: true, message: "Project updated successfully", data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating project" });
  }
};

// Teacher/Admin: Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await StudentProject.find().populate("student", "name email");
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all projects" });
  }
};

// Teacher/Admin: Get projects by student ID
const getProjectsByStudent = async (req, res) => {
  try {
    const projects = await StudentProject.find({ student: req.params.studentId }).populate("student", "name email");
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching student projects" });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  updateProject,
  getAllProjects,
  getProjectsByStudent,
};
