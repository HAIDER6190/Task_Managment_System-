import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/user";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiSave, FiX, FiHelpCircle } from "react-icons/fi";

const SECURITY_QUESTIONS = [
  "What's your favorite color?",
  "Who was your favorite teacher in secondary school?",
  "Who is your favorite football player?",
  "Who was your idol growing up?",
];

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    securityQuestion: "",
    answer: "",
  });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setError("");
      try {
        const data = await getProfile();
        if (!isMounted) return;
        setProfile(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          securityQuestion: data.securityQuestion || "",
          answer: "", // Don't show existing answer for security
        });
      } catch (err) {
        if (!isMounted) return;
        const message =
          err.response?.data?.message || "Failed to load profile.";
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile(form);
      setProfile((prev) => ({
        ...prev,
        username: form.username,
        email: form.email,
      }));
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      username: profile?.username || "",
      email: profile?.email || "",
    });
    setEditing(false);
    setError("");
  };

  if (loading) {
    return <Spinner label="Loading profile..." />;
  }

  if (!profile) {
    return <Alert variant="error">Failed to load profile</Alert>;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Profile Card */}
      <div className="glass-card-dark p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-3xl font-semibold text-white">
              {profile.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-primary-themed">{profile.username}</h1>
            <p className="text-muted-themed">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-info">
                <FiShield size={12} className="mr-1" />
                {profile.role?.toUpperCase() || "USER"}
              </span>
            </div>
          </div>
          {!editing && (
            <Button
              variant="secondary"
              onClick={() => setEditing(true)}
              icon={FiEdit2}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {editing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              icon={FiUser}
              placeholder="Enter username"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              icon={FiMail}
              placeholder="Enter email"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  <FiHelpCircle className="inline mr-2" size={16} />
                  Security Question
                </label>
                <select
                  name="securityQuestion"
                  value={form.securityQuestion}
                  onChange={handleChange}
                  className="glass-input w-full cursor-pointer"
                >
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q} className="bg-dark-800 text-white">
                      {q}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Security Answer"
                name="answer"
                value={form.answer}
                onChange={handleChange}
                icon={FiShield}
                placeholder="Enter security answer"
                type="password"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                icon={FiX}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} icon={FiSave}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          /* Profile Info */
          <div className="space-y-4">
            <ProfileRow icon={FiUser} label="Username" value={profile.username} />
            <ProfileRow icon={FiMail} label="Email" value={profile.email} />
            <ProfileRow
              icon={FiShield}
              label="Role"
              value={profile.role?.toUpperCase() || "USER"}
            />
            {profile.createdAt && (
              <ProfileRow
                icon={FiCalendar}
                label="Joined"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
            )}
            <ProfileRow
              icon={FiShield}
              label="Security Question"
              value={profile.securityQuestion || "Not set"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/5">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
        <Icon className="text-gray-400" size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
