import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask, updateTask, getTaskById, getUsers } from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import { FiSave, FiX, FiCheckSquare, FiUser, FiCalendar, FiFlag, FiFileText } from "react-icons/fi";

export default function AdminTaskFormPage({ mode = "create" }) {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Fetch users for dropdown
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setError("");
      try {
        // Fetch users
        const usersData = await getUsers();
        if (!isMounted) return;
        // Filter to only show regular users (not admins) for assignment
        const regularUsers = (usersData?.users || []).filter(u => u.role !== "Admin");
        setUsers(regularUsers);

        // If editing, also fetch task data
        if (isEdit && taskId) {
          const taskData = await getTaskById(taskId);
          if (!isMounted) return;
          setForm({
            title: taskData.title || "",
            description: taskData.description || "",
            priority: taskData.priority || "Medium",
            assignedTo: taskData.assignedTo?._id || taskData.assignedTo || "",
            dueDate: taskData.dueDate ? taskData.dueDate.slice(0, 16) : "",
          });
        }
      } catch (err) {
        if (!isMounted) return;
        const message = err.response?.data?.message || "Failed to load data.";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [isEdit, taskId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.priority || !form.assignedTo || !form.dueDate) {
      setError("Title, priority, assigned user, and due date are required.");
      return;
    }

    if (new Date(form.dueDate) < new Date()) {
      setError("Due date must be in the future.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        assignedTo: form.assignedTo,
        dueDate: new Date(form.dueDate).toISOString(),
      };
      if (!isEdit) {
        await createTask(payload);
        setSuccess("Task created successfully.");
        setTimeout(() => navigate("/admin/tasks"), 800);
      } else {
        await updateTask(taskId, payload);
        setSuccess("Task updated successfully.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to save task. Please try again.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading..." />;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="glass-card-dark p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FiCheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-themed">
              {isEdit ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="text-sm text-muted-themed">
              {isEdit ? "Update task details" : "Assign a new task to a user"}
            </p>
          </div>
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-secondary-themed">
              <FiFileText size={16} />
              Task Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="glass-input w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-secondary-themed">
              <FiFileText size={16} />
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              className="glass-input w-full resize-none"
            />
          </div>

          {/* Priority and Assign To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-secondary-themed">
                <FiFlag size={16} />
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="glass-input w-full cursor-pointer"
              >
                <option value="Low" className="bg-surface">Low</option>
                <option value="Medium" className="bg-surface">Medium</option>
                <option value="High" className="bg-surface">High</option>
              </select>
            </div>

            {/* Assign To - User Dropdown */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-secondary-themed">
                <FiUser size={16} />
                Assign To
              </label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="glass-input w-full cursor-pointer"
              >
                <option value="" className="bg-surface">Select a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id} className="bg-surface">
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="text-xs text-amber-400">No users available for assignment</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-secondary-themed">
              <FiCalendar size={16} />
              Due Date
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="glass-input w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-themed">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/tasks")}
              icon={FiX}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} icon={FiSave}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
