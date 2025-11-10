const express = require("express");
const {
  signup , login , logout , authMiddleware,getMe
} = require("../controllers/auth-controller")

const router = express.Router();

// 🔹 Signup route
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/check-auth",authMiddleware , (req,res) =>{
  const user = req.user;
  res.status(200).json({
    success:true,
    message: "Authenticated user!",
    user,
  })
  
});

router.get("/me", authMiddleware, getMe);

module.exports = router;