// seedBranches.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const StudentBranch = require("./models/StudentBranch");

dotenv.config();

const branches = [
  { name: "Computer Science & Engineering", code: "CSE" },
  { name: "Information Technology", code: "IT" },
  { name: "Electronics & Communication", code: "ECE" },
  { name: "Mechanical Engineering", code: "ME" },
  { name: "Civil Engineering", code: "CE" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await StudentBranch.deleteMany({});
    await StudentBranch.insertMany(branches);
    console.log("Branches seeded successfully");
    process.exit();
  })
  .catch(err => console.error(err));
