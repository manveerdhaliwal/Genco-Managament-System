const DutyLeave = require("../models/DutyLeave");
const Student = require("../models/Student");
const StudentInfo = require("../models/StudentInfo");
const Teacher = require("../models/Teacher");

// 🔹 Student creates duty leave
const createDutyLeave = async (req, res) => {
  try {
    const studentId = req.user.id; // Token se student ID
    const { event_name, event_venue, event_date, reason, certificate_url } = req.body;

    // Validate student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Get student's advisor from StudentInfo
    const studentInfo = await StudentInfo.findOne({ student: studentId }).populate("advisor");
    if (!studentInfo || !studentInfo.advisor) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill your student information first to select an advisor" 
      });
    }

    // Create duty leave with advisor automatically assigned
    const dutyLeave = new DutyLeave({
      student: studentId,
      advisor: studentInfo.advisor._id,
      event_name,
      event_venue,
      event_date,
      reason,
      certificate_url,
      overall_status: "Pending"
    });

    await dutyLeave.save();
    
    // Populate data for response
    await dutyLeave.populate([
      { path: "student", select: "name email CRN branch" },
      { path: "advisor", select: "name email" }
    ]);

    res.status(201).json({ 
      success: true, 
      message: "Duty leave submitted successfully! Sent to your advisor for approval.", 
      data: dutyLeave 
    });
  } catch (error) {
    console.error("Error creating duty leave:", error);
    res.status(500).json({ success: false, message: "Error creating duty leave", error: error.message });
  }
};

// 🔹 Get logged-in student's duty leaves
const getMyDutyLeaves = async (req, res) => {
  try {
    const studentId = req.user.id;

    const leaves = await DutyLeave.find({ student: studentId })
      .populate("student", "name email CRN")
      .populate("advisor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching duty leaves:", error);
    res.status(500).json({ success: false, message: "Error fetching duty leaves" });
  }
};

// 🔹 Get all duty leaves for advisor (only assigned to them)
const getAdvisorDutyLeaves = async (req, res) => {
  try {
    const teacherId = req.user.id; // Logged-in teacher/advisor

    const leaves = await DutyLeave.find({ advisor: teacherId })
      .populate("student", "name email CRN URN section year branch")
      .populate("advisor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching advisor duty leaves:", error);
    res.status(500).json({ success: false, message: "Error fetching duty leaves" });
  }
};

// 🔹 Advisor updates approval status
const advisorApproval = async (req, res) => {
  try {
    const teacherId = req.user.id; // Logged-in teacher
    const { leaveId, advisor_approval, advisor_remarks } = req.body;

    // Validate approval status
    if (!["Approved", "Rejected"].includes(advisor_approval)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid approval status. Must be 'Approved' or 'Rejected'" 
      });
    }

    // Find leave and check if this teacher is the assigned advisor
    const leave = await DutyLeave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ success: false, message: "Duty leave not found" });
    }

    // Security check - only assigned advisor can approve/reject
    if (leave.advisor.toString() !== teacherId) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to approve this duty leave" 
      });
    }

    // Update advisor approval
    leave.advisor_approval = advisor_approval;
    leave.advisor_action_date = new Date();
    
    if (advisor_remarks) {
      leave.advisor_remarks = advisor_remarks;
    }

    // Update overall status
    if (advisor_approval === "Approved") {
      leave.overall_status = "Advisor Approved";
      leave.hod_approval = "Pending"; // Now HoD needs to approve
    } else {
      leave.overall_status = "Rejected";
      leave.hod_approval = "Not Required"; // HoD approval not needed if advisor rejected
    }

    await leave.save();
    
    await leave.populate([
      { path: "student", select: "name email CRN" },
      { path: "advisor", select: "name email" }
    ]);

    res.status(200).json({ 
      success: true, 
      message: advisor_approval === "Approved" 
        ? "Duty leave approved! Sent to HoD for final approval." 
        : "Duty leave rejected!",
      data: leave 
    });
  } catch (error) {
    console.error("Error updating advisor approval:", error);
    res.status(500).json({ success: false, message: "Error updating approval" });
  }
};

// 🔹 Get all duty leaves for HoD (where advisor approved and HoD approval pending)
const getHodDutyLeaves = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get teacher's branch to see all leaves from that branch
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // Find all students in same branch
    const students = await Student.find({ branch: teacher.branch }).select("_id");
    const studentIds = students.map(s => s._id);

    // Get leaves where advisor approved and HoD approval pending
    const leaves = await DutyLeave.find({ 
      student: { $in: studentIds },
      advisor_approval: "Approved",
      hod_approval: "Pending"
    })
      .populate({
        path: "student",
        select: "name email CRN URN section year branch",
        populate: { path: "branch", select: "name" }
      })
      .populate("advisor", "name email")
      .sort({ advisor_action_date: 1 }); // Oldest first

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching HoD duty leaves:", error);
    res.status(500).json({ success: false, message: "Error fetching duty leaves" });
  }
};

// 🔹 HoD updates final approval status
const hodApproval = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { leaveId, hod_approval, hod_remarks } = req.body;

    // Validate approval status
    if (!["Approved", "Rejected"].includes(hod_approval)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid approval status. Must be 'Approved' or 'Rejected'" 
      });
    }

    const leave = await DutyLeave.findById(leaveId)
      .populate("student", "name email CRN branch");
    
    if (!leave) {
      return res.status(404).json({ success: false, message: "Duty leave not found" });
    }

    // Check if advisor has approved
    if (leave.advisor_approval !== "Approved") {
      return res.status(400).json({ 
        success: false, 
        message: "Advisor has not approved this leave yet" 
      });
    }

    // Check if HoD is from same branch as student
    const teacher = await Teacher.findById(teacherId);
    if (teacher.branch.toString() !== leave.student.branch.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only approve leaves from your branch" 
      });
    }

    // Update HoD approval
    leave.hod_approval = hod_approval;
    leave.hod_action_date = new Date();
    
    if (hod_remarks) {
      leave.hod_remarks = hod_remarks;
    }

    // Update overall status
    if (hod_approval === "Approved") {
      leave.overall_status = "Fully Approved";
    } else {
      leave.overall_status = "Rejected";
    }

    await leave.save();
    
    await leave.populate([
      { path: "student", select: "name email CRN" },
      { path: "advisor", select: "name email" }
    ]);

    res.status(200).json({ 
      success: true, 
      message: `Duty leave ${hod_approval.toLowerCase()} by HoD!`,
      data: leave 
    });
  } catch (error) {
    console.error("Error updating HoD approval:", error);
    res.status(500).json({ success: false, message: "Error updating approval" });
  }
};

// 🔹 Get all duty leaves (Admin only)
const getAllDutyLeaves = async (req, res) => {
  try {
    const leaves = await DutyLeave.find()
      .populate({
        path: "student",
        select: "name email CRN branch",
        populate: { path: "branch", select: "name" }
      })
      .populate("advisor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching all duty leaves:", error);
    res.status(500).json({ success: false, message: "Error fetching duty leaves" });
  }
};

module.exports = {
  createDutyLeave,
  getMyDutyLeaves,
  getAdvisorDutyLeaves,
  advisorApproval,
  getHodDutyLeaves,
  hodApproval,
  getAllDutyLeaves,
};