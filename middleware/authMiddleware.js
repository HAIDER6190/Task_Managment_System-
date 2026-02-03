const jwt = require("jsonwebtoken");
const User = require("../model/Users");

const verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("role username");
        if (!user) return res.status(401).json({ error: "User not found" });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };
