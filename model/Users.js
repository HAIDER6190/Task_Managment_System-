const crypto = require("crypto");

function createUser({ username, email, password, securityQuestion, answer }) {
    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return {
        username,
        email,
        password,
        securityQuestion,
        answer,
        isVerified: false,
        emailVerifyToken: hashedToken,
        emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000, // expires in 24 hours
        createdAt: new Date(),
        emailToken: token // this is sent to user via email, 
    };
}

module.exports = {
    createUser
};
