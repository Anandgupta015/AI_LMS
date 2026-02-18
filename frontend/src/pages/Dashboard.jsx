import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [streak, setStreak] = useState(0);

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/planner");
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH USER (STREAK) =================
  const fetchUser = async () => {
    try {
      const { data } = await API.get("/user/me");
      setStreak(data.streak);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  // ================= ADD TASK =================
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post("/planner", { title });
      setTitle("");
      fetchTasks();
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= TOGGLE TASK =================
  const toggleTask = async (id) => {
    try {
      await API.put(`/planner/${id}`);
      fetchTasks();
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    try {
      await API.delete(`/planner/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= PROGRESS =================
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          📅 Smart Study Planner
        </h1>

        {/* 🧩 Brain Gym Button */}
        <Link
          to="/brain-gym"
          className="inline-block mb-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          🧩 Brain Gym
        </Link>

        {/* 🔥 Streak Badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold animate-pulse">
          🔥 {streak} Day Study Streak
        </div>

        {/* 🏆 Milestone Message */}
        {streak >= 7 && (
          <div className="mb-4 text-green-600 font-semibold">
            🏆 Amazing! 7 day consistency!
          </div>
        )}

        {streak >= 30 && (
          <div className="mb-4 text-purple-600 font-semibold">
            👑 Legend! 30 day streak!
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Add Task */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add new task..."
            className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700">
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                  className="w-5 h-5 cursor-pointer"
                />

                <span
                  className={`${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    task.completed ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
