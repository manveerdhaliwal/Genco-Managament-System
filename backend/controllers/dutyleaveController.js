const DutyLeave = require("../models/DutyLeave");
const Student = require("../models/Student");

// Create a new Duty Leave
exports.createDutyLeave = async (req, res) => {
  try {
    const { studentId, event_name, event_venue, event_date, reason, certificate_url } = req.body;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const dutyLeave = new DutyLeave({
      student: student._id,
      event_name,
      event_venue,
      event_date,
      reason,
      certificate_url,
    });

    await dutyLeave.save();
    res.status(201).json(dutyLeave);
  } catch (error) {
    res.status(500).json({ message: "Error creating duty leave", error });
  }
};

// Get all duty leaves (optionally filter by student)
exports.getDutyLeaves = async (req, res) => {
  try {
    const leaves = await DutyLeave.find().populate("student", "name CRN branch");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching duty leaves", error });
  }
};

// Update approval status (by HoD / Mentor)
exports.updateApproval = async (req, res) => {
  try {
    const { leaveId, hod_approval, mentor_approval } = req.body;

    const leave = await DutyLeave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (hod_approval) leave.hod_approval = hod_approval;
    if (mentor_approval) leave.mentor_approval = mentor_approval;

    await leave.save();
    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error updating approval", error });
  }
};
