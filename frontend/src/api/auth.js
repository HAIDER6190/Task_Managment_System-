import apiClient from "./client";

export async function register(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function login(credentials) {
  const { data } = await apiClient.post("/auth/login", credentials);
  // expected: { token, role, userId, username }
  return data;
}

