require("dotenv").config();
console.log("✅ server.js loaded");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        console.log("⏳ Connecting to DB...");
        await connectDB();
        console.log("✅ DB connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Startup error:", err);
    }
})();
