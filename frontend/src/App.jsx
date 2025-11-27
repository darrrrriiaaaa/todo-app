import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({name: "", description: "", status: "", priority: ""});

  useEffect(() => {
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
    fetchTasks();
  }, []);

  const handleChange = (e, option) => {
    setNewTask(prev => ({...prev, [option]: e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newTask)
    });
    if (!res.ok) throw new Error("Failed to add task");
  };

  return (
    <div>
      <h1>TODO APP</h1>
      <form>
        <p>Add new todo</p>
        <input type="text" placeholder="Name" onChange={(e) => handleChange(e, "name")} />
        <input type="text" placeholder="Description" onChange={(e) => handleChange(e, "description")} />
        <input type="number" placeholder="Priority" onChange={(e) => handleChange(e, "priority")} />
        <button onClick={handleSubmit}>Add</button>
      </form>
      {tasks.map(task => (
        <section key={task.id}>
          <p>{task.name}</p>
          <p>{task.description}</p>
          <p>{task.status}</p>
          <p>{task.priority}</p>
        </section>
      ))}
    </div>
  )
}

export default App
