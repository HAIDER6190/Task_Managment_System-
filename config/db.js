// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://127.0.0.1:27017/Task"
        );
        console.log(" MongoDB connected (Mongoose)");
    } catch (err) {
        console.error(" MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
