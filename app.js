const express = require("express");
const cors = require("cors");
const apiLimiter = require("./middleware/ratelimit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/TaskRouters");
const adminRoutes = require("./routes/AdminRoutes");
const errorHandler = require("./middleware/errorHandlingMiddleware");

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(apiLimiter);
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);   // 🔥 THIS FIXES YOUR ERROR
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

// ✅ ERROR HANDLER MUST BE LAST
app.use(errorHandler);

module.exports = app;
