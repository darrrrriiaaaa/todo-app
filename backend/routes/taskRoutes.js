import express from "express";
import { v4 as uuidv4} from "uuid";

import Task from "../models/Task.js";

const taskRouter = express.Router();

taskRouter.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch(err) {
        res.status(500);
        console.log(err);
    }
});

taskRouter.post("/", async (req, res) => {
    try {
        const {name, description, priority} = req.body;
        const task = new Task ({
            taskId: uuidv4(),
            name,
            description,
            status: false,
            priority: Number(priority)
        });
        await task.save();
        res.status(201).json(task);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: "Failed to add a new todo"});
    }
});

taskRouter.patch("/:taskId", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to update a new todo"});
    }
});

taskRouter.delete("/:taskId", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({taskId: req.params.taskId});
        if (!task) return res.status(404).json({message: "Task not found"});
        res.status(200).json({message: "Task deleted successfully!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Something went wrong"});
    };
});

export default taskRouter;