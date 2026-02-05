import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";
import {
  FiHome,
  FiCheckSquare,
  FiUsers,
  FiBell,
  FiLogOut,
  FiUser,
  FiPlus,
  FiUserPlus,
  FiMenu,
  FiX,
  FiSun,
  FiMoon
} from "react-icons/fi";

export default function DashboardLayout() {
  const { role, username, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const isAdmin = role === "admin" || role === "Admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { to: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
    { to: "/admin/tasks", icon: FiCheckSquare, label: "Tasks" },
    { to: "/admin/tasks/new", icon: FiPlus, label: "Add Task" },
    { to: "/admin/users", icon: FiUsers, label: "Users" },
    { to: "/admin/users/new", icon: FiUserPlus, label: "Add User" },
    { to: "/admin/notifications", icon: FiBell, label: "Notifications" },
    { to: "/admin/profile", icon: FiUser, label: "Profile" },
  ];

  const userLinks = [
    { to: "/user/dashboard", icon: FiHome, label: "Dashboard" },
    { to: "/user/profile", icon: FiUser, label: "Profile" },
    { to: "/user/notifications", icon: FiBell, label: "Notifications" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-main flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface text-primary-themed border border-themed"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 theme-toggle"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-secondary border-r border-themed flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-themed">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FiCheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-primary-themed">TaskFlow</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-primary/15 text-primary border-l-2 border-primary"
                  : "text-secondary-themed hover:text-primary-themed hover:bg-primary/5"
                }`
              }
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-themed">
          {/* User Info */}
          <Link
            to={isAdmin ? "/admin/profile" : "/user/profile"}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors mb-2"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-medium">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-primary-themed font-medium truncate">{username}</p>
              <p className="text-xs text-muted-themed capitalize">{role}</p>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-themed hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
