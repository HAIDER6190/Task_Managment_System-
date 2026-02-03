import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, getMyTasks, completeTask } from "../../api/user";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import {
  FiCheckSquare,
  FiClock,
  FiAlertTriangle,
  FiCheck,
  FiEye,
  FiSearch,
  FiFilter
} from "react-icons/fi";

function computeStats(tasks) {
  const now = new Date();
  let completed = 0;
  let overdue = 0;
  let pending = 0;

  tasks.forEach((t) => {
    if (t.status === "Completed") {
      completed += 1;
    } else {
      pending += 1;
      if (t.dueDate && !t.locked) {
        const due = new Date(t.dueDate);
        if (due < now) {
          overdue += 1;
        }
      }
    }
  });

  return { completed, overdue, pending };
}

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const [p, t] = await Promise.all([getProfile(), getMyTasks()]);
        if (!isMounted) return;
        setProfile(p);
        setTasks(t || []);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message ||
          "Failed to load profile or tasks. Please try again.";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => computeStats(tasks), [tasks]);

  const handleComplete = async (taskId) => {
    setActionError("");
    setActionLoadingId(taskId);
    try {
      await completeTask(taskId);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId || t._id === taskId
            ? { ...t, status: "Completed" }
            : t
        )
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to mark task as completed.";
      setActionError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Spinner label="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {profile?.username?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {profile?.username}!
          </h1>
          <p className="text-gray-400">
            Here's your task overview for today
          </p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {actionError && <Alert variant="error">{actionError}</Alert>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={FiClock}
          label="Pending"
          value={stats.pending}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={FiCheck}
          label="Completed"
          value={stats.completed}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={FiAlertTriangle}
          label="Overdue"
          value={stats.overdue}
          color="from-red-500 to-rose-500"
        />
      </div>

      {/* Tasks Section */}
      <div className="glass-card-dark overflow-hidden">
        {/* Header with Filters */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiCheckSquare className="text-primary" size={20} />
              <h2 className="text-lg font-semibold text-white">My Assigned Tasks</h2>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="glass-input pl-9 pr-4 py-2 text-sm w-48"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input py-2 text-sm cursor-pointer"
              >
                <option value="" className="bg-dark-800">All Status</option>
                <option value="Todo" className="bg-dark-800">Todo</option>
                <option value="Completed" className="bg-dark-800">Completed</option>
                <option value="Excused" className="bg-dark-800">Excused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FiCheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const id = task.id || task._id;
                  const locked = task.locked;
                  const isCompleted = task.status === "Completed";
                  return (
                    <tr key={id}>
                      <td>
                        <Link
                          to={`/user/tasks/${id}`}
                          className="font-medium text-white hover:text-primary transition-colors"
                        >
                          {task.title}
                        </Link>
                        {task.createdBy && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            by {task.createdBy?.username || task.createdBy}
                          </p>
                        )}
                      </td>
                      <td>
                        <PriorityBadge value={task.priority} />
                      </td>
                      <td className="text-gray-400">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <StatusBadge value={task.status} locked={locked} />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {!isCompleted && !locked && (
                            <Button
                              variant="ghost"
                              className="text-sm px-3 py-1.5"
                              onClick={() => handleComplete(id)}
                              disabled={actionLoadingId === id}
                              icon={FiCheck}
                            >
                              {actionLoadingId === id ? "..." : "Complete"}
                            </Button>
                          )}
                          <Link
                            to={`/user/tasks/${id}`}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ value }) {
  const map = {
    Low: "badge-success",
    Medium: "badge-warning",
    High: "badge-danger",
  };
  return <span className={`badge ${map[value] || "badge-info"}`}>{value || "N/A"}</span>;
}

function StatusBadge({ value, locked }) {
  if (locked) {
    return <span className="badge badge-warning">Locked</span>;
  }
  const map = {
    Todo: "badge-info",
    Completed: "badge-success",
    Excused: "badge-purple",
  };
  return <span className={`badge ${map[value] || "badge-info"}`}>{value || "N/A"}</span>;
}
