import React, { useEffect, useState } from "react";
import { getMyTasks } from "../../api/user";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";
import { FiBell, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function UserNotificationsPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await getMyTasks();
                if (!isMounted) return;
                // Filter tasks that have an admin response
                const answeredTasks = (data || []).filter(
                    (t) => t.adminResponse && t.adminResponse !== null
                );
                setTasks(answeredTasks);
            } catch (err) {
                if (!isMounted) return;
                setError("Failed to load notifications");
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        load();
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) return <Spinner label="Loading notifications..." />;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FiBell className="text-primary" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-primary-themed">Notifications</h1>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            {tasks.length === 0 ? (
                <div className="glass-card-dark p-8 text-center">
                    <p className="text-gray-400">No new notifications</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task._id} className="glass-card-dark p-6 flex gap-4">
                            <div className="mt-1">
                                {task.adminResponse === "accepted" ? (
                                    <FiCheckCircle className="text-green-400 w-6 h-6" />
                                ) : (
                                    <FiXCircle className="text-red-400 w-6 h-6" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary-themed mb-1">
                                    Excuse {task.adminResponse === "accepted" ? "Accepted" : "Declined"}: {task.title}
                                </h3>
                                <p className="text-muted-themed text-sm mb-3">
                                    Your excuse for this task was {task.adminResponse}.
                                </p>
                                {task.adminResponseMessage && (
                                    <div className="bg-surface-elevated p-3 rounded-lg text-sm text-secondary-themed">
                                        <span className="font-semibold text-muted-themed">Admin Note:</span> {task.adminResponseMessage}
                                    </div>
                                )}
                                <div className="mt-3 text-xs text-muted-themed">
                                    Task Status: <span className="text-primary">{task.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
