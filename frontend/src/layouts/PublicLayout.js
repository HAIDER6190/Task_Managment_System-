import React from "react";
import { useTheme } from "../store/themeStore";
import { FiSun, FiMoon } from "react-icons/fi";

export default function PublicLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-main">
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 theme-toggle"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
      </div>

      {/* Content card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="glass-card-dark p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
