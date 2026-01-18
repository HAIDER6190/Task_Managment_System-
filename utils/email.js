const nodemailer = require("nodemailer");
require("dotenv").config();

function createGmailTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
}

async function sendVerificationEmail(email, token) {
    const transporter = createGmailTransporter();
    //  URL for email verification
    const verifyLink = ` https://urls-underground-shipped-rap.trycloudflare.com/api/users/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `Task App <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to Task App!</h2>
                <p>Click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 16px 0;">
                <a href="${verifyLink}"
                   style="
                       display: inline-block;
                       padding: 16px 32px;
                       margin: 16px 0;
                       background-color: #1143d9ff;
                       color: #ffffff;
                       text-decoration: none;
                       border-radius: 5px;
                       font-weight: bold;
                   ">
                    Verify Email
                </a>

                <p>This link will expire in <strong>20 minutes</strong>.</p>
                <p>If you did not create this account, please ignore this email.</p>
            </div>
        `
    });

    console.log("Verification email sent to:", email);
}

module.exports = {
    sendVerificationEmail
};
