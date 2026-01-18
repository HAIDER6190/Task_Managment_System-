const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const {
    addTask,
    getMyTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controller/Taskcontroller");

// ALL TASK ROUTES REQUIRE LOGIN

// Create task
router.post("/", verifyToken, addTask);

// Get all my tasks
router.get("/", verifyToken, getMyTasks);

// Get single task by ID
router.get("/:id", verifyToken, getTaskById);

// Update task
router.put("/:id", verifyToken, updateTask);

// Delete task
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
