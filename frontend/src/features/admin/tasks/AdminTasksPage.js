import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTasks, unlockTask, deleteTask } from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import { FiPlus, FiSearch, FiFilter, FiEye, FiUnlock, FiCheckSquare, FiTrash2 } from "react-icons/fi";

export default function AdminTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unlockingId, setUnlockingId] = useState(null);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getTasks({
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
      });
      setTasks(data?.tasks || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load tasks. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  const handleUnlock = async (id) => {
    setUnlockingId(id);
    try {
      await unlockTask(id);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id || t._id === id ? { ...t, locked: false } : t
        )
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to unlock task. Please try again.";
      setError(message);
    } finally {
      setUnlockingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete task. Please try again.";
      setError(message);
    }
  };

  // Filter tasks based on search
  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.assignedTo?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <FiCheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-themed">Tasks</h1>
            <p className="text-sm text-muted-themed">
              Manage and assign tasks to users
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/admin/tasks/new")} icon={FiPlus}>
          Create Task
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="glass-card-dark p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or user..."
              className="glass-input w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="glass-input w-full cursor-pointer"
            >
              <option value="" className="bg-surface">All Status</option>
              <option value="Todo" className="bg-surface">Todo</option>
              <option value="Completed" className="bg-surface">Completed</option>
              <option value="Excused" className="bg-surface">Excused</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="glass-input flex-1 cursor-pointer"
            >
              <option value="" className="bg-surface">All Priority</option>
              <option value="Low" className="bg-surface">Low</option>
              <option value="Medium" className="bg-surface">Medium</option>
              <option value="High" className="bg-surface">High</option>
            </select>
            <Button type="submit" variant="secondary" icon={FiFilter}>
              Filter
            </Button>
          </div>
        </div>
      </form>

      {/* Tasks Table */}
      <div className="glass-card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-themed flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-themed">All Tasks</h2>
          <span className="text-sm text-muted-themed">{filteredTasks.length} tasks</span>
        </div>

        {loading ? (
          <Spinner label="Loading tasks..." />
        ) : filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-themed">
            <FiCheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Assigned To</th>
                  <th>Locked</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const id = task.id || task._id;
                  return (
                    <tr key={id}>
                      <td>
                        <Link
                          to={`/admin/tasks/${id}`}
                          className="font-medium text-primary-themed hover:text-primary transition-colors"
                        >
                          {task.title}
                        </Link>
                      </td>
                      <td>
                        <StatusBadge value={task.status} />
                      </td>
                      <td>
                        <PriorityBadge value={task.priority} />
                      </td>
                      <td className="text-muted-themed">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-secondary-themed">
                        {task.assignedTo?.username || task.assignedTo || "-"}
                      </td>
                      <td>
                        {task.locked ? (
                          <span className="badge badge-warning">Locked</span>
                        ) : (
                          <span className="badge badge-success">Open</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/tasks/${id}`}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                          {task.locked && (
                            <button
                              onClick={() => handleUnlock(id)}
                              disabled={unlockingId === id}
                              className="p-2 rounded-lg hover:bg-white/10 text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                              title="Unlock"
                            >
                              <FiUnlock size={18} />
                            </button>
                          )}
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

function StatusBadge({ value }) {
  const map = {
    Todo: "badge-info",
    Completed: "badge-success",
    Excused: "badge-purple",
  };
  return <span className={`badge ${map[value] || "badge-info"}`}>{value || "N/A"}</span>;
}

function PriorityBadge({ value }) {
  const map = {
    Low: "badge-success",
    Medium: "badge-warning",
    High: "badge-danger",
  };
  return <span className={`badge ${map[value] || "badge-info"}`}>{value || "N/A"}</span>;
}
