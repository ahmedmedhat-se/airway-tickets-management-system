import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket, faPlaneDeparture, faPlaneArrival,
  faTrash, faCircleCheck, faBan
} from '@fortawesome/free-solid-svg-icons';
import { getMyBookings, cancelBooking } from '../api/flights';

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = () => {
    setLoading(true);
    getMyBookings()
      .then(setBookings)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(bs => bs.filter(b => b.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="loader-wrap mt-5"><div className="spin-ring" /><span>Loading bookings…</span></div>;

  return (
    <div className="container-fluid px-3 px-md-4 py-4 page-enter">
      <h2 className="admin-page-title">
        <FontAwesomeIcon icon={faTicket} className="me-2" style={{ color: 'var(--primary)' }} />
        My Bookings
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FontAwesomeIcon icon={faTicket} /></div>
          <h5>No bookings yet</h5>
          <p>Browse flights and book your first seat!</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {bookings.map(b => (
            <div key={b.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {b.flight?.flightNumber ?? '—'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Booking #{b.id} · Seat {b.seatNumber}
                      </div>
                    </div>
                    <span className={`badge flight-status-badge ${b.bookingStatus === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
                      <FontAwesomeIcon icon={b.bookingStatus === 'CONFIRMED' ? faCircleCheck : faBan} className="me-1" />
                      {b.bookingStatus}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.flight?.origin ?? '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <FontAwesomeIcon icon={faPlaneDeparture} className="me-1" />
                        {formatTime(b.flight?.departureTime)}
                      </div>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <div className="text-end">
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{b.flight?.destination ?? '—'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        <FontAwesomeIcon icon={faPlaneArrival} className="me-1" />
                        {formatTime(b.flight?.arrivalTime)}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      ${b.flight?.price?.toFixed(2) ?? '—'}
                    </span>
                    {b.bookingStatus === 'CONFIRMED' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
