import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getAllFlights, createFlight, updateFlight, deleteFlight } from '../../api/flights';

const BLANK = {
  flightNumber: '', origin: '', destination: '',
  departureTime: '', arrivalTime: '',
  totalSeats: '', price: '', status: 'SCHEDULED',
};

function FlightForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial ?? BLANK);
  const ch = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="mb-3" style={{ fontWeight: 600 }}>
          {initial ? 'Edit Flight' : 'Add New Flight'}
        </h6>
        <div className="row g-3">
          {[
            { name: 'flightNumber', label: 'Flight #',    type: 'text',            col: 'col-md-3' },
            { name: 'origin',       label: 'Origin',      type: 'text',            col: 'col-md-3' },
            { name: 'destination',  label: 'Destination', type: 'text',            col: 'col-md-3' },
            { name: 'status',       label: 'Status',      type: 'select',          col: 'col-md-3' },
            { name: 'departureTime',label: 'Departure',   type: 'datetime-local',  col: 'col-md-3' },
            { name: 'arrivalTime',  label: 'Arrival',     type: 'datetime-local',  col: 'col-md-3' },
            { name: 'totalSeats',   label: 'Total Seats', type: 'number',          col: 'col-md-3' },
            { name: 'price',        label: 'Price ($)',   type: 'number',          col: 'col-md-3' },
          ].map(f => (
            <div key={f.name} className={f.col}>
              <label className="form-label">{f.label}</label>
              {f.type === 'select' ? (
                <select name={f.name} className="form-select" value={form[f.name]} onChange={ch}>
                  {['SCHEDULED','DELAYED','CANCELLED','COMPLETED'].map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <input name={f.name} type={f.type} step={f.type === 'number' ? '0.01' : undefined}
                  className="form-control" value={form[f.name]} onChange={ch} />
              )}
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary btn-sm" disabled={loading} onClick={() => onSubmit(form)}>
            <FontAwesomeIcon icon={faCheck} className="me-1" />
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark} className="me-1" />Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function toFormValues(f) {
  const fmt = iso => iso ? iso.substring(0, 16) : '';
  return {
    flightNumber: f.flightNumber ?? '',
    origin: f.origin ?? '',
    destination: f.destination ?? '',
    departureTime: fmt(f.departureTime),
    arrivalTime: fmt(f.arrivalTime),
    totalSeats: f.totalSeats ?? '',
    price: f.price ?? '',
    status: f.status ?? 'SCHEDULED',
  };
}

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError]     = useState('');

  const load = () => {
    setLoading(true);
    getAllFlights().then(setFlights).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createFlight({ ...form, totalSeats: +form.totalSeats, price: +form.price });
      setShowAdd(false); load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateFlight(editing.id, { ...form, totalSeats: +form.totalSeats, price: +form.price });
      setEditing(null); load();
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this flight?')) return;
    await deleteFlight(id);
    load();
  };

  if (loading) return <div className="loader-wrap"><div className="spin-ring" /><span>Loading flights…</span></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="admin-page-title mb-0">Manage Flights</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowAdd(s => !s); setEditing(null); }}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add Flight
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAdd && !editing && (
        <FlightForm onSubmit={handleCreate} onCancel={() => setShowAdd(false)} loading={saving} />
      )}
      {editing && (
        <FlightForm initial={toFormValues(editing)} onSubmit={handleUpdate} onCancel={() => setEditing(null)} loading={saving} />
      )}

      <div className="app-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Flight #</th><th>Route</th><th>Departure</th><th>Arrival</th>
              <th>Seats</th><th>Price</th><th>Status</th><th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {flights.map(f => (
              <tr key={f.id}>
                <td><span style={{ fontWeight: 600 }}>{f.flightNumber}</span></td>
                <td>{f.origin} → {f.destination}</td>
                <td>{f.departureTime ? new Date(f.departureTime).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}</td>
                <td>{f.arrivalTime   ? new Date(f.arrivalTime).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}</td>
                <td>{f.availableSeats} / {f.totalSeats}</td>
                <td>${f.price?.toFixed(2)}</td>
                <td><span className={`badge flight-status-badge status-${f.status?.toLowerCase()}`}>{f.status}</span></td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(f); setShowAdd(false); }}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {flights.length === 0 && <tr><td colSpan={8} className="text-center text-muted py-4">No flights found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
