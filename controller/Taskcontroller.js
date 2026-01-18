const { getDB } = require("../config/db");
const { createTask } = require("../model/Tasks");
const { ObjectId } = require("mongodb");

// sanitize input
function sanitize(value) {
    if (typeof value === "string") {
        return value.replace(/\$/g, "");
    }
    return value;
}

// 1. CREATE TASK
async function addTask(req, res) {
    try {
        const db = getDB();

        const { title, description, status, priority, dueDate } = req.body;
        const userId = req.user.id; // from JWT middleware

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = createTask({
            title: sanitize(title),
            description: sanitize(description),
            status,
            priority,
            dueDate,
            userId
        });

        await db.collection("tasks").insertOne(task);

        res.status(201).json({
            message: "Task created successfully",
            taskId: task._id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 2. GET ALL TASKS (USER ONLY)
async function getMyTasks(req, res) {
    try {
        const db = getDB();
        const userId = new ObjectId(req.user.id);

        const tasks = await db
            .collection("tasks")
            .find({ userId })
            .toArray();

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 3. GET SINGLE TASK
async function getTaskById(req, res) {
    try {
        const db = getDB();
        const taskId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.user.id);

        const task = await db.collection("tasks").findOne({
            _id: taskId,
            userId
        });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 4. UPDATE TASK
async function updateTask(req, res) {
    try {
        const db = getDB();
        const taskId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.user.id);

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await db.collection("tasks").updateOne(
            { _id: taskId, userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 5. DELETE TASK
async function deleteTask(req, res) {
    try {
        const db = getDB();
        const taskId = new ObjectId(req.params.id);
        const userId = new ObjectId(req.user.id);

        const result = await db.collection("tasks").deleteOne({
            _id: taskId,
            userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addTask,
    getMyTasks,
    getTaskById,
    updateTask,
    deleteTask
};
