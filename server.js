const express = require("express");
const { connectDB, getDB } = require("./config/db"); //  getDB
const userRouters = require("./router/userRoutes");
const apiLimiter = require("./middleware/ratelimit");
const taskRoutes = require("./router/TaskRouters");


const app = express();

app.use(apiLimiter);
app.use(express.json());

(async () => {
    await connectDB(); // connect to MongoDB
    const db = getDB(); // get the database instance

    // Create TTL index for pendingUsers (20 minutes)
    await db.collection("pendingUsers").createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 1200 } // 20 minutes
    );
    console.log("TTL index created for pendingUsers collection");

    // Routes
    app.use("/api/tasks", taskRoutes);
    app.use("/api/users", userRouters);

    app.listen(5000, () => console.log("Server running on port 5000"));
})();
