import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addTask,
  getMyTasks,
  toggleTask,
  deleteTask,
} from "../controllers/plannerController.js";

const router = express.Router();

router.post("/", protect, addTask);
router.get("/", protect, getMyTasks);
router.put("/:id", protect, toggleTask);
router.delete("/:id", protect, deleteTask);

export default router;
