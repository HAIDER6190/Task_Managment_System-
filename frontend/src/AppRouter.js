import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/authStore";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute, AdminRoute } from "./routes/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import UserDashboardPage from "./features/user/UserDashboardPage";
import UserTaskDetailPage from "./features/user/UserTaskDetailPage";
import AdminUsersPage from "./features/admin/users/AdminUsersPage";
import AdminUserDetailPage from "./features/admin/users/AdminUserDetailPage";
import AdminUserFormPage from "./features/admin/users/AdminUserFormPage";
import AdminTasksPage from "./features/admin/tasks/AdminTasksPage";
import AdminTaskFormPage from "./features/admin/tasks/AdminTaskFormPage";
import AdminTaskDetailPage from "./features/admin/tasks/AdminTaskDetailPage";
import AdminNotificationsPage from "./features/admin/notifications/AdminNotificationsPage";
import UserProfilePage from "./features/user/UserProfilePage";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public auth routes */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* User routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/user/dashboard" element={<UserDashboardPage />} />
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route
                path="/user/tasks/:taskId"
                element={<UserTaskDetailPage />}
              />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminTasksPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route
                path="/admin/users/new"
                element={<AdminUserFormPage />}
              />
              <Route
                path="/admin/users/:userId"
                element={<AdminUserDetailPage />}
              />
              <Route path="/admin/tasks" element={<AdminTasksPage />} />
              <Route
                path="/admin/tasks/new"
                element={<AdminTaskFormPage mode="create" />}
              />
              <Route
                path="/admin/tasks/:taskId"
                element={<AdminTaskDetailPage />}
              />
              <Route
                path="/admin/tasks/:taskId/edit"
                element={<AdminTaskFormPage mode="edit" />}
              />
              <Route
                path="/admin/notifications"
                element={<AdminNotificationsPage />}
              />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

