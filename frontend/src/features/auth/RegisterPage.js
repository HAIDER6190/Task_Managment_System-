import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { register as apiRegister } from "../../api/auth";
import { FiUser, FiMail, FiLock, FiShield, FiUserPlus, FiLogIn } from "react-icons/fi";

const SECURITY_QUESTIONS = [
  "What is your favorite color?",
  "What is your pet's name?",
  "What city were you born in?",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: SECURITY_QUESTIONS[0],
    answer: "",
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

    if (!form.username || !form.email || !form.password || !form.answer) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({
        username: form.username,
        email: form.email,
        password: form.password,
        securityQuestion: form.securityQuestion,
        answer: form.answer,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please check your details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Logo / Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mb-4">
          <FiUserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-gray-400">
          Join us to start managing your tasks
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          name="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          icon={FiUser}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          icon={FiMail}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            showPasswordToggle
            icon={FiLock}
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            showPasswordToggle
            icon={FiLock}
          />
        </div>

        {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Passwords do not match
          </p>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">
            Security Question
          </label>
          <select
            name="securityQuestion"
            value={form.securityQuestion}
            onChange={handleChange}
            className="glass-input w-full cursor-pointer"
          >
            {SECURITY_QUESTIONS.map((q) => (
              <option key={q} value={q} className="bg-dark-800 text-white">
                {q}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Security Answer"
          name="answer"
          placeholder="Your answer"
          value={form.answer}
          onChange={handleChange}
          icon={FiShield}
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loading}
          icon={FiUserPlus}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1"
          >
            <FiLogIn size={16} />
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
