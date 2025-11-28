import { useState, useEffect } from 'react';

import editIcon from "./img/setting.png";
import deleteIcon from "./img/delete.png";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({name: "", description: "", status: "", priority: ""});
  const [searchQuery, setSearchQuery] = useState("");

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

  const updateTask = async(taskId, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application.json"},
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error("Failed to update task.");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = (id,status) => {
    updateTask(id, {status});
  };

  const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='p-6 bg-zinc-50'>
      <h1 className='text-3xl font-bold'>TODO APP</h1>
      <input type="text" placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} className='border' />
      <div className='flex flex-row flex-wrap gap-6'>
        <form onSubmit={handleSubmit} className='p-6 shadow-xl flex flex-col items-center justify-around rounded-xl bg-white'>
          <p className='font-bold text-xl'>Add new todo</p>
          <input type="text" placeholder="Name" onChange={(e) => handleChange(e, "name")} className='w-full p-2' />
          <input type="text" placeholder="Description" onChange={(e) => handleChange(e, "description")} className='w-full p-2' />
          <input type="number" placeholder="Priority" onChange={(e) => handleChange(e, "priority")} className='w-full p-2' />
          <button type="submit" className='w-full bg-sky-100 shadow-xl p-2 rounded-xl cursor-pointer hover:bg-sky-600 hover:text-white transition duration-150'>Add</button>
        </form>
        {filteredTasks.map(task => (
          <section key={task.taskId} className='shadow-xl p-6 flex flex-col w-sm rounded-xl bg-white'>
            <section className='flex flex-row w-full justify-between'>
              <p className='w-2/3 text-xl font-bold'>{task.name}</p>
              <button onClick="" className='cursor-pointer'><img src={editIcon} alt="" className='w-5 h-5' /></button>
              <button onClick={() => handleDelete(task.taskId)} className='cursor-pointer'><img src={deleteIcon} alt="" className='w-5 h-5' /></button>
            </section>
            <p>{task.description ? `Description: ${task.description}` : ""}</p>
            <section className='flex flex-row'>
              <input type="checkbox" checked={task.status} onChange={() => toggleStatus(task.taskId, !task.status)} />
              <p className={`p-1 text-sm rounded-xl ${task.status ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}`}>{task.status ? "Done" : "Undone"}</p>
            </section>
            <p>Priority: {task.priority}</p>
          </section>
        ))}
      </div>
    </div>
  )
}

export default App
