const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

// Import routes
const authRoutes = require("./routes/auth");
const studentInfoRoutes = require("./routes/studentInfo");
//const studentInfoAdvisorRoutes = require("./routes/advisorRoutes");
const studentTrainingRoutes = require("./routes/studentTrainingRoutes");
const studentProjectRoutes = require("./routes/studentProjectRoutes");
const studentResearchRoutes = require("./routes/studentResearchRoutes");
const studentPlacementRoutes = require("./routes/studentPlacementRoutes");
const studentRoutes = require("./routes/StudentRoutes");
const teacherRoutes = require("./routes/TeacherPanelRoutes");
const branchRoutes = require("./routes/branchRoutes");
const societyRoutes = require("./routes/societyRoutes"); 
const dutyLeaveRoutes = require("./routes/dutyLeaveRoutes");
const advisorRoutes = require("./routes/teacherRoutes");
const certificateRoutes = require("./routes/studentCertificateRoutes");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((error) => console.log(error));

const app = express()
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student-info", studentInfoRoutes);
//app.use("/api/advisor", studentInfoAdvisorRoutes);
app.use("/api/Training", studentTrainingRoutes);
app.use("/api/Projects", studentProjectRoutes);
app.use("/api/Research", studentResearchRoutes);
app.use("/api/Placement", studentPlacementRoutes);
app.use("/api/societies", societyRoutes); 
app.use("/api/duty-leave", dutyLeaveRoutes);

app.use("/api/teachers", advisorRoutes);
app.use("/api/Certificate", certificateRoutes);
// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
