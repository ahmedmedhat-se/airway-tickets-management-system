import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders, faPlane, faSortAmountDown } from '@fortawesome/free-solid-svg-icons';
import FlightCard from '../components/FlightCard';
import BookingModal from '../components/BookingModal';
import { getAllFlights } from '../api/flights';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  { val: 'All',       label: 'All',       dot: 'var(--text-3)' },
  { val: 'SCHEDULED', label: 'Scheduled', dot: '#1d4ed8'       },
  { val: 'DELAYED',   label: 'Delayed',   dot: '#92400e'       },
  { val: 'COMPLETED', label: 'Completed', dot: '#166534'       },
  { val: 'CANCELLED', label: 'Cancelled', dot: '#991b1b'       },
];
const SORTS = [
  { label:'Earliest Departure', val:'dep_asc'   },
  { label:'Latest Departure',   val:'dep_desc'  },
  { label:'Price: Low → High',  val:'price_asc' },
  { label:'Price: High → Low',  val:'price_desc'},
  { label:'Most Seats',         val:'seats'     },
];

export default function FlightsPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();

  const [flights, setFlights]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState(searchParams.get('from') || searchParams.get('to') || '');
  const [status, setStatus]       = useState('All');
  const [sort, setSort]           = useState('dep_asc');
  const [selected, setSelected]   = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getAllFlights()
      .then(setFlights)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Pre-fill destination from home page search
  useEffect(() => {
    const to = searchParams.get('to');
    const from = searchParams.get('from');
    if (to) setSearch(to);
    else if (from) setSearch(from);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...flights];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.flightNumber?.toLowerCase().includes(q) ||
        f.origin?.toLowerCase().includes(q) ||
        f.destination?.toLowerCase().includes(q)
      );
    }
    if (status !== 'All') list = list.filter(f => f.status === status);
    list.sort((a,b) => {
      if (sort==='dep_asc')   return new Date(a.departureTime)-new Date(b.departureTime);
      if (sort==='dep_desc')  return new Date(b.departureTime)-new Date(a.departureTime);
      if (sort==='price_asc') return (a.price??0)-(b.price??0);
      if (sort==='price_desc')return (b.price??0)-(a.price??0);
      if (sort==='seats')     return (b.availableSeats??0)-(a.availableSeats??0);
      return 0;
    });
    return list;
  }, [flights, search, status, sort]);

  const handleBook = (f) => {
    if (!user) { navigate('/login'); return; }
    setSelected(f);
  };

  const handleBookSuccess = (booking) => {
    setSelected(null);
    setSuccessMsg(`✅ Confirmed! Seat ${booking.seatNumber} on ${booking.flightNumber}.`);
    setFlights(fs => fs.map(f => f.id===booking.flightId ? {...f, availableSeats:(f.availableSeats??1)-1} : f));
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero hero-sm text-center">
        <div className="position-relative" style={{ zIndex:1 }}>
          <h1 className="hero-title text-white mb-2">Available Flights</h1>
          <p className="hero-sub text-white mx-auto" style={{ maxWidth:440 }}>
            Browse and book from our extensive network of destinations.
          </p>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-4 page-in">
        {successMsg && <div className="alert alert-success mb-3">{successMsg}</div>}
        {error && <div className="alert alert-danger mb-3">{error}</div>}

        {/* Filter bar */}
        <div className="filter-bar mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label" style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color:'var(--text-3)', fontSize:'.75rem' }} />
                Search
              </label>
              <input type="text" className="form-control" placeholder="Flight #, city or destination…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                <FontAwesomeIcon icon={faSliders} className="me-1" style={{ fontSize:'.75rem', color:'var(--text-3)' }} />
                Status
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {STATUSES.map(s => (
                  <button
                    key={s.val}
                    onClick={() => setStatus(s.val)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                      padding: '.3rem .8rem', borderRadius: 20, fontSize: '.8rem',
                      fontWeight: 500, border: 'none', cursor: 'pointer',
                      transition: 'all .15s',
                      background: status === s.val ? 'var(--primary)' : 'var(--surface-3)',
                      color: status === s.val ? '#fff' : 'var(--text-2)',
                      boxShadow: status === s.val ? '0 2px 8px rgba(37,99,235,.28)' : 'none',
                    }}
                  >
                    {s.val !== 'All' && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: status === s.val ? '#fff' : s.dot, flexShrink: 0 }} />
                    )}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">
                <FontAwesomeIcon icon={faSortAmountDown} className="me-1" style={{ fontSize:'.75rem', color:'var(--text-3)' }} />
                Sort by
              </label>
              <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p style={{ fontSize:'.8rem', color:'var(--text-3)', marginBottom:'1rem' }}>
            Showing <strong style={{ color:'var(--text-1)' }}>{filtered.length}</strong> of {flights.length} flights
          </p>
        )}

        {loading && <div className="loader"><div className="spin" /><span>Loading flights…</span></div>}

        {!loading && !error && filtered.length===0 && (
          <div className="empty">
            <div className="empty-icon"><FontAwesomeIcon icon={faPlane} /></div>
            <h5>No flights found</h5>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {filtered.map(f => (
              <div key={f.id} className="col">
                <FlightCard flight={f} onBook={handleBook} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <BookingModal flight={selected} onClose={() => setSelected(null)} onSuccess={handleBookSuccess} />
      )}
    </>
  );
}
