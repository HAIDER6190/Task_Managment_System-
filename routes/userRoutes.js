const express = require("express");
const router = express.Router();

const {
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
    getSecurityQuestion,
    resetPassword
} = require("../controller/userController");

const { verifyToken } = require("../middleware/authMiddleware");

// 🔐 PASSWORD / RECOVERY (public)
router.post("/security-question", getSecurityQuestion);
router.post("/reset-password", resetPassword);

// 👤 AUTHENTICATED USER ROUTES
router.get("/me", verifyToken, getMyProfile);
router.patch("/me", verifyToken, updateMyProfile);
router.delete("/me", verifyToken, deleteMyAccount);

module.exports = router;
