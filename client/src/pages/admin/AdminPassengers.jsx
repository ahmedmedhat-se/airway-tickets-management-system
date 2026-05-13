import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { getAllBookings } from '../../api/flights';

export default function AdminPassengers() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Deduplicate passengers by passportNumber
  const uniquePassengers = Object.values(
    bookings.reduce((acc, b) => {
      const key = b.passportNumber ?? b.id;
      if (!acc[key]) {
        acc[key] = {
          id: b.id, fullName: b.fullName, email: b.email,
          phone: b.phone, passportNumber: b.passportNumber,
          bookedBy: b.bookedBy?.username ?? '—',
          bookingCount: 1,
        };
      } else {
        acc[key].bookingCount++;
      }
      return acc;
    }, {})
  );

  const filtered = uniquePassengers.filter(p => {
    const q = search.toLowerCase();
    return !q || p.fullName?.toLowerCase().includes(q)
      || p.email?.toLowerCase().includes(q)
      || p.passportNumber?.toLowerCase().includes(q);
  });

  if (loading) return <div className="loader-wrap"><div className="spin-ring" /><span>Loading…</span></div>;

  return (
    <div>
      <h2 className="admin-page-title">
        <FontAwesomeIcon icon={faUsers} className="me-2" style={{ color: 'var(--primary)' }} />
        Passengers ({uniquePassengers.length})
      </h2>

      <div className="mb-3" style={{ maxWidth: 320 }}>
        <input type="text" className="form-control" placeholder="Search name, email, passport…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="app-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Passenger</th><th>Passport</th><th>Phone</th><th>Account</th><th>Flights</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{p.email}</div>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.passportNumber}</td>
                <td style={{ fontSize: '0.85rem' }}>{p.phone}</td>
                <td style={{ fontSize: '0.82rem' }}>{p.bookedBy}</td>
                <td>
                  <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
                    {p.bookingCount}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted py-4">No passengers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
