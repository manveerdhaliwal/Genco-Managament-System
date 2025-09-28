// seedSocieties.js
const mongoose = require("mongoose");
const Society = require("./models/Society"); // adjust path if needed

// 🔹 MongoDB connection
//const MONGO_URI = process.env.MONGO_URI; // change to your DB name




// seedBranches.js
//const mongoose = require("mongoose");
const dotenv = require("dotenv");
//const StudentBranch = require("./models/Society");

dotenv.config();

const seedData = [
  {
    society_name: "Cultural Club",
    society_contact_person: "Ravi Kumar",
    society_contact_person_phone_no: "9876543210",
  },
  {
    society_name: "Tech Society",
    society_contact_person: "Aman Singh",
    society_contact_person_phone_no: "9876501234",
  },
  {
    society_name: "Sports Committee",
    society_contact_person: "Pooja Sharma",
    society_contact_person_phone_no: "9123456780",
  },
];


mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    //await Society.deleteMany(); // optional → clear old data
    await Society.insertMany(seedData);

    console.log("🌱 Societies seeded successfully!");
    process.exit();
  })
  .catch(err => console.error(err));
