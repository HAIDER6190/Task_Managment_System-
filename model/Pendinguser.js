
function createPendingUser({ username, email, password, securityQuestion, answer }) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    return {
        username,
        email,
        password,
        securityQuestion,
        answer,
        token,
        hashedToken,
        tokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        createdAt: new Date()
    };
}

module.exports = { createPendingUser };
