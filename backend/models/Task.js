import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    taskId: { type: String, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean, required: true },
    priority: { type: Number, min: 1, max: 10 }
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;