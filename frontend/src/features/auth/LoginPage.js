import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import { FiUser, FiLock, FiLogIn, FiUserPlus } from "react-icons/fi";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const auth = await login(form);
      if (auth.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Logo / Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
          <FiLogIn className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">
          Sign in to access your task dashboard
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Username"
          name="username"
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          icon={FiUser}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          showPasswordToggle
          icon={FiLock}
        />

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
          icon={FiLogIn}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1"
          >
            <FiUserPlus size={16} />
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
