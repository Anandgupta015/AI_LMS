import express from "express";
import protect from "../middleware/authMiddleware.js";
import OpenAI from "openai";

const router = express.Router();

// 🧠 AI doubt route
router.post("/doubt", protect, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful teacher who explains in simple student-friendly language.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    console.error("AI FULL ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
