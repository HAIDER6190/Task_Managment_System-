import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import {
    FiCheckSquare,
    FiUsers,
    FiCheckCircle,
    FiAlertTriangle,
    FiClipboard,
    FiUserCheck,
    FiMessageSquare
} from "react-icons/fi";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await getDashboardStats();
                if (!isMounted) return;
                setStats(data);
            } catch (err) {
                if (!isMounted) return;
                setError("Failed to load dashboard stats");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <Spinner label="Loading dashboard..." />;
    if (error) return <Alert variant="error">{error}</Alert>;
    if (!stats) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-semibold text-primary-themed mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Tasks"
                    value={stats.totalTasks}
                    icon={FiCheckSquare}
                    iconColor="text-blue-400"
                    bgColor="bg-blue-500/15"
                />
                <StatCard
                    label="Total Users"
                    value={stats.totalUsers}
                    icon={FiUsers}
                    iconColor="text-gray-400"
                    bgColor="bg-gray-500/15"
                />
                <StatCard
                    label="Completed"
                    value={stats.completedTasks}
                    icon={FiCheckCircle}
                    iconColor="text-green-400"
                    bgColor="bg-green-500/15"
                />
                <StatCard
                    label="Overdue"
                    value={stats.overdueTasks}
                    icon={FiAlertTriangle}
                    iconColor="text-red-400"
                    bgColor="bg-red-500/15"
                />

                <StatCard
                    label="To-Do Tasks"
                    value={stats.todoTasks}
                    icon={FiClipboard}
                    iconColor="text-blue-400"
                    bgColor="bg-blue-500/15"
                />
                <StatCard
                    label="Users with Tasks"
                    value={stats.usersWithTodoTasksCount}
                    icon={FiUserCheck}
                    iconColor="text-amber-400"
                    bgColor="bg-amber-500/15"
                />
                <StatCard
                    label="Pending Excuses"
                    value={stats.excuseTasksCount}
                    icon={FiMessageSquare}
                    iconColor="text-cyan-400"
                    bgColor="bg-cyan-500/15"
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, iconColor, bgColor }) {
    return (
        <div className="glass-card-dark p-6 hover:shadow-elevated transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-muted-themed text-sm font-medium mb-1">{label}</p>
                    <h3 className="text-3xl font-semibold text-primary-themed">{value}</h3>
                </div>
                <div className={`w-11 h-11 rounded-lg ${bgColor} flex items-center justify-center`}>
                    <Icon className={`${iconColor} w-5 h-5`} />
                </div>
            </div>
        </div>
    );
}
