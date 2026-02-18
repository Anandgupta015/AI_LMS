import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// 🔥 Get my profile (streak)
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email streak"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
