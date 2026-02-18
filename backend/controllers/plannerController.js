import Planner from "../models/Planner.js";
import User from "../models/User.js";

// ================= ADD TASK =================
export const addTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Planner.create({
      user: req.user._id,
      title,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET MY TASKS =================
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Planner.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= TOGGLE TASK =================
export const toggleTask = async (req, res) => {
  try {
    const task = await Planner.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 security check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ⭐ save old state (ANTI-CHEAT)
    const wasCompleted = task.completed;

    // 🔄 toggle completion
    task.completed = !task.completed;
    await task.save();

    // 🔥 STREAK LOGIC (only false → true)
    if (!wasCompleted && task.completed) {
      const user = await User.findById(req.user._id);

      const today = new Date().toDateString();
      const lastDate = user.lastCompletedDate
        ? new Date(user.lastCompletedDate).toDateString()
        : null;

      // ⭐ only once per day
      if (lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === yesterday.toDateString()) {
          user.streak += 1; // continue streak
        } else {
          user.streak = 1; // reset streak
        }

        user.lastCompletedDate = new Date();
        await user.save();
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE TASK =================
export const deleteTask = async (req, res) => {
  try {
    const task = await Planner.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔐 security check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
