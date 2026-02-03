const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    securityQuestion: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
