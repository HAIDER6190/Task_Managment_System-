import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTaskById,
  reassignTask,
  respondToExcuse,
  unlockTask,
  getUsers,
} from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import {
  FiEdit,
  FiUser,
  FiCalendar,
  FiFlag,
  FiLock,
  FiUnlock,
  FiCheck,
  FiX,
  FiMessageCircle,
  FiArrowLeft,
  FiSend
} from "react-icons/fi";

export default function AdminTaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [reassignLoading, setReassignLoading] = useState(false);
  const [responseForm, setResponseForm] = useState({
    response: "accepted",
    message: "",
  });
  const [respondLoading, setRespondLoading] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const [taskData, usersData] = await Promise.all([
          getTaskById(taskId),
          getUsers()
        ]);
        if (!isMounted) return;
        setTask(taskData);
        setUsers((usersData?.users || []).filter(u => u.role !== "Admin"));
        setAssignedTo(taskData.assignedTo?._id || taskData.assignedTo || "");
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message || "Failed to load task details.";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  const handleReassign = async (e) => {
    e.preventDefault();
    if (!assignedTo) return;
    setReassignLoading(true);
    try {
      await reassignTask(taskId, assignedTo);
      const selectedUser = users.find(u => u._id === assignedTo);
      setTask((prev) =>
        prev
          ? {
            ...prev,
            assignedTo: selectedUser || assignedTo,
          }
          : prev
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to reassign task.";
      setError(message);
    } finally {
      setReassignLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    setRespondLoading(true);
    try {
      await respondToExcuse(taskId, responseForm);
      setTask((prev) =>
        prev
          ? {
            ...prev,
            adminResponse: responseForm.response,
            adminResponseMessage: responseForm.message,
          }
          : prev
      );
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to respond to excuse.";
      setError(message);
    } finally {
      setRespondLoading(false);
    }
  };

  const handleUnlock = async () => {
    setUnlockLoading(true);
    try {
      await unlockTask(taskId);
      setTask((prev) => (prev ? { ...prev, locked: false } : prev));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to unlock task.";
      setError(message);
    } finally {
      setUnlockLoading(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading task..." />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!task) return null;

  const id = task.id || task._id;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/tasks")}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-themed">{task.title}</h1>
            <p className="text-sm text-secondary-themed">
              Created by {task.createdBy?.username || task.createdBy || "Unknown"}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate(`/admin/tasks/${id}/edit`)}
          icon={FiEdit}
        >
          Edit Task
        </Button>
      </div>

      {/* Task Info Card */}
      <div className="glass-card-dark p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <InfoCard
            icon={FiFlag}
            label="Priority"
            value={task.priority}
            color={task.priority === "High" ? "text-red-400" : task.priority === "Medium" ? "text-amber-400" : "text-green-400"}
          />
          <InfoCard
            icon={FiCalendar}
            label="Due Date"
            value={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
          />
          <InfoCard
            icon={FiUser}
            label="Assigned To"
            value={task.assignedTo?.username || task.assignedTo || "-"}
          />
          <InfoCard
            icon={task.locked ? FiLock : FiUnlock}
            label="Status"
            value={task.locked ? "Locked" : task.status}
            color={task.locked ? "text-amber-400" : "text-green-400"}
          />
        </div>

        {task.description && (
          <div className="border-t border-themed pt-4">
            <h3 className="text-sm font-medium text-muted-themed mb-2">Description</h3>
            <p className="text-secondary-themed whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reassign Card */}
        <div className="glass-card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FiUser className="text-blue-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-primary-themed">Reassign Task</h2>
          </div>

          <form onSubmit={handleReassign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-themed mb-1.5">
                Assign to User
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="glass-input w-full cursor-pointer"
              >
                <option value="" className="bg-surface">Select a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id} className="bg-surface">
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={reassignLoading || !assignedTo} icon={FiUser}>
              {reassignLoading ? "Reassigning..." : "Reassign"}
            </Button>
          </form>
        </div>

        {/* Excuse Response Card */}
        <div className="glass-card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FiMessageCircle className="text-purple-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-primary-themed">Respond to Excuse</h2>
          </div>

          {task.excuse && (
            <div className="bg-surface-elevated rounded-xl p-4 mb-4 border border-themed">
              <p className="text-sm text-muted-themed mb-1">User's excuse:</p>
              <p className="text-secondary-themed">"{task.excuse}"</p>
            </div>
          )}

          <form onSubmit={handleRespond} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-themed mb-1.5">
                Response
              </label>
              <select
                value={responseForm.response}
                onChange={(e) =>
                  setResponseForm((prev) => ({
                    ...prev,
                    response: e.target.value,
                  }))
                }
                className="glass-input w-full cursor-pointer"
              >
                <option value="accepted" className="bg-surface">✓ Accepted</option>
                <option value="declined" className="bg-surface">✗ Declined</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-themed mb-1.5">
                Message (optional)
              </label>
              <textarea
                rows={3}
                value={responseForm.message}
                onChange={(e) =>
                  setResponseForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                placeholder="Add a message to the user..."
                className="glass-input w-full resize-none"
              />
            </div>
            <Button type="submit" disabled={respondLoading} icon={FiSend}>
              {respondLoading ? "Sending..." : "Send Response"}
            </Button>
          </form>

          {task.adminResponse && (
            <div className="mt-4 pt-4 border-t border-themed">
              <p className="text-sm text-muted-themed mb-2">Previous Response:</p>
              <div className="flex items-center gap-2">
                {task.adminResponse === "accepted" ? (
                  <span className="badge badge-success"><FiCheck size={12} className="mr-1" /> Accepted</span>
                ) : (
                  <span className="badge badge-danger"><FiX size={12} className="mr-1" /> Declined</span>
                )}
              </div>
              {task.adminResponseMessage && (
                <p className="text-secondary-themed text-sm mt-2">"{task.adminResponseMessage}"</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lock Status Card */}
      {task.locked && (
        <div className="glass-card-dark p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <FiLock className="text-amber-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-themed">Task is Locked</h2>
                <p className="text-sm text-muted-themed">This task was locked due to being overdue</p>
              </div>
            </div>
            <Button
              variant="secondary"
              disabled={unlockLoading}
              onClick={handleUnlock}
              icon={FiUnlock}
            >
              {unlockLoading ? "Unlocking..." : "Unlock Task"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color = "text-primary-themed" }) {
  return (
    <div className="bg-surface-elevated rounded-xl p-4 border border-themed">
      <div className="flex items-center gap-2 text-muted-themed text-sm mb-1">
        <Icon size={14} />
        {label}
      </div>
      <div className={`font-semibold ${color}`}>{value}</div>
    </div>
  );
}
