import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getAllBookings, cancelBooking } from '../../api/flights';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    getAllBookings().then(setBookings).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try { await cancelBooking(id); load(); } catch (e) { alert(e.message); }
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return !q || b.fullName?.toLowerCase().includes(q)
      || b.flight?.flightNumber?.toLowerCase().includes(q)
      || b.seatNumber?.toLowerCase().includes(q);
  });

  if (loading) return <div className="loader-wrap"><div className="spin-ring" /><span>Loading…</span></div>;

  return (
    <div>
      <h2 className="admin-page-title">
        <FontAwesomeIcon icon={faTicket} className="me-2" style={{ color: 'var(--primary)' }} />
        All Bookings
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3" style={{ maxWidth: 320 }}>
        <input type="text" className="form-control" placeholder="Search passenger, flight, seat…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="app-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th><th>Passenger</th><th>Flight</th><th>Route</th>
              <th>Seat</th><th>Booked By</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-tertiary)' }}>{b.id}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{b.email}</div>
                </td>
                <td><span style={{ fontWeight: 600 }}>{b.flight?.flightNumber ?? '—'}</span></td>
                <td>{b.flight?.origin} → {b.flight?.destination}</td>
                <td>{b.seatNumber}</td>
                <td style={{ fontSize: '0.82rem' }}>{b.bookedBy?.username ?? '—'}</td>
                <td>
                  <span className={`badge flight-status-badge ${b.bookingStatus === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td>
                  {b.bookingStatus === 'CONFIRMED' && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted py-4">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
