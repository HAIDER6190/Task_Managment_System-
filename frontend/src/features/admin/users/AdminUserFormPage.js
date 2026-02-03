import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../api/admin";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import {
    FiUserPlus,
    FiUser,
    FiMail,
    FiLock,
    FiShield,
    FiArrowLeft,
    FiSave
} from "react-icons/fi";

export default function AdminUserFormPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!form.username || !form.email || !form.password) {
            setError("Please fill in all required fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await createUser({
                username: form.username,
                email: form.email,
                password: form.password,
                role: form.role,
            });
            setSuccess("User created successfully!");
            setTimeout(() => {
                navigate("/admin/users");
            }, 1500);
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to create user. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/users")}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <FiUserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Add New User</h1>
                        <p className="text-sm text-gray-400">Create a new user account</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="glass-card-dark p-6 md:p-8">
                {error && <Alert variant="error">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        icon={FiUser}
                        placeholder="Enter username"
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        icon={FiMail}
                        placeholder="Enter email address"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        icon={FiLock}
                        placeholder="Enter password"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        icon={FiLock}
                        placeholder="Confirm password"
                        required
                    />

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <FiShield className="inline mr-2" size={16} />
                            Role
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, role: "User" }))}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${form.role === "User"
                                        ? "border-primary bg-primary/20 text-white"
                                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                                    }`}
                            >
                                <FiUser className="mx-auto mb-2" size={24} />
                                <div className="font-medium">User</div>
                                <p className="text-xs text-gray-500 mt-1">Standard access</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, role: "Admin" }))}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${form.role === "Admin"
                                        ? "border-purple-500 bg-purple-500/20 text-white"
                                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                                    }`}
                            >
                                <FiShield className="mx-auto mb-2" size={24} />
                                <div className="font-medium">Admin</div>
                                <p className="text-xs text-gray-500 mt-1">Full access</p>
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-white/10">
                        <Button type="submit" disabled={loading} className="w-full" icon={FiSave}>
                            {loading ? "Creating User..." : "Create User"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
