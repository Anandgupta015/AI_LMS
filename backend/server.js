import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import protect from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import puzzleRoutes from "./routes/puzzleRoutes.js";


dotenv.config();
connectDB();

const app = express(); // ⭐ PEHLE APP

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/puzzle", puzzleRoutes);




// protected test route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// test route
app.get("/", (req, res) => {
  res.send("SmartStudy AI API running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
