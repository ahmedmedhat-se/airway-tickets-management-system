import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket, faPlaneDeparture, faPlaneArrival,
  faTrash, faCircleCheck, faBan, faPlane
} from '@fortawesome/free-solid-svg-icons';
import { getMyBookings, cancelBooking } from '../api/flights';

const fmt = (iso) => !iso ? '—' : new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });

export default function MyTripsPage() {
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
  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try { await cancelBooking(id); load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <>
      {/* Header */}
      <section className="hero hero-sm text-center">
        <div className="position-relative" style={{ zIndex:1 }}>
          <h1 className="hero-title text-white mb-2">
            <FontAwesomeIcon icon={faTicket} className="me-2" />
            My Trips
          </h1>
          <p className="hero-sub text-white mx-auto" style={{ maxWidth:400 }}>
            All your booked flights in one place.
          </p>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-4 page-in">
        {error && <div className="alert alert-danger">{error}</div>}

        {loading && <div className="loader"><div className="spin" /><span>Loading your trips…</span></div>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty">
            <div className="empty-icon"><FontAwesomeIcon icon={faPlane} /></div>
            <h5>No trips yet</h5>
            <p>Book your first flight from the <a href="/flights" style={{ color:'var(--primary)' }}>Flights page</a>.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <>
            <p style={{ fontSize:'.82rem', color:'var(--text-3)', marginBottom:'1.25rem' }}>
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
            <div className="d-flex flex-column gap-3">
              {bookings.map(b => (
                <div key={b.id} className="card" style={{ border:'1px solid var(--border)' }}>
                  <div className="card-body p-0">
                    {/* Top bar */}
                    <div style={{ background:'linear-gradient(135deg,var(--primary),#3b82f6)', padding:'.8rem 1.25rem', borderRadius:'var(--r-lg) var(--r-lg) 0 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ color:'#fff' }}>
                        <span style={{ fontWeight:700, fontSize:'.95rem', letterSpacing:'.04em' }}>
                          {b.flight?.flightNumber ?? 'N/A'}
                        </span>
                        <span style={{ opacity:.75, fontSize:'.8rem', marginLeft:'1rem' }}>Booking #{b.id}</span>
                      </div>
                      <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '.3rem',
                          fontSize: '.75rem', fontWeight: 700, padding: '.28em .7em',
                          borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em',
                          background: b.bookingStatus === 'CONFIRMED' ? '#dcfce7' : '#fee2e2',
                          color:      b.bookingStatus === 'CONFIRMED' ? '#166534' : '#991b1b',
                        }}>
                        <FontAwesomeIcon icon={b.bookingStatus === 'CONFIRMED' ? faCircleCheck : faBan} />
                        {b.bookingStatus}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <div className="row align-items-center g-3">
                        {/* Route */}
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-3">
                            <div>
                              <div style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.04em', lineHeight:1 }}>{b.flight?.origin ?? '—'}</div>
                              <div style={{ fontSize:'.72rem', color:'var(--text-3)', marginTop:'.2rem' }}>
                                <FontAwesomeIcon icon={faPlaneDeparture} className="me-1" />{fmt(b.flight?.departureTime)}
                              </div>
                            </div>
                            <div style={{ flex:1, display:'flex', alignItems:'center', gap:'.4rem', color:'var(--text-3)' }}>
                              <div style={{ flex:1, height:1, background:'var(--border)' }} />
                              <FontAwesomeIcon icon={faPlane} style={{ fontSize:'.85rem', color:'var(--primary)' }} />
                              <div style={{ flex:1, height:1, background:'var(--border)' }} />
                            </div>
                            <div className="text-end">
                              <div style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-.04em', lineHeight:1 }}>{b.flight?.destination ?? '—'}</div>
                              <div style={{ fontSize:'.72rem', color:'var(--text-3)', marginTop:'.2rem' }}>
                                <FontAwesomeIcon icon={faPlaneArrival} className="me-1" />{fmt(b.flight?.arrivalTime)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="col-md-4">
                          <div className="row g-2">
                            {[
                              { label:'Passenger', val: b.fullName },
                              { label:'Seat',      val: b.seatNumber },
                              { label:'Price',     val: b.flight?.price ? `$${b.flight.price.toFixed(2)}` : '—' },
                              { label:'Passport',  val: b.passportNumber },
                            ].map(({ label, val }) => (
                              <div key={label} className="col-6">
                                <div style={{ fontSize:'.7rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--text-3)' }}>{label}</div>
                                <div style={{ fontSize:'.88rem', fontWeight:600, color:'var(--text-1)' }}>{val}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cancel */}
                        <div className="col-md-2 text-md-end">
                          {b.bookingStatus === 'CONFIRMED' && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                              <FontAwesomeIcon icon={faTrash} className="me-1" />Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
