// src/components/TaskManager.tsx
import { useState, useEffect } from "react";
import axios from "axios";

// Replace with your actual backend URL
const API_URL = "http://localhost:5000/api/tasks";

type Task = {
  _id: string;
  title: string;
  description: string;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { title, description });
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Delete a task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <form onSubmit={handleAddTask} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Task title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task._id} className="border p-3 rounded flex justify-between items-center">
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
  );
}
