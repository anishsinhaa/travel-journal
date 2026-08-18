const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

let tokenGetter = null;

export function setTokenGetter(getter) {
  tokenGetter = getter;
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
