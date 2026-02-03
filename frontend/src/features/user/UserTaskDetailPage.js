import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyTasks, submitExcuse } from "../../api/user";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import {
  FiArrowLeft,
  FiCalendar,
  FiFlag,
  FiLock,
  FiUnlock,
  FiSend,
  FiMessageCircle,
  FiCheck,
  FiX
} from "react-icons/fi";

export default function UserTaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [excuse, setExcuse] = useState("");
  const [excuseError, setExcuseError] = useState("");
  const [excuseSuccess, setExcuseSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const list = await getMyTasks();
        if (!isMounted) return;
        const found =
          list?.find((t) => t.id === taskId || t._id === taskId) || null;
        if (!found) {
          setError("Task not found.");
        } else {
          setTask(found);
        }
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message ||
          "Failed to load task. Please try again.";
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

  const handleSubmitExcuse = async (e) => {
    e.preventDefault();
    setExcuseError("");
    setExcuseSuccess("");
    if (!excuse.trim()) {
      setExcuseError("Please enter an excuse.");
      return;
    }
    setSubmitting(true);
    try {
      await submitExcuse(taskId, excuse.trim());
      setExcuseSuccess("Excuse submitted to admin successfully!");
      setTask((prev) => prev ? { ...prev, excuse: excuse.trim(), status: "Excused" } : prev);
      setExcuse("");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to submit excuse.";
      setExcuseError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner label="Loading task..." />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!task) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/user/dashboard")}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          <p className="text-sm text-gray-400">
            Assigned by {task.createdBy?.username || task.createdBy || "Admin"}
          </p>
        </div>
      </div>

      {/* Task Details Card */}
      <div className="glass-card-dark p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <InfoCard
            icon={FiFlag}
            label="Priority"
            value={task.priority || "N/A"}
            color={task.priority === "High" ? "text-red-400" : task.priority === "Medium" ? "text-amber-400" : "text-green-400"}
          />
          <InfoCard
            icon={FiCalendar}
            label="Due Date"
            value={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
          />
          <InfoCard
            icon={task.locked ? FiLock : FiUnlock}
            label="Status"
            value={task.status || "Todo"}
            color={task.locked ? "text-amber-400" : task.status === "Completed" ? "text-green-400" : "text-blue-400"}
          />
          <InfoCard
            icon={task.locked ? FiLock : FiUnlock}
            label="Lock Status"
            value={task.locked ? "Locked" : "Open"}
            color={task.locked ? "text-amber-400" : "text-green-400"}
          />
        </div>

        {task.description && (
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </div>

      {/* Admin Response Card (if exists) */}
      {(task.adminResponse || task.excuse) && (
        <div className="glass-card-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FiMessageCircle className="text-purple-400" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-white">Excuse Status</h2>
          </div>

          {/* Your submitted excuse */}
          {task.excuse && (
            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
              <p className="text-sm text-gray-400 mb-1">Your submitted excuse:</p>
              <p className="text-gray-300">"{task.excuse}"</p>
            </div>
          )}

          {/* Admin Response */}
          {task.adminResponse && (
            <div className="bg-gradient-to-r from-white/5 to-transparent rounded-xl p-4 border-l-4 border-primary">
              <p className="text-sm text-gray-400 mb-2">Admin Response:</p>
              <div className="flex items-center gap-2 mb-2">
                {task.adminResponse === "accepted" ? (
                  <span className="badge badge-success">
                    <FiCheck size={12} className="mr-1" /> Accepted
                  </span>
                ) : (
                  <span className="badge badge-danger">
                    <FiX size={12} className="mr-1" /> Declined
                  </span>
                )}
              </div>
              {task.adminResponseMessage && (
                <p className="text-gray-300 italic">"{task.adminResponseMessage}"</p>
              )}
            </div>
          )}

          {task.excuse && !task.adminResponse && (
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              Waiting for admin response...
            </div>
          )}
        </div>
      )}

      {/* Submit Excuse Card */}
      <div className="glass-card-dark p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FiSend className="text-amber-400" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-white">Submit Excuse</h2>
        </div>

        {excuseError && <Alert variant="error">{excuseError}</Alert>}
        {excuseSuccess && <Alert variant="success">{excuseSuccess}</Alert>}

        <form onSubmit={handleSubmitExcuse} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Your Excuse
            </label>
            <textarea
              rows={4}
              className="glass-input w-full resize-none"
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
              placeholder="Explain why you could not complete the task on time..."
            />
          </div>
          <Button type="submit" disabled={submitting} icon={FiSend}>
            {submitting ? "Submitting..." : "Submit Excuse"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
        <Icon size={14} />
        {label}
      </div>
      <div className={`font-semibold ${color}`}>{value}</div>
    </div>
  );
}
