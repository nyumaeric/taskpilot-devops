import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if using Docker
});
api.post("/tasks", { title: "New Task", description: "Something to do" });

const id = 1; // Replace with the actual task ID you want to update
api.put(`/tasks/${id}`, { status: "completed" });

api.delete(`/tasks/${id}`);


export default api;
