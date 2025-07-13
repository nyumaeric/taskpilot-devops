// src/components/TaskManager.tsx
import { useState, useEffect } from "react";
import axios from "axios";

type Task = {
  _id: string;
  title: string;
  description: string;
};

const API_URL = "http://localhost:5000/api/tasks";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data as Task[]);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { title, description });
      setTasks((prev) => [...prev, res.data as Task]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Delete task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">TaskPilot Dashboard</h1>

        <form onSubmit={handleAddTask} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border p-2 w-full"
          />
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
