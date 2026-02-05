import apiClient from "./client";

// Users
export async function getUsers(params = {}) {
  const { data } = await apiClient.get("/admin/users", { params });
  return data;
}

export async function getUserById(userId) {
  const { data } = await apiClient.get(`/admin/users/${userId}`);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await apiClient.delete(`/admin/users/${userId}`);
  return data;
}

export async function createUser(userData) {
  const { data } = await apiClient.post("/admin/users", userData);
  return data;
}

export async function getDashboardStats() {
  const { data } = await apiClient.get("/admin/stats");
  return data;
}

// Tasks
export async function createTask(payload) {
  const { data } = await apiClient.post("/tasks", payload);
  return data;
}

export async function updateTask(taskId, payload) {
  const { data } = await apiClient.put(`/admin/tasks/${taskId}`, payload);
  return data;
}

export async function getTasks(params = {}) {
  const { data } = await apiClient.get("/admin/tasks", { params });
  return data;
}

export async function getTaskById(taskId) {
  const { data } = await apiClient.get(`/admin/tasks/${taskId}`);
  return data;
}

export async function reassignTask(taskId, assignedTo) {
  const { data } = await apiClient.patch(`/admin/tasks/${taskId}/reassign`, {
    assignedTo,
  });
  return data;
}

export async function getExcuseTasks() {
  const { data } = await apiClient.get("/admin/tasks/excuses");
  return data;
}

export async function respondToExcuse(taskId, payload) {
  const { data } = await apiClient.patch(`/tasks/${taskId}/respond`, payload);
  return data;
}

export async function unlockTask(taskId) {
  const { data } = await apiClient.patch(`/tasks/${taskId}/unlock`);
  return data;
}

export async function deleteTask(taskId) {
  const { data } = await apiClient.delete(`/admin/tasks/${taskId}`);
  return data;
}

