import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExcuseTasks } from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import { FiBell, FiMessageCircle, FiClock, FiArrowRight, FiInbox } from "react-icons/fi";

export default function AdminNotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const data = await getExcuseTasks();
        if (!isMounted) return;
        setItems(data?.tasks || []);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message ||
          "Failed to load excuse notifications.";
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <FiBell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary-themed">Notifications</h1>
          <p className="text-sm text-muted-themed">
            Review and respond to user excuse submissions
          </p>
        </div>
        {items.length > 0 && (
          <span className="ml-auto px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
            {items.length} pending
          </span>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Notifications List */}
      <div className="glass-card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-themed">
          <h2 className="text-lg font-semibold text-primary-themed">Pending Excuses</h2>
        </div>

        {loading ? (
          <Spinner label="Loading notifications..." />
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <FiInbox className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No pending notifications</p>
            <p className="text-gray-500 text-sm mt-1">
              You're all caught up! Check back later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((n) => (
              <Link
                key={n._id}
                to={`/admin/tasks/${n._id}`}
                className="block p-5 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <FiMessageCircle className="w-5 h-5 text-amber-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-primary-themed font-medium mb-1 group-hover:text-primary transition-colors">
                      {n.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-themed">
                      <span className="flex items-center gap-1">
                        From <span className="text-secondary-themed font-medium">{n.assignedTo?.username || "Unknown"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {n.updatedAt
                          ? new Date(n.updatedAt).toLocaleString()
                          : "Recently"}
                      </span>
                    </div>
                    {n.excuse && (
                      <p className="mt-2 text-sm text-muted-themed line-clamp-2">
                        "{n.excuse}"
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="text-muted-themed group-hover:text-primary transition-colors">
                    <FiArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
