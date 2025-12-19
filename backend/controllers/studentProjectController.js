const StudentProject = require("../models/StudentProject");

// 🔹 Create OR Update Project
const createProject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      projectName,
      projectDescription,
      projectGuide,
      projectStatus,
      githubRepoUrl,
      hostedUrl,
    } = req.body;

    // Check if project already exists (same name)
    let existing = await StudentProject.findOne({
      student: studentId,
      projectName,
    });

    if (existing) {
      existing = await StudentProject.findOneAndUpdate(
        { student: studentId, projectName },
        {
          projectDescription,
          projectGuide,
          projectStatus,
          githubRepoUrl,
          hostedUrl,
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Project updated!",
        data: existing,
      });
    }

    // Create new project
    const newProject = new StudentProject({
      student: studentId,
      projectName,
      projectDescription,
      projectGuide,
      projectStatus,
      githubRepoUrl,
      hostedUrl,
    });

    await newProject.save();
    await newProject.populate("student", "name email URN section year");

    res.status(201).json({
      success: true,
      message: "Project saved!",
      data: newProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get Logged-in Student Projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await StudentProject.find({
      student: req.user.id,
    }).populate("student", "name email URN section year");

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update Project by ID
const updateProject = async (req, res) => {
  try {
    const updated = await StudentProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("student", "name email URN section year");

    if (!updated)
      return res.status(404).json({ success: false, message: "Project not found" });

    res.json({
      success: true,
      message: "Project updated!",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Admin/Teacher
const getAllProjects = async (req, res) => {
  const projects = await StudentProject.find().populate(
    "student",
    "name email URN section year"
  );
  res.json({ success: true, data: projects });
};

const getProjectsByStudent = async (req, res) => {
  const projects = await StudentProject.find({
    student: req.params.studentId,
  }).populate("student", "name email URN section year");

  res.json({ success: true, data: projects });
};

module.exports = {
  createProject,
  getMyProjects,
  updateProject,
  getAllProjects,
  getProjectsByStudent,
};
