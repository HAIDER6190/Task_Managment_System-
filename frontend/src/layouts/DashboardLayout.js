import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
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
  FiX
} from "react-icons/fi";

export default function DashboardLayout() {
  const { role, username, logout } = useAuth();
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
  ];

  const userLinks = [
    { to: "/user/dashboard", icon: FiHome, label: "Dashboard" },
    { to: "/user/profile", icon: FiUser, label: "Profile" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-800 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 sidebar-gradient border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FiCheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          {/* User Info */}
          <Link
            to={isAdmin ? "/admin/dashboard" : "/user/profile"}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors mb-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-medium">
                {username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{username}</p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
