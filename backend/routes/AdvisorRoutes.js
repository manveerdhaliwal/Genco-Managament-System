// const express = require("express");
// const router = express.Router();
// const Teacher = require("../models/Teacher");
// const { authMiddleware } = require("../controllers/auth-controller");
// const checkRole = require("../middlewares/roleMiddleware");


// // ✅ Get all teachers in a given branch
// router.get("/by-branch/:branchId", authMiddleware, async (req, res) => {
//   try {
//     const { branchId } = req.params;
//     const teachers = await Teacher.find({ branch: branchId }).select("name email");

//     if (!teachers || teachers.length === 0) {
//       return res.status(404).json({ success: false, message: "No teachers found for this branch" });
//     }

//     res.json({ success: true, data: teachers });
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const { getAllTeachers } = require("../controllers/teacherController2");

const router = express.Router();

// ✅ Fetch all teachers
router.get("/all", getAllTeachers);

module.exports = router;