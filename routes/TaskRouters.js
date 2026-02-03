const router = require("express").Router();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const controller = require("../controller/Taskcontroller");

/* ========== USER ROUTES ========== */

// Get my tasks
router.get("/my", verifyToken, controller.getMyTasks);

// Complete task
router.patch("/:id/complete", verifyToken, controller.completeTask);

// Submit excuse
router.patch("/:id/excuse", verifyToken, controller.submitExcuse);

/* ========== ADMIN ROUTES ========== */

// Create task
router.post("/", verifyToken, requireAdmin, controller.createTask);

// Respond to excuse
router.patch("/:id/respond", verifyToken, requireAdmin, controller.respondExcuse);

// Unlock task
router.patch("/:id/unlock", verifyToken, requireAdmin, controller.unlockTask);

module.exports = router;
