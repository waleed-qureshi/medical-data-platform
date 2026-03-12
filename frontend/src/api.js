const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("mdp_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    return { message: data?.message || res.statusText };
  }

  return data;
}

export async function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(user) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function fetchPatients() {
  return request("/api/patients");
}

export async function fetchPatient(id) {
  return request(`/api/patients/${id}`);
}

export async function createPatient(data) {
  return request("/api/patients", { method: "POST", body: JSON.stringify(data) });
}

export async function fetchRecords(patientId) {
  return request(`/api/records/${patientId}`);
}

export async function uploadDataset(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/datasets/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) return { message: data?.message || res.statusText };
  return data;
}

export async function fetchUploads() {
  return request("/api/datasets");
}

export function downloadUpload(id) {
  const token = getToken();
  const url = `${API_BASE}/api/datasets/${id}/download`;
  return token ? `${url}?token=${encodeURIComponent(token)}` : url;
}

export async function fetchUsers() {
  return request("/api/users");
}

export async function fetchAnalytics() {
  return request("/api/analytics/summary");
}

export function logout() {
  localStorage.removeItem("mdp_token");
  localStorage.removeItem("mdp_user");
}

export function saveAuth({ token, user }) {
  localStorage.setItem("mdp_token", token);
  localStorage.setItem("mdp_user", JSON.stringify(user));
}

export function getCurrentUser() {
  const raw = localStorage.getItem("mdp_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
