const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const {
    addUser,
    verifyEmail,
    loginUser,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
    getSecurityQuestion,
    resetPassword
} = require("../controller/userController");

// ---------------- PUBLIC ROUTES ----------------
router.post("/register", addUser);
router.get("/verify-email", verifyEmail); // link from email
router.post("/login", loginUser);
router.post("/security-question", getSecurityQuestion);
router.post("/reset-password", resetPassword);

// ---------------- PROTECTED ROUTES ----------------
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.delete("/me", verifyToken, deleteMyAccount);

module.exports = router;
