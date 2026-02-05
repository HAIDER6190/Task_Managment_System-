import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import { FiArrowLeft, FiUser, FiMail, FiShield, FiCalendar, FiHash } from "react-icons/fi";

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const data = await getUserById(userId);
        if (!isMounted) return;
        setUser(data);
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message || "Failed to load user details.";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return <Spinner label="Loading user..." />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/users")}
          className="p-2 rounded-lg hover:bg-white/10 text-muted-themed hover:text-primary-themed transition-colors"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-primary-themed">User Details</h1>
      </div>

      {/* User Card */}
      <div className="glass-card-dark p-6 md:p-8">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-themed">{user.username}</h2>
            <p className="text-secondary-themed">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${user.role === "Admin" ? "badge-purple" : "badge-info"}`}>
                <FiShield size={12} className="mr-1" />
                {user.role?.toUpperCase() || "USER"}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <DetailRow icon={FiHash} label="User ID" value={user.id || user._id} />
          <DetailRow icon={FiUser} label="Username" value={user.username} />
          <DetailRow icon={FiMail} label="Email" value={user.email} />
          <DetailRow icon={FiShield} label="Role" value={user.role || "User"} />
          {user.createdAt && (
            <DetailRow
              icon={FiCalendar}
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-themed">
      <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center">
        <Icon className="text-muted-themed" size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-secondary-themed">{label}</p>
        <p className="text-primary-themed font-medium">{value}</p>
      </div>
    </div>
  );
}
