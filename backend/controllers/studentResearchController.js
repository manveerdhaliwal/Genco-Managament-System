const StudentResearch = require("../models/StudentResearch");

// 🔹 Add / Update Research Paper
const saveResearchPaper = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware
    const info = req.body;

    // check if this exact paper already exists (optional)
    // e.g., using paperTitle + type
    let existing = await StudentResearch.findOne({ student: studentId, paperTitle: info.paperTitle });

    if (existing) {
      // update if exists
      existing = await StudentResearch.findOneAndUpdate(
        { _id: existing._id },
        { $set: info },
        { new: true }
      );
      return res.json({ success: true, message: "Research paper updated!", data: existing });
    }

    // create new record
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

// 🔹 Teacher/Admin: Get all research papers of all students
const getAllResearchPapers = async (req, res) => {
  try {
    const papers = await StudentResearch.find()
      .populate("student", "name email role")
      .sort({ date: -1 });

    if (!papers || papers.length === 0) {
      return res.status(404).json({ success: false, message: "No research papers found!" });
    }

    res.json({ success: true, data: papers });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { saveResearchPaper, getMyResearchPapers, getStudentResearch ,getAllResearchPapers };
