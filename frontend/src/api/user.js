import apiClient from "./client";

export async function getProfile() {
  const { data } = await apiClient.get("/users/me");
  return data;
}

export async function updateProfile(profileData) {
  const { data } = await apiClient.patch("/users/me", profileData);
  return data;
}

export async function getMyTasks() {
  const { data } = await apiClient.get("/tasks/my");
  return data;
}

export async function completeTask(taskId) {
  const { data } = await apiClient.patch(`/tasks/${taskId}/complete`);
  return data;
}

export async function submitExcuse(taskId, excuse) {
  const { data } = await apiClient.patch(`/tasks/${taskId}/excuse`, {
    excuse,
  });
  return data;
}
