import { useEffect, useState } from "react";
import api from "../services/api";

type Task = {
  _id: string;
  title: string;
  // add other fields if needed
};

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.map(task => (
        <div key={task._id}>
          <p>{task.title}</p>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
