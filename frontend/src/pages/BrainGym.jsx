import { useEffect, useState } from "react";
import API from "../api/axios";

const BrainGym = () => {
  const [puzzle, setPuzzle] = useState(null);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  // 🔥 fetch puzzle
  const fetchPuzzle = async () => {
    try {
      const { data } = await API.get("/puzzle/daily");
      setPuzzle(data);
      setSelected("");
      setResult("");
      setTimeLeft(30); // reset timer
    } catch (error) {
      console.log(error);
    }
  };

  // 🚀 initial load
  useEffect(() => {
    fetchPuzzle();
  }, []);

  // ⏱ countdown timer
  useEffect(() => {
    if (!puzzle) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResult("⏰ Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [puzzle]);

  // ✅ check answer
  const checkAnswer = () => {
    if (timeLeft === 0) {
      setResult("⏰ Time's up!");
      return;
    }

    if (!selected) return;

    if (selected === puzzle.answer) {
      setResult("✅ Correct!");
    } else {
      setResult("❌ Wrong answer");
    }
  };

  if (!puzzle) return <div className="p-6">Loading puzzle...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">🧩 Brain Gym</h1>

        {/* ⏱ Timer */}
        <div className="mb-3 text-right font-semibold text-red-500">
          ⏱ {timeLeft}s
        </div>

        {/* Question */}
        <p className="mb-4 font-medium">{puzzle.question}</p>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {puzzle.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => setSelected(opt)}
              disabled={timeLeft === 0}
              className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                selected === opt
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Check button */}
        <button
          onClick={checkAnswer}
          disabled={timeLeft === 0}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Check Answer
        </button>

        {/* Result */}
        {result && (
          <div className="mt-4 text-center font-semibold">{result}</div>
        )}

        {/* New puzzle */}
        <button
          onClick={fetchPuzzle}
          className="mt-4 w-full border py-2 rounded-lg hover:bg-gray-100"
        >
          🔄 New Puzzle
        </button>
      </div>
    </div>
  );
};

export default BrainGym;
