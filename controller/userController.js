const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { userSchema, updateUserSchema } = require("../Validations/userValidation");
const { sendVerificationEmail } = require("../utils/email"); // email sender utility

/* ------------------ SANITIZER ------------------ */
function sanitize(value) {
    if (typeof value === "string") {
        return value.replace(/\$/g, "");
    }
    return value;
}

/* ------------------ CREATE PENDING USER ------------------ */
function createPendingUser({ username, email, password, securityQuestion, answer }) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return {
        username,
        email,
        password,
        securityQuestion,
        answer,
        token, // raw token to send via email
        hashedToken,
        createdAt: new Date() // TTL index will remove after 20 minutes
    };
}
/* ------------------ REGISTER ------------------ */
async function addUser(req, res) {
    try {
        const db = getDB();

        let { username, email, password, securityQuestion, answer } = req.body;
        username = sanitize(username);
        email = sanitize(email);

        // Validate input
        const { error } = userSchema.validate({ username, email, password, securityQuestion, answer });
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Check verified users
        if (await db.collection("users").findOne({ $or: [{ username }, { email }] })) {
            return res.status(400).json({ error: "Username or Email already in use" });
        }

        // Delete old pending users (retry)
        await db.collection("pendingUsers").deleteMany({
            $or: [{ username }, { email }]
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(answer, 10);

        const pendingUser = createPendingUser({
            username,
            email,
            password: hashedPassword,
            securityQuestion,
            answer: hashedAnswer
        });

        await db.collection("pendingUsers").insertOne(pendingUser);

        // Send verification email
        await sendVerificationEmail(email, pendingUser.token);

        res.status(201).json({
            message: "Registration initiated. Please check your email to verify your account."
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ VERIFY EMAIL ------------------ */
async function verifyEmail(req, res) {
    try {
        const db = getDB();
        const token = req.query.token;
        if (!token) return res.status(400).json({ error: "Token missing" });

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const pendingUser = await db.collection("pendingUsers").findOne({ hashedToken });
        if (!pendingUser) return res.status(400).json({ error: "Token invalid or expired" });

        const { username, email, password, securityQuestion, answer } = pendingUser;

        await db.collection("users").insertOne({
            username,
            email,
            password,
            securityQuestion,
            answer,
            isVerified: true,
            createdAt: new Date()
        });

        // Delete pending user
        await db.collection("pendingUsers").deleteOne({ _id: pendingUser._id });

        // Return JSON for frontend handling
        res.json({
            message: "Email verified successfully",
            success: true
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ LOGIN ------------------ */
async function loginUser(req, res) {
    try {
        const db = getDB();
        let { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Username and password required" });

        username = sanitize(username);

        const user = await db.collection("users").findOne({ username });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const payload = { id: user._id, username: user.username };
        const secret = process.env.JWT_SECRET || "dev_jwt_secret";

        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        res.json({
            message: "Login successful",
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ GET MY PROFILE (/me) ------------------ */
async function getMyProfile(req, res) {
    try {
        const db = getDB();
        const user = await db.collection("users").findOne(
            { username: req.user.username },
            { projection: { password: 0, answer: 0 } }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ UPDATE MY PROFILE ------------------ */
async function updateMyProfile(req, res) {
    try {
        const db = getDB();
        let updateData = { ...req.body };

        if (updateData.username) updateData.username = sanitize(updateData.username);
        if (updateData.email) updateData.email = sanitize(updateData.email);

        const { error } = updateUserSchema.validate(updateData);
        if (error) return res.status(400).json({ error: error.details[0].message });

        if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);

        const result = await db.collection("users").updateOne(
            { username: req.user.username },
            { $set: updateData }
        );

        if (!result.matchedCount) return res.status(404).json({ error: "User not found" });

        res.json({ message: "Profile updated successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ DELETE MY ACCOUNT ------------------ */
async function deleteMyAccount(req, res) {
    try {
        const db = getDB();
        const result = await db.collection("users").deleteOne({ username: req.user.username });
        if (!result.deletedCount) return res.status(404).json({ error: "User not found" });
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ SECURITY QUESTION ------------------ */
async function getSecurityQuestion(req, res) {
    try {
        const db = getDB();
        const { username } = req.body;
        const user = await db.collection("users").findOne(
            { username },
            { projection: { securityQuestion: 1 } }
        );
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ securityQuestion: user.securityQuestion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ RESET PASSWORD ------------------ */
async function resetPassword(req, res) {
    try {
        const db = getDB();
        const { username, answer, newPassword } = req.body;

        const user = await db.collection("users").findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const match = await bcrypt.compare(answer, user.answer);
        if (!match) return res.status(401).json({ error: "Wrong answer" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.collection("users").updateOne(
            { username },
            { $set: { password: hashedPassword } }
        );

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* ------------------ EXPORTS ------------------ */
module.exports = {
    addUser,
    verifyEmail,
    loginUser,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
    getSecurityQuestion,
    resetPassword
};
