const StudentResearch = require("../models/StudentResearch");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

// 🔹 Add / Update Research Paper
const saveResearchPaper = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware
    const info = req.body;

    let existing = await StudentResearch.findOne({ student: studentId, paperTitle: info.paperTitle });

    if (existing) {
      existing = await StudentResearch.findOneAndUpdate(
        { _id: existing._id },
        { $set: info },
        { new: true }
      );
      return res.json({ success: true, message: "Research paper updated!", data: existing });
    }

    const newPaper = new StudentResearch({
      ...info,
      student: studentId,
    });

    await newPaper.save();
    await newPaper.populate("student", "name email role");

    res.status(201).json({ success: true, message: "Research paper saved!", data: newPaper });

  } catch (error) {
    console.error("Error saving research paper:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get logged-in student's research papers
const getMyResearchPapers = async (req, res) => {
  try {
    const studentId = req.user.id;
    const papers = await StudentResearch.find({ student: studentId }).sort({ date: -1 });

    res.json({ success: true, data: papers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Teacher/Admin: Get research papers of students in same branch
const getBranchResearchPapers = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!teacher.branch) {
      return res.status(400).json({ success: false, message: "Teacher has no branch assigned" });
    }

    // Find students in same branch
    const students = await Student.find({ branch: teacher.branch }).select("_id");

    if (!students.length) {
      return res.status(404).json({ success: false, message: "No students found in your branch" });
    }

    const studentIds = students.map((s) => s._id);

    const papers = await StudentResearch.find({ student: { $in: studentIds } })
      .populate({
        path: "student",
        select: "name URN section year branch",
        populate: { path: "branch", select: "name" },
      })
      .sort({ date: -1 });

    if (!papers.length) {
      return res.status(200).json({ success: false, message: "No research papers found for your branch" });
    }

    res.json({ success: true, data: papers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Teacher/Admin: Get research papers of any student by ID
const getStudentResearch = async (req, res) => {
  try {
    const { studentId } = req.params;
    const papers = await StudentResearch.find({ student: studentId }).sort({ date: -1 });

    if (!papers || papers.length === 0) {
      return res.status(404).json({ success: false, message: "No research papers found!" });
    }

    res.json({ success: true, data: papers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { 
  saveResearchPaper, 
  getMyResearchPapers, 
  getStudentResearch,
  getBranchResearchPapers 
};
