const mongoose = require("mongoose");

const StudentInfoSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",  // reference to User model
      required: true,
      unique: true, // each student can fill only once
    },
    fatherName: { 
      type: String, 
      required: true 
    },
    motherName: { 
      type: String, 
      required: true 
    },
    permanentAddress: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      lowercase: true 
    },
    category: { 
      type: String, 
      required: true 
    }, // eg. General, OBC, SC
    dob: { 
      type: Date, 
      required: true 
    },
    studentMobile: { 
      type: String, 
      required: true 
    },
    fatherMobile: { 
      type: String, 
      required: true 
    },
    motherMobile: { 
      type: String, 
      required: true 
    },
    admissionDate: { 
      type: Date, 
      required: true 
    },
    passingYear: { 
      type: Number, 
      required: true 
    },
 
// NEW FIELD
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
     // type:String,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentInfo = mongoose.model("StudentInfo", StudentInfoSchema);

module.exports = StudentInfo;
