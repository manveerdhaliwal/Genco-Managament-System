const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const StudentBranch = require("../models/StudentBranch");
const dotenv = require("dotenv");

// 🔹 Signup route
const signup = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      role,
      branch,
      year,
      semester,
      section, // <-- Add section here
      CRN,
      URN,
      Emp_id,
    } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }

    // 🔍 Check if email already exists
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingStudent || existingTeacher) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists!" });
    }

    // 🔍 Role-based validation
    if (role === "student") {
      if (!branch || !year || !CRN || !section) { // <-- Validate section
        return res.status(400).json({
          success: false,
          message: "Branch, Year, Section, and CRN are required for students!",
        });
      }

      // ✅ Validate branch exists
      const branchDoc = await StudentBranch.findById(branch);
      if (!branchDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid branch selected" });
      }

      const existingCRN = await Student.findOne({ CRN });
      if (existingCRN) {
        return res
          .status(400)
          .json({ success: false, message: "CRN already exists!" });
      }
    }

    if (role === "teacher") {
      if (!Emp_id || !branch) {
        return res.status(400).json({
          success: false,
          message: "Employee ID and branch are required for teachers!",
        });
      }

      // ✅ Validate branch exists
      const branchDoc = await StudentBranch.findById(branch);
      if (!branchDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid branch selected" });
      }

      const existingEmp = await Teacher.findOne({ Emp_id });
      if (existingEmp) {
        return res
          .status(400)
          .json({ success: false, message: "Employee ID already exists!" });
      }
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 📝 Create user in correct collection
    let newUser;
    if (role === "student") {
      newUser = new Student({
        username,
        name,
        email,
        password: hashedPassword,
        role,
        branch,
        year,
        semester,
        section, // <-- Pass section to the model
        CRN,
        URN,
      });
    } else if (role === "teacher") {
      newUser = new Teacher({
        username,
        name,
        email,
        password: hashedPassword,
        role,
        Emp_id,
        branch,
      });
    }

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during signup." });
  }
};

// 🔹 Login route
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // check if user exists
    let user;
    if (role === "student") user = await Student.findOne({ email });
    if (role === "teacher") user = await Teacher.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist! Please register first",
      });
    }

    // check role
    if (user.role !== role) {
      return res.status(400).json({
        success: false,
        message: "Invalid role for this account!",
      });
    }

    // check password
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      message: "Login successful",
      token, // optional
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};

// 🔹 Logout route
const logout = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

// 🔹 Auth middleware
const authMiddleware = async (req, res, next) => {
  // get token from cookie OR authorization header
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token!" });
  }
};

// ✅ Get Logged-in User Details
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let user;

    if (userRole === "student") {
      user = await Student.findById(userId).select("-password");
    } else if (userRole === "teacher") {
      user = await Teacher.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { signup, login, logout, authMiddleware, getMe };
