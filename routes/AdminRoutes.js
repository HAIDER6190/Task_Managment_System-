// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/AdminController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// USERS
router.get("/users", verifyToken, requireAdmin, adminController.getAllUsers);
router.post("/users", verifyToken, requireAdmin, adminController.createUser);
router.get("/users/search", verifyToken, requireAdmin, adminController.searchUsers);
router.get("/users/:id", verifyToken, requireAdmin, adminController.getUserById);
router.delete("/users/:id", verifyToken, requireAdmin, adminController.deleteUser);

// TASKS
router.get("/tasks", verifyToken, requireAdmin, adminController.searchTasks);
router.get("/tasks/excuses", verifyToken, requireAdmin, adminController.getTasksWithExcuses);
router.get("/tasks/:id", verifyToken, requireAdmin, adminController.getTaskById);
router.delete("/tasks/:id", verifyToken, requireAdmin, adminController.deleteTask);
router.patch("/tasks/:id/reassign", verifyToken, requireAdmin, adminController.reassignTask);
router.patch("/tasks/:id/respond", verifyToken, requireAdmin, adminController.respondToExcuse);

module.exports = router;
