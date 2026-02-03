import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
    username: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuth(parsed);
      } catch {
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    const data = await apiLogin(credentials);
    const next = {
      token: data.token,
      role: data.role,
      userId: data.userId,
      username: data.username,
    };
    setAuth(next);
    localStorage.setItem("auth", JSON.stringify(next));
    return next;
  };

  const logout = () => {
    setAuth({
      token: null,
      role: null,
      userId: null,
      username: null,
    });
    localStorage.removeItem("auth");
  };

  const value = {
    ...auth,
    isAuthenticated: !!auth.token,
    loading,
    login: handleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

