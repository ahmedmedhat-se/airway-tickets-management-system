import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge, faPlaneDeparture, faTicket, faUsers,
  faPlus, faPen, faTrash, faXmark, faCheck,
  faPlane, faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getAllFlights, createFlight, updateFlight, deleteFlight, getAllBookings, cancelBooking } from '../api/flights';

// ── helpers ─────────────────────────────────────────────────
const fmt = (iso) => !iso ? '—' : new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
const COLORS = ['#2563eb','#d97706','#dc2626','#16a34a','#8b5cf6'];
const STATUS_CLS = { SCHEDULED:'s-scheduled', DELAYED:'s-delayed', CANCELLED:'s-cancelled', COMPLETED:'s-completed', CONFIRMED:'s-confirmed' };

// ── KPI Card ────────────────────────────────────────────────
function KpiCard({ icon, value, label, sub, color='var(--primary)' }) {
  return (
    <div className="kpi-card">
      <div className="d-flex align-items-start gap-3">
        <div style={{ width:44,height:44,borderRadius:12,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',color,flexShrink:0 }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <div className="kpi-val">{value ?? '—'}</div>
          <div className="kpi-label">{label}</div>
          {sub && <div style={{ fontSize:'.72rem', color:'var(--text-3)', marginTop:'.15rem' }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Flight Form ──────────────────────────────────────────────
const BLANK = { flightNumber:'', origin:'', destination:'', departureTime:'', arrivalTime:'', totalSeats:'', price:'', status:'SCHEDULED' };
const toForm = (f) => ({
  flightNumber: f.flightNumber??'',
  origin: f.origin??'',
  destination: f.destination??'',
  departureTime: f.departureTime?.substring(0,16)??'',
  arrivalTime: f.arrivalTime?.substring(0,16)??'',
  totalSeats: f.totalSeats??'',
  price: f.price??'',
  status: f.status??'SCHEDULED',
});

function FlightForm({ initial, onSave, onCancel, saving }) {
  const [f, setF] = useState(initial ?? BLANK);
  const ch = (e) => setF(p => ({ ...p, [e.target.name]: e.target.value }));
  const fields = [
    { name:'flightNumber', label:'Flight #',   type:'text',          col:'col-md-3' },
    { name:'origin',       label:'Origin',     type:'text',          col:'col-md-3' },
    { name:'destination',  label:'Destination',type:'text',          col:'col-md-3' },
    { name:'status',       label:'Status',     type:'select',        col:'col-md-3' },
    { name:'departureTime',label:'Departure',  type:'datetime-local',col:'col-md-3' },
    { name:'arrivalTime',  label:'Arrival',    type:'datetime-local',col:'col-md-3' },
    { name:'totalSeats',   label:'Total Seats',type:'number',        col:'col-md-3' },
    { name:'price',        label:'Price ($)',  type:'number',        col:'col-md-3' },
  ];
  return (
    <div className="card mb-4" style={{ border:'1.5px solid var(--primary-100)' }}>
      <div className="card-body p-3">
        <h6 style={{ fontWeight:700, marginBottom:'1rem' }}>{initial ? 'Edit Flight' : 'New Flight'}</h6>
        <div className="row g-3">
          {fields.map(fld => (
            <div key={fld.name} className={fld.col}>
              <label className="form-label">{fld.label}</label>
              {fld.type==='select'
                ? <select name={fld.name} className="form-select" value={f[fld.name]} onChange={ch}>
                    {['SCHEDULED','DELAYED','CANCELLED','COMPLETED'].map(s => <option key={s}>{s}</option>)}
                  </select>
                : <input name={fld.name} type={fld.type} className="form-control" step={fld.type==='number'?'.01':undefined} value={f[fld.name]} onChange={ch} />
              }
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => onSave(f)}>
            <FontAwesomeIcon icon={faCheck} className="me-1" />{saving?'Saving…':'Save'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark} className="me-1" />Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────
const TABS = [
  { id:'overview',    icon:faGauge,         label:'Overview'   },
  { id:'flights',     icon:faPlaneDeparture,label:'Flights'    },
  { id:'bookings',    icon:faTicket,        label:'Bookings'   },
  { id:'passengers',  icon:faUsers,         label:'Passengers' },
];

// ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]         = useState('overview');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingF, setLoadingF] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch]   = useState('');
  const [errF, setErrF]       = useState('');

  const loadFlights = () => {
    setLoadingF(true);
    getAllFlights().then(setFlights).catch(e=>setErrF(e.message)).finally(()=>setLoadingF(false));
  };
  const loadBookings = () => {
    setLoadingB(true);
    getAllBookings().then(setBookings).catch(console.error).finally(()=>setLoadingB(false));
  };
  useEffect(() => { loadFlights(); loadBookings(); }, []);

  // ── Charts data ──────────────────────────────────────────
  const statusData = useMemo(() => {
    const m = {};
    flights.forEach(f => { m[f.status] = (m[f.status]||0)+1; });
    return Object.entries(m).map(([name,value]) => ({ name, value }));
  }, [flights]);

  const routeData = useMemo(() => {
    const m = {};
    bookings.forEach(b => {
      if (!b.flight) return;
      const k = `${b.flight.origin}→${b.flight.destination}`;
      m[k] = (m[k]||0)+1;
    });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,6)
      .map(([route,count]) => ({ route: route.length>14?route.slice(0,13)+'…':route, count }));
  }, [bookings]);

  const revenue  = bookings.reduce((s,b) => s+(b.flight?.price??0), 0);
  const uniquePassengers = new Set(bookings.map(b=>b.passportNumber)).size;
  const confirmed = bookings.filter(b=>b.bookingStatus==='CONFIRMED').length;

  // ── CRUD ─────────────────────────────────────────────────
  const handleCreate = async (form) => {
    setSaving(true);
    try { await createFlight({...form,totalSeats:+form.totalSeats,price:+form.price}); setShowAdd(false); loadFlights(); }
    catch(e){ alert(e.message); } finally{ setSaving(false); }
  };
  const handleUpdate = async (form) => {
    setSaving(true);
    try { await updateFlight(editing.id,{...form,totalSeats:+form.totalSeats,price:+form.price}); setEditing(null); loadFlights(); }
    catch(e){ alert(e.message); } finally{ setSaving(false); }
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete flight?')) return;
    await deleteFlight(id); loadFlights();
  };
  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel booking?')) return;
    try { await cancelBooking(id); loadBookings(); } catch(e){ alert(e.message); }
  };

  // ── Passengers derived ───────────────────────────────────
  const passengers = useMemo(() => {
    const m = {};
    bookings.forEach(b => {
      const k = b.passportNumber??b.id;
      if (!m[k]) m[k] = { id:b.id, fullName:b.fullName, email:b.email, phone:b.phone, passportNumber:b.passportNumber, count:0 };
      m[k].count++;
    });
    return Object.values(m);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (!search.trim()) return bookings;
    const q = search.toLowerCase();
    return bookings.filter(b =>
      b.fullName?.toLowerCase().includes(q) ||
      b.flight?.flightNumber?.toLowerCase().includes(q) ||
      b.seatNumber?.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const filteredPassengers = useMemo(() => {
    if (!search.trim()) return passengers;
    const q = search.toLowerCase();
    return passengers.filter(p => p.fullName?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q));
  }, [passengers, search]);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="admin-wrap">
      {/* Sidebar */}
      <aside className="admin-side">
        <div className="side-label">Management</div>
        {TABS.map(t => (
          <button key={t.id} className={`side-link${tab===t.id?' active':''}`} onClick={() => { setTab(t.id); setSearch(''); setShowAdd(false); setEditing(null); }}>
            <FontAwesomeIcon icon={t.icon} style={{ width:16 }} />
            {t.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="admin-main page-in" key={tab}>

        {/* ── OVERVIEW ─────────────────────────────────── */}
        {tab==='overview' && (
          <>
            <h2 className="page-heading">Dashboard Overview</h2>

            {/* KPIs */}
            <div className="row row-cols-2 row-cols-xl-4 g-3 mb-4">
              <div className="col"><KpiCard icon={faPlaneDeparture} value={flights.length}   label="Total Flights"   color="#2563eb" /></div>
              <div className="col"><KpiCard icon={faTicket}         value={confirmed}          label="Active Bookings" color="#d97706" /></div>
              <div className="col"><KpiCard icon={faUsers}          value={uniquePassengers}   label="Passengers"      color="#8b5cf6" /></div>
              <div className="col"><KpiCard icon={faDollarSign}     value={`$${revenue.toFixed(0)}`} label="Total Revenue" color="#16a34a" /></div>
            </div>

            {/* Charts */}
            <div className="row g-4 mb-4">
              {/* Bar — top routes */}
              <div className="col-lg-7">
                <div className="card p-3">
                  <div style={{ fontWeight:700, marginBottom:'1rem', fontSize:'.9rem' }}>Top Booked Routes</div>
                  {loadingB ? <div className="loader" style={{ padding:'2rem' }}><div className="spin" /></div>
                    : routeData.length===0 ? <div className="empty" style={{ padding:'2rem' }}><p>No bookings yet</p></div>
                    : (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={routeData} margin={{ top:0,right:0,left:-20,bottom:0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="route" tick={{ fontSize:11, fill:'#94a3b8' }} />
                        <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ borderRadius:10,border:'1px solid #e2e8f0',fontSize:12 }} />
                        <Bar dataKey="count" fill="#2563eb" radius={[6,6,0,0]} name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie — flight status */}
              <div className="col-lg-5">
                <div className="card p-3">
                  <div style={{ fontWeight:700, marginBottom:'1rem', fontSize:'.9rem' }}>Flight Status</div>
                  {loadingF ? <div className="loader" style={{ padding:'2rem' }}><div className="spin" /></div>
                    : statusData.length===0 ? <div className="empty" style={{ padding:'2rem' }}><p>No flights</p></div>
                    : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          paddingAngle={3} dataKey="value" nameKey="name" label={({ name,percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} style={{ fontSize:11 }}>
                          {statusData.map((e,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius:10,border:'1px solid #e2e8f0',fontSize:12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Recent bookings */}
            <div style={{ fontWeight:700, marginBottom:'.75rem', fontSize:'.9rem' }}>Recent Bookings</div>
            <div className="app-table">
              <table className="table table-hover mb-0">
                <thead><tr><th>#</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Seat</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.slice(0,6).map(b => (
                    <tr key={b.id}>
                      <td style={{ color:'var(--text-3)' }}>{b.id}</td>
                      <td><div style={{ fontWeight:500 }}>{b.fullName}</div><div style={{ fontSize:'.72rem', color:'var(--text-3)' }}>{b.email}</div></td>
                      <td><span style={{ fontWeight:600 }}>{b.flight?.flightNumber??'—'}</span></td>
                      <td>{b.flight?.origin}→{b.flight?.destination}</td>
                      <td>{b.seatNumber}</td>
                      <td><span className={`badge ${STATUS_CLS[b.bookingStatus]??''}`}>{b.bookingStatus}</span></td>
                    </tr>
                  ))}
                  {bookings.length===0 && <tr><td colSpan={6} className="text-center text-muted py-4">No bookings yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── FLIGHTS ──────────────────────────────────── */}
        {tab==='flights' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="page-heading mb-0">Manage Flights</h2>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowAdd(s=>!s); setEditing(null); }}>
                <FontAwesomeIcon icon={faPlus} className="me-1" />Add Flight
              </button>
            </div>

            {errF && <div className="alert alert-danger">{errF}</div>}
            {showAdd && !editing && <FlightForm onSave={handleCreate} onCancel={() => setShowAdd(false)} saving={saving} />}
            {editing && <FlightForm initial={toForm(editing)} onSave={handleUpdate} onCancel={() => setEditing(null)} saving={saving} />}

            {loadingF ? <div className="loader"><div className="spin" /></div> : (
              <div className="app-table">
                <table className="table table-hover mb-0">
                  <thead><tr><th>Flight #</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Seats</th><th>Price</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {flights.map(f => (
                      <tr key={f.id}>
                        <td><span style={{ fontWeight:600 }}>{f.flightNumber}</span></td>
                        <td>{f.origin}→{f.destination}</td>
                        <td style={{ fontSize:'.8rem' }}>{fmt(f.departureTime)}</td>
                        <td style={{ fontSize:'.8rem' }}>{fmt(f.arrivalTime)}</td>
                        <td>{f.availableSeats}/{f.totalSeats}</td>
                        <td>${f.price?.toFixed(2)}</td>
                        <td><span className={`badge ${STATUS_CLS[f.status]??''}`}>{f.status}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(f); setShowAdd(false); }}><FontAwesomeIcon icon={faPen} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}><FontAwesomeIcon icon={faTrash} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {flights.length===0 && <tr><td colSpan={8} className="text-center text-muted py-4">No flights</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── BOOKINGS ─────────────────────────────────── */}
        {tab==='bookings' && (
          <>
            <h2 className="page-heading">All Bookings</h2>
            <div className="mb-3" style={{ maxWidth:320 }}>
              <input className="form-control" placeholder="Search passenger, flight, seat…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            {loadingB ? <div className="loader"><div className="spin" /></div> : (
              <div className="app-table">
                <table className="table table-hover mb-0">
                  <thead><tr><th>#</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Seat</th><th>Booked By</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id}>
                        <td style={{ color:'var(--text-3)' }}>{b.id}</td>
                        <td><div style={{ fontWeight:500 }}>{b.fullName}</div><div style={{ fontSize:'.72rem', color:'var(--text-3)' }}>{b.email}</div></td>
                        <td><span style={{ fontWeight:600 }}>{b.flight?.flightNumber??'—'}</span></td>
                        <td style={{ fontSize:'.82rem' }}>{b.flight?.origin}→{b.flight?.destination}</td>
                        <td>{b.seatNumber}</td>
                        <td style={{ fontSize:'.8rem' }}>{b.bookedBy?.username??'—'}</td>
                        <td><span className={`badge ${STATUS_CLS[b.bookingStatus]??''}`}>{b.bookingStatus}</span></td>
                        <td>
                          {b.bookingStatus==='CONFIRMED' && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancelBooking(b.id)}><FontAwesomeIcon icon={faTrash} /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length===0 && <tr><td colSpan={8} className="text-center text-muted py-4">No bookings</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── PASSENGERS ───────────────────────────────── */}
        {tab==='passengers' && (
          <>
            <h2 className="page-heading">Passengers ({passengers.length})</h2>
            <div className="mb-3" style={{ maxWidth:320 }}>
              <input className="form-control" placeholder="Search name or email…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            {loadingB ? <div className="loader"><div className="spin" /></div> : (
              <div className="app-table">
                <table className="table table-hover mb-0">
                  <thead><tr><th>Name</th><th>Email</th><th>Passport</th><th>Phone</th><th>Flights</th></tr></thead>
                  <tbody>
                    {filteredPassengers.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight:500 }}>{p.fullName}</td>
                        <td style={{ fontSize:'.82rem' }}>{p.email}</td>
                        <td style={{ fontFamily:'monospace', fontSize:'.82rem' }}>{p.passportNumber}</td>
                        <td style={{ fontSize:'.82rem' }}>{p.phone}</td>
                        <td><span className="badge" style={{ background:'var(--primary-light)', color:'var(--primary)', fontWeight:600 }}>{p.count}</span></td>
                      </tr>
                    ))}
                    {filteredPassengers.length===0 && <tr><td colSpan={5} className="text-center text-muted py-4">No passengers</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
