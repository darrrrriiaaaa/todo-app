import { useState, useEffect } from 'react';

import editIcon from "./img/setting.png";
import deleteIcon from "./img/delete.png";
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({name: "", description: "", status: "", priority: ""});
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("");
  const [edit, setEdit] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchTasks = async() => {
      try {
        const res = await fetch(`${API_URL}/api/tasks`);
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

  const handleSubmit = async (task) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(task)
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
      const res = await fetch(`${API_URL}/api/tasks${taskId}`, {
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
      const res = await fetch(`${API_URL}/api/tasks/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
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

  const filteredTasks = tasks
    .filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(task => { if (filter === "done") return task.status === true
      else if (filter === "undone") return task.status === false
      else return true;
    });

  if (sort === "asc") filteredTasks.sort((a,b) => a.priority - b.priority)
    else if (sort === "desc") filteredTasks.sort((a,b) => b.priority - a.priority)

  const handleReset = () => {
    setSearchQuery("");
    setFilter("all");
    setSort("");
  };

  return (
    <div className='p-6 bg-zinc-50'>
      <h1 className='text-3xl font-bold flex justify-center m-6'>TODO APP</h1>
      <section className='m-6 flex justify-evenly'>
        <input type="text" placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} className='border border-sky-800 rounded-xl p-2 shadow-xl hover:bg-sky-600 hover:text-white transition duration-150 cursor-pointer' />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className='border border-sky-800 rounded-xl p-2 shadow-xl hover:bg-sky-600 hover:text-white transition duration-150 cursor-pointer'>
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className='border border-sky-800 rounded-xl p-2 shadow-xl hover:bg-sky-600 hover:text-white transition duration-150 cursor-pointer'>
          <option value="">None</option>
          <option value="asc">From small to high</option>
          <option value="desc">From high to small</option>
        </select>
        <button onClick={handleReset} className='border border-sky-800 rounded-xl p-2 shadow-xl hover:bg-sky-600 hover:text-white transition duration-150 cursor-pointer'>Reset filters</button>
      </section>
      <div className='flex flex-row flex-wrap gap-6 min-h-min h-120'>
        <TaskForm initialValues={{}} buttonText="add" onSubmit={async(data) => {await handleSubmit(data); fetchTasks();}}/>
        {filteredTasks.map(task => (
          <section key={task.taskId} className='shadow-xl p-6 flex flex-col justify-evenly w-sm rounded-xl bg-white hover:-translate-y-2 hover:shadow-2xl transition duration-300'>
            <section className='flex flex-row w-full justify-between'>
              <p className='w-2/3 text-xl font-bold'>{task.name}</p>
              <button onClick={() => setEdit(task)}  className='w-5 h-5 cursor-pointer'><img src={editIcon} alt="" className='' /></button>
              <button onClick={() => handleDelete(task.taskId)} className='w-5 h-5 cursor-pointer'><img src={deleteIcon} alt="" className='' /></button>
            </section>
            <p>{task.description ? `Description: ${task.description}` : ""}</p>
            <section className='flex flex-row gap-3'>
              <input type="checkbox" checked={task.status} onChange={() => toggleStatus(task.taskId, !task.status)} className='cursor-pointer'/>
              <p className={`p-1 text-sm rounded-xl ${task.status ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}`}>{task.status ? "Done" : "Undone"}</p>
            </section>
            <p>Priority: {task.priority}</p>
          </section>
        ))}
        {edit && (
          <div className='fixed bg-black/60 inset-0 flex items-center justify-center z-50' onClick={(e) => {
            if (e.currentTarget === e.target) setEdit(null)}}>
              <TaskForm initialValues={edit} buttonText="update" onSubmit={async(updatedFields) => {
                await updateTask(edit.taskId, updatedFields);
                setEdit(null);
                fetchTasks();
              }} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
