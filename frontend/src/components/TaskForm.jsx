import { useState } from "react"

function TaskForm({initialValues, onSubmit, buttonText}) {
    const [formData, setFormData] = useState(initialValues);
    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData(prev => ({...prev, [name]: name === "priority" ? Number(value) : value}));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    return (
        <form onSubmit={handleSubmit} className='p-6 shadow-xl flex flex-col items-center justify-around rounded-xl bg-white'>
          <p className='font-bold text-xl'>{buttonText === "add" ? "Add new todo" : "Update todo"}</p>
          <input type="text" name="name" placeholder="Name" value={formData.name || ""} onChange={handleChange} className='w-full p-2' />
          <input type="text" name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} className='w-full p-2' />
          <input type="number" name="priority" placeholder="Priority" min="1" max="10" value={formData.priority || ""} onChange={handleChange} className='w-full p-2' />
          <button type="submit" className='w-full bg-sky-100 shadow-xl p-2 rounded-xl cursor-pointer hover:bg-sky-600 hover:text-white transition duration-150'>{buttonText}</button>
        </form>
    )
};

export default TaskForm;