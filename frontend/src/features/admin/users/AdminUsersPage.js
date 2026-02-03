import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, deleteUser } from "../../../api/admin";
import Spinner from "../../../components/Spinner";
import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import { FiUsers, FiSearch, FiFilter, FiEye, FiTrash2, FiMail, FiShield } from "react-icons/fi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data?.users || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load users. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete user. Please try again.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <FiUsers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400">
            Manage all registered users
          </p>
        </div>
        <span className="ml-auto text-sm text-gray-400">
          {filteredUsers.length} users
        </span>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="glass-card-dark p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="glass-input w-full pl-10"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass-input flex-1 cursor-pointer"
            >
              <option value="" className="bg-dark-800">All Roles</option>
              <option value="Admin" className="bg-dark-800">Admin</option>
              <option value="User" className="bg-dark-800">User</option>
            </select>
            <Button type="submit" variant="secondary" icon={FiFilter}>
              Filter
            </Button>
          </div>
        </div>
      </form>

      {/* Users Table */}
      <div className="glass-card-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">All Users</h2>
        </div>

        {loading ? (
          <Spinner label="Loading users..." />
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user.id || user._id;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <Link
                            to={`/admin/users/${id}`}
                            className="font-medium text-white hover:text-primary transition-colors"
                          >
                            {user.username}
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-gray-400">
                          <FiMail size={14} />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.role === "Admin" ? "badge-purple" : "badge-info"}`}>
                          <FiShield size={12} className="mr-1" />
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/users/${id}`}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={deletingId === id}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
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
