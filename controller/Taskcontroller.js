const Task = require("../model/Tasks");

/* ================= HELPER ================= */
/* ================= HELPER ================= */
const autoLockIfOverdue = async (task) => {
    if (task.dueDate < new Date() && task.status === "Todo" && !task.unlockedByAdmin) {
        task.locked = true;
        await task.save();
    }
};

/* ================= ADMIN CREATE TASK ================= */
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, priority, assignedTo, dueDate } = req.body;

        if (!title || !assignedTo || !dueDate) {
            const err = new Error("title, assignedTo and dueDate are required");
            err.statusCode = 400;
            return next(err);
        }

        if (priority && !["Low", "Medium", "High"].includes(priority)) {
            const err = new Error("Invalid priority");
            err.statusCode = 400;
            return next(err);
        }

        const task = await Task.create({
            title,
            description,
            priority,
            assignedTo,
            dueDate,
            createdBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username");

        res.status(201).json(populatedTask);
    } catch (err) {
        next(err);
    }
};

/* ================= USER GET MY TASKS ================= */
exports.getMyTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username");

        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

/* ================= COMPLETE TASK ================= */
exports.completeTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user._id
        });

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        await autoLockIfOverdue(task);

        if (task.locked) {
            const err = new Error("Task is locked due to overdue");
            err.statusCode = 403;
            return next(err);
        }

        if (task.status !== "Todo") {
            const err = new Error("Task cannot be completed");
            err.statusCode = 400;
            return next(err);
        }

        task.status = "Completed";
        await task.save();

        res.json({ message: "Task completed successfully" });
    } catch (err) {
        next(err);
    }
};

/* ================= SUBMIT EXCUSE ================= */
exports.submitExcuse = async (req, res, next) => {
    try {
        const { excuse } = req.body;

        if (!excuse || excuse.length < 32) {
            const err = new Error("Excuse must be at least 32 characters");
            err.statusCode = 400;
            return next(err);
        }

        const task = await Task.findOne({
            _id: req.params.id,
            assignedTo: req.user._id
        });

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        await autoLockIfOverdue(task);

        if (task.locked) {
            const err = new Error("Task is locked due to overdue");
            err.statusCode = 403;
            return next(err);
        }

        if (task.status !== "Todo") {
            const err = new Error("Cannot submit excuse");
            err.statusCode = 400;
            return next(err);
        }

        task.excuse = excuse;
        task.adminResponse = null;
        task.adminResponseMessage = null;
        await task.save();

        res.json({ message: "Excuse submitted successfully" });
    } catch (err) {
        next(err);
    }
};

/* ================= ADMIN RESPOND EXCUSE ================= */
exports.respondExcuse = async (req, res, next) => {
    try {
        const { response, message } = req.body;

        if (!["accepted", "declined"].includes(response)) {
            const err = new Error("Invalid response");
            err.statusCode = 400;
            return next(err);
        }

        const task = await Task.findById(req.params.id);

        if (!task || !task.excuse) {
            const err = new Error("No excuse found");
            err.statusCode = 404;
            return next(err);
        }

        task.adminResponse = response;
        task.adminResponseMessage = message || "";
        task.status = response === "accepted" ? "Excused" : "Todo";

        await task.save();
        res.json({ message: "Excuse reviewed successfully" });
    } catch (err) {
        next(err);
    }
};

/* ================= ADMIN UNLOCK TASK ================= */
exports.unlockTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        task.locked = false;
        task.unlockedByAdmin = true;
        await task.save();

        res.json({ message: "Task unlocked successfully" });
    } catch (err) {
        next(err);
    }
};
