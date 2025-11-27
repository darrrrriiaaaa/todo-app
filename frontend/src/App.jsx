import { useState, useEffect } from 'react';

import editIcon from "./img/setting.png";
import deleteIcon from "./img/delete.png";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({name: "", description: "", status: "", priority: ""});

  const fetchTasks = async() => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks.");
        const data = await res.json();
        setTasks(data);
      } catch(err) {
        console.error(err);
      }
    };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e, option) => {
    let value = e.target.value;
    if (option === "priority") value = Number(value);
    setNewTask(prev => ({...prev, [option]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newTask)
      });
      const data = await res.json();
      console.log("post response: ", data);
      if (!res.ok) throw new Error("Failed to add task");
      await fetchTasks();
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      console.log(`${res} deleted successfully!`);
      setTasks(tasks => tasks.filter(task => task.taskId !== taskId));
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <div>
      <h1 className='text-3xl font-bold'>TODO APP</h1>
      <form onSubmit={handleSubmit}>
        <p>Add new todo</p>
        <input type="text" placeholder="Name" onChange={(e) => handleChange(e, "name")} />
        <input type="text" placeholder="Description" onChange={(e) => handleChange(e, "description")} />
        <input type="number" placeholder="Priority" onChange={(e) => handleChange(e, "priority")} />
        <button type="submit">Add</button>
      </form>
      {tasks.map(task => (
        <section key={task.taskId}>
          <p>{task.name}</p>
          <button onClick=""><img src={editIcon} alt="" className='w-20 h-20' /></button>
          <button onClick={() => handleDelete(task.taskId)}><img src={deleteIcon} alt="" className='w-20 h-20' /></button>
          <p>{task.description}</p>
          <p>{task.status}</p>
          <p>{task.priority}</p>
        </section>
      ))}
    </div>
  )
}

export default App
