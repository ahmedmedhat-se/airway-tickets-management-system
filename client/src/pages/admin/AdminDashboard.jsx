import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faTicket, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { getAllFlights, getAllBookings } from '../../api/flights';

function StatCard({ icon, value, label, color }) {
  return (
    <div className="admin-stat-card">
      <div className="d-flex align-items-center gap-3">
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <div className="admin-stat-value">{value ?? '—'}</div>
          <div className="admin-stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [flights, setFlights]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getAllFlights(), getAllBookings()])
      .then(([f, b]) => { setFlights(f); setBookings(b); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scheduled  = flights.filter(f => f.status === 'SCHEDULED').length;
  const uniqueUsers = new Set(bookings.map(b => b.bookedBy?.id)).size;
  const revenue    = bookings.reduce((s, b) => s + (b.flight?.price ?? 0), 0);

  if (loading) return <div className="loader-wrap"><div className="spin-ring" /><span>Loading…</span></div>;

  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>

      {/* Stats */}
      <div className="row row-cols-2 row-cols-xl-4 g-3 mb-4">
        <div className="col"><StatCard icon={faPlane}     value={flights.length}   label="Total Flights"  color="var(--primary)" /></div>
        <div className="col"><StatCard icon={faChartLine} value={scheduled}         label="Scheduled"      color="#30c48d" /></div>
        <div className="col"><StatCard icon={faTicket}    value={bookings.length}  label="Bookings"       color="#ff9f0a" /></div>
        <div className="col"><StatCard icon={faUsers}     value={uniqueUsers}       label="Passengers"     color="#af52de" /></div>
      </div>

      {/* Revenue card */}
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--primary)' }}>
            ${revenue.toFixed(2)}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Revenue</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From all confirmed bookings</div>
          </div>
        </div>
      </div>

      {/* Recent bookings table */}
      <h5 style={{ fontWeight: 600, marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Recent Bookings</h5>
      <div className="app-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Seat</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(0, 8).map(b => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-tertiary)' }}>{b.id}</td>
                <td>{b.fullName}</td>
                <td><span style={{ fontWeight: 600 }}>{b.flight?.flightNumber}</span></td>
                <td>{b.flight?.origin} → {b.flight?.destination}</td>
                <td>{b.seatNumber}</td>
                <td>
                  <span className={`badge flight-status-badge ${b.bookingStatus === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
                    {b.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-4">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
