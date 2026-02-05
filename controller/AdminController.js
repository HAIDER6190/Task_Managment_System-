const User = require("../model/Users");
const Task = require("../model/Tasks");

/* ===================== USERS ===================== */

// 🔍 SEARCH USERS (ADMIN ONLY)
exports.searchUsers = async (req, res, next) => {
    try {
        const { search, role } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (role) query.role = role;

        const users = await User.find(query).select("-password -answer");

        res.json({ count: users.length, users });
    } catch (err) {
        next(err);
    }
};

// 👁 GET SINGLE USER
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password -answer");

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

// 🗑 DELETE USER
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        await Task.deleteMany({ assignedTo: user._id });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// ➕ CREATE USER (ADMIN ONLY)
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, role, securityQuestion, answer } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            const err = new Error("Username, email, and password are required");
            err.statusCode = 400;
            return next(err);
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username: username.toLowerCase() }]
        });

        if (existingUser) {
            const err = new Error("User with this email or username already exists");
            err.statusCode = 400;
            return next(err);
        }

        // Hash password
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password: hashedPassword,
            role: role || "User",
            securityQuestion: securityQuestion || "What is your favorite color?",
            answer: answer || "default"
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// 📊 GET DASHBOARD STATS
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalTasks = await Task.countDocuments();
        const totalUsers = await User.countDocuments({ role: "User" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({
            status: "Todo",
            dueDate: { $lt: new Date() }
        });
        const todoTasks = await Task.countDocuments({ status: "Todo" });

        const usersWithTodoTasks = await Task.distinct("assignedTo", { status: "Todo" });
        const usersWithTodoTasksCount = usersWithTodoTasks.length;

        const excuseTasksCount = await Task.countDocuments({
            excuse: { $exists: true, $ne: null },
            $or: [{ adminResponse: { $exists: false } }, { adminResponse: null }]
        });

        res.json({
            totalTasks,
            totalUsers,
            completedTasks,
            overdueTasks,
            todoTasks,
            usersWithTodoTasksCount,
            excuseTasksCount
        });
    } catch (err) {
        next(err);
    }
};

/* ===================== TASKS ===================== */

// 🔍 SEARCH TASKS
exports.searchTasks = async (req, res, next) => {
    try {
        const { search, status, priority, assignedTo } = req.query;
        const query = {};

        if (search) query.title = { $regex: search, $options: "i" };
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username");

        res.json({ count: tasks.length, tasks });
    } catch (err) {
        next(err);
    }
};
// 👥 GET ALL USERS (ADMIN ONLY)
// 👥 GET ALL USERS (ADMIN ONLY) - Supports Filtering
exports.getAllUsers = async (req, res, next) => {
    try {
        const { search, role } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (role) query.role = role;

        const users = await User.find(query).select("-password -answer");

        res.json({
            count: users.length,
            users
        });
    } catch (err) {
        next(err);
    }
};


// 👁 GET SINGLE TASK
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username");

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
};

// 🔄 REASSIGN TASK
exports.reassignTask = async (req, res, next) => {
    try {
        const { assignedTo } = req.body;

        if (!assignedTo) {
            const err = new Error("assignedTo is required");
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findById(assignedTo);
        if (!user) {
            const err = new Error("Assigned user not found");
            err.statusCode = 404;
            return next(err);
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { assignedTo },
            { new: true }
        );

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ message: "Task reassigned successfully", task });
    } catch (err) {
        next(err);
    }
};

// 📄 TASKS WITH EXCUSES
exports.getTasksWithExcuses = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            excuse: { $exists: true, $ne: null },
            $or: [{ adminResponse: { $exists: false } }, { adminResponse: null }]
        }).populate("assignedTo", "username email");

        res.json({ count: tasks.length, tasks });
    } catch (err) {
        next(err);
    }
};

// ✅ RESPOND TO EXCUSE
exports.respondToExcuse = async (req, res, next) => {
    try {
        const { response, message } = req.body;

        if (!["accepted", "declined"].includes(response)) {
            const err = new Error("Invalid response");
            err.statusCode = 400;
            return next(err);
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        if (!task.excuse) {
            const err = new Error("No excuse to respond to");
            err.statusCode = 400;
            return next(err);
        }

        task.adminResponse = response;
        task.adminResponseMessage = message || "";
        task.status = response === "accepted" ? "Excused" : "Todo";

        await task.save();

        res.json({ message: "Excuse response saved" });
    } catch (err) {
        next(err);
    }
};
// 🗑 DELETE TASK
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// ✏ UPDATE TASK
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, priority, assignedTo, dueDate } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            const err = new Error("Task not found");
            err.statusCode = 404;
            return next(err);
        }

        if (dueDate && new Date(dueDate) < new Date()) {
            const err = new Error("Due date must be in the future");
            err.statusCode = 400;
            return next(err);
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.assignedTo = assignedTo || task.assignedTo;
        task.dueDate = dueDate || task.dueDate;

        await task.save();

        res.json(task);
    } catch (err) {
        next(err);
    }
};
