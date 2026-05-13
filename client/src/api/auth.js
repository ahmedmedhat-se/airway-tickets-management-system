/**
 * Auth API utilities
 * Backend uses HttpSession (cookie-based) auth — NOT JWTs.
 * All requests must include credentials: 'include' so the JSESSIONID cookie is sent.
 */

const BASE = '/api';

/** Safely parse response — handles empty bodies and non-JSON gracefully */
async function safeJson(res) {
  const text = await res.text();
  let data = {};
  if (text) {
    try { data = JSON.parse(text); } catch { /* non-JSON response */ }
  }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (HTTP ${res.status})`);
  }
  return data;
}

/** Register a new account */
export async function register({ username, password, email, fullName, role = 'USER' }) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, fullName, role }),
  });
  return safeJson(res);
}

/**
 * Login — backend expects application/x-www-form-urlencoded with
 * @RequestParam username & password
 */
export async function login({ username, password }) {
  const params = new URLSearchParams({ username, password });
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  return safeJson(res); // { message, user: { id, username, email, fullName, role } }
}

/** Logout — invalidates the server-side session */
export async function logout() {
  try {
    await fetch(`${BASE}/auth/logout`, { credentials: 'include' });
  } catch { /* ignore */ }
}

/** Fetch the profile of the currently authenticated user */
export async function getProfile() {
  try {
    const res = await fetch(`${BASE}/auth/profile`, { credentials: 'include' });
    if (!res.ok) return null;
    return safeJson(res);
  } catch {
    return null;
  }
}
