import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSecurityQuestion, resetPassword } from "../../api/auth";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import { FiUser, FiArrowRight, FiLock, FiCheckCircle, FiHelpCircle, FiKey } from "react-icons/fi";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFetchQuestion = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError("Please enter your username");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await getSecurityQuestion(username);
            setQuestion(data.securityQuestion);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "User not found");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!answer.trim() || !newPassword.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await resetPassword({ username, answer, newPassword });
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Logo / Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                    <FiKey className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-primary-themed mb-2">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h1>
                <p className="text-secondary-themed">
                    {step === 1 ? "Enter your username to find your account" : "Answer security question to reset password"}
                </p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}
            {success && <Alert variant="success" className="mb-6">{success}</Alert>}

            {step === 1 ? (
                <form onSubmit={handleFetchQuestion} className="space-y-6">
                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        icon={FiUser}
                        autoFocus
                    />

                    <Button type="submit" fullWidth disabled={loading} icon={FiArrowRight}>
                        {loading ? "Finding Account..." : "Next"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="p-4 rounded-xl bg-surface-elevated border border-themed mb-6">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <FiHelpCircle />
                            <span className="text-sm font-semibold">Security Question</span>
                        </div>
                        <p className="text-primary-themed font-medium">{question}</p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Security Answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Enter your answer"
                            icon={FiCheckCircle}
                            autoFocus
                        />

                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            icon={FiLock}
                            showPasswordToggle
                        />
                    </div>

                    <Button type="submit" fullWidth disabled={loading} icon={FiArrowRight}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            )}

            <div className="mt-8 pt-6 border-t border-themed">
                <p className="text-center text-secondary-themed">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
