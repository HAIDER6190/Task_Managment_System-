const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ================== REGISTER ================== */
exports.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            securityQuestion,
            answer,
            role // optional
        } = req.body;

        const exists = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (exists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Default role
        let finalRole = "User";

        //  Allow Admin ONLY if no admin exists yet
        if (role === "Admin") {
            const adminExists = await User.exists({ role: "Admin" });

            if (adminExists) {
                return res.status(403).json({
                    error: "Admin registration is disabled"
                });
            }

            finalRole = "Admin"; // first admin
        }

        await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            securityQuestion,
            answer: await bcrypt.hash(answer, 10),
            role: finalRole
        });

        res.status(201).json({
            message:
                finalRole === "Admin"
                    ? "First admin registered successfully"
                    : "User registered successfully"
        });

    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
};

/* ================== LOGIN ================== */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
};
