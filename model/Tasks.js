const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: String,

        status: {
            type: String,
            enum: ["Todo", "Completed", "Excused"],
            default: "Todo"
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        dueDate: {
            type: Date,
            required: true
        },

        locked: {
            type: Boolean,
            default: false
        },

        unlockedByAdmin: {
            type: Boolean,
            default: false
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        excuse: String,

        adminResponse: {
            type: String,
            enum: ["accepted", "declined"]
        },

        adminResponseMessage: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
