import express from "express";

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
        const {name, description, priority} = req.params;
        const task = new Task ({
            name,
            description,
            status: false,
            priority
        });
        await task.save();
        res.status(201).json(order);
    } catch(err) {
        console.error(err);
    }
});

export default taskRouter;