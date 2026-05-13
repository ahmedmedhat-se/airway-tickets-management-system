/**
 * Flights & Bookings API utilities
 */

const BASE = '/api/flights';

/** Safely parse response — handles empty bodies and non-JSON responses */
async function safeJson(res) {
  const text = await res.text();
  let data = {};
  if (text) {
    try { data = JSON.parse(text); } catch { /* non-JSON */ }
  }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (HTTP ${res.status})`);
  }
  return data;
}

const get  = (url) => fetch(url, { credentials: 'include' }).then(safeJson);
const del  = (url) => fetch(url, { method: 'DELETE', credentials: 'include' }).then(safeJson);
const post = (url, body) => fetch(url, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(safeJson);
const put = (url, body) => fetch(url, {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(safeJson);

// ── Public ──────────────────────────────────────────────────
export const getAllFlights  = ()     => get(BASE);
export const getFlightById = (id)   => get(`${BASE}/${id}`);
export const searchFlights = (o,d,dt) => get(`${BASE}/search?origin=${o}&destination=${d}&date=${dt}`);

// ── Booking ─────────────────────────────────────────────────
export const bookFlight    = (id, payload) => post(`${BASE}/${id}/book`, payload);
export const getMyBookings = ()            => get(`${BASE}/bookings`);
export const cancelBooking = (id)          => del(`${BASE}/bookings/${id}`);

// ── Admin ────────────────────────────────────────────────────
export const getAllBookings = ()           => get(`${BASE}/bookings/all`);
export const createFlight  = (payload)    => post(BASE, payload);
export const updateFlight  = (id,payload) => put(`${BASE}/${id}`, payload);
export const deleteFlight  = (id)         => del(`${BASE}/${id}`);
