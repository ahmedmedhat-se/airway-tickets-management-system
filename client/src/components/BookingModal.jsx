import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { bookFlight } from '../api/flights';

export default function BookingModal({ flight, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '', passportNumber: '', email: '', phone: '', seatNumber: '',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const booking = await bookFlight(flight.id, form);
      onSuccess(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="book-flight-header d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">
                <FontAwesomeIcon icon={faPlaneDeparture} className="me-2" />
                Book Flight {flight.flightNumber}
              </h5>
              <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                {flight.origin} → {flight.destination} · ${flight.price?.toFixed(2)}
              </div>
            </div>
            <button className="btn btn-sm" style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', borderRadius: 8 }} onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger mb-3">{error}</div>}
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="bk-fullName">Full Name</label>
                  <input id="bk-fullName" name="fullName" type="text" className="form-control"
                    placeholder="As on passport" value={form.fullName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="bk-passport">Passport Number</label>
                  <input id="bk-passport" name="passportNumber" type="text" className="form-control"
                    placeholder="A1234567" value={form.passportNumber} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="bk-seat">Seat Number</label>
                  <input id="bk-seat" name="seatNumber" type="text" className="form-control"
                    placeholder="e.g. 14A" value={form.seatNumber} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="bk-email">Email</label>
                  <input id="bk-email" name="email" type="email" className="form-control"
                    placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="bk-phone">Phone</label>
                  <input id="bk-phone" name="phone" type="tel" className="form-control"
                    placeholder="+1 555 000 0000" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="d-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" />
                    Confirming…
                  </span>
                ) : `Confirm Booking · $${flight.price?.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
