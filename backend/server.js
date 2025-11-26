import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import taskRouter from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use("/api/tasks", taskRouter);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Database connected!");
}).catch((err) => {
    console.log("Error occured!", err);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});