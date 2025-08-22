require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const questionRoutes = require('./routes/questionRoutes');
const { protect } = require("./middlewares/authMiddleware");
const {generateInterviewQuestions,generateConceptExplanations} = require('./controller/aiController')

const app = express();

// Middleware to handle CORS

app.use(cors({
    // origin:"*",
    origin: ["https://interviewedge.netlify.app/"], // frontend domain
    credentials: true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}));

connectDB();

// Middleware

app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/question",questionRoutes);

app.use("/api/ai/generate-questions",protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanations);

// Server uploads folder
app.use("/uploads",express.static(path.join(__dirname,"uploads"),{}))

// Server Start
const PORT = process.env.PORT || 5000;
// const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})