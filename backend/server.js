const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();


const authRoutes = require("./routes/auth");
const studentInfoRoutes = require("./routes/studentInfo");
const studentTrainingRoutes = require("./routes/studentTrainingRoutes");
const studentProjectRoutes = require("./routes/studentProjectRoutes");
const studentResearchRoutes = require("./routes/studentResearchRoutes");
const studentPlacementRoutes = require("./routes/studentPlacementRoutes");


//can also create a separate file for dbConnect and import that here
mongoose.connect(process.env.MONGO_URI ).then( () => console.log("DB connected successfully")).catch( (error) => console.log(error));

const app = express()
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods : ['GET' , 'POST' , 'DELETE' , 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials : true,
    })
);

app.use(cookieParser());
app.use(express.json());

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const studentRoutes = require("./routes/StudentRoutes");
app.use("/api/student", studentRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/student-info", studentInfoRoutes);
app.use("/api/Training", studentTrainingRoutes);
app.use("/api/Projects", studentProjectRoutes);
app.use("/api/Research", studentResearchRoutes);
app.use("/api/Placement", studentPlacementRoutes);


app.listen(PORT , () => console.log(`Server is running on port ${PORT}`));