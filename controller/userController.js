const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/* ================== GET MY PROFILE ================== */
exports.getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password -answer");

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

/* ================== UPDATE PROFILE ================== */
exports.updateMyProfile = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        next(err);
    }
};

/* ================== DELETE ACCOUNT ================== */
exports.deleteMyAccount = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        next(err);
    }
};

/* ================== SECURITY QUESTION ================== */
exports.getSecurityQuestion = async (req, res, next) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username }).select("securityQuestion");
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        res.json({ securityQuestion: user.securityQuestion });
    } catch (err) {
        next(err);
    }
};

/* ================== RESET PASSWORD ================== */
exports.resetPassword = async (req, res, next) => {
    try {
        const { username, answer, newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            const err = new Error("Password must be at least 8 characters");
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findOne({ username });
        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        const match = await bcrypt.compare(answer, user.answer);
        if (!match) {
            const err = new Error("Wrong answer");
            err.statusCode = 401;
            return next(err);
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        next(err);
    }
};
