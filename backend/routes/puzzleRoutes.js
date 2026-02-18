import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧩 Daily brain puzzle
router.get("/daily", protect, async (req, res) => {
  try {
    const puzzles = [
      {
        question: "What comes next: 2, 4, 8, 16, ?",
        options: ["18", "24", "32", "20"],
        answer: "32",
      },
      {
        question: "Find the odd one out: Apple, Banana, Carrot, Mango",
        options: ["Apple", "Banana", "Carrot", "Mango"],
        answer: "Carrot",
      },
    ];

    const randomPuzzle =
      puzzles[Math.floor(Math.random() * puzzles.length)];

    res.json(randomPuzzle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
