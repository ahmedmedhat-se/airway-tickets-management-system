import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlaneDeparture, faPlaneArrival, faCalendarDays, faArrowRight,
  faShield, faBolt, faHeadset, faPercent,
} from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const DESTINATIONS = [
  { city: 'Dubai',    country: 'UAE',       emoji: '🏙️', from: 299, bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { city: 'Paris',    country: 'France',    emoji: '🗼', from: 349, bg: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  { city: 'New York', country: 'USA',       emoji: '🗽', from: 499, bg: 'linear-gradient(135deg,#0f172a,#1e40af)' },
  { city: 'London',   country: 'UK',        emoji: '🎡', from: 279, bg: 'linear-gradient(135deg,#0d9488,#0891b2)' },
  { city: 'Tokyo',    country: 'Japan',     emoji: '⛩️', from: 699, bg: 'linear-gradient(135deg,#e11d48,#be185d)' },
  { city: 'Sydney',   country: 'Australia', emoji: '🦘', from: 799, bg: 'linear-gradient(135deg,#ea580c,#dc2626)' },
];

const FEATURES = [
  { icon: faShield,   color: '#2563eb', bg: '#eff6ff', title: 'Secure Booking',    desc: 'End-to-end encrypted transactions for your peace of mind.' },
  { icon: faBolt,     color: '#d97706', bg: '#fffbeb', title: 'Instant Confirm',   desc: 'Get your booking confirmed in seconds, not hours.' },
  { icon: faHeadset,  color: '#16a34a', bg: '#f0fdf4', title: '24/7 Support',      desc: 'Our team is always available to help you anytime.' },
  { icon: faPercent,  color: '#be185d', bg: '#fdf2f8', title: 'Best Prices',       desc: 'We guarantee the most competitive fares available.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [from, setFrom]   = useState('');
  const [to, setTo]       = useState('');
  const [date, setDate]   = useState('');
  const [trip, setTrip]   = useState('one-way');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to)   params.set('to', to);
    if (date) params.set('date', date);
    navigate(`/flights?${params.toString()}`);
  };

  const handleDestClick = (city) => {
    navigate(`/flights?to=${encodeURIComponent(city)}`);
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero hero-full position-relative">
        <div className="container-fluid px-4 px-lg-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center justify-content-center">
            <div className="col-12 text-center mb-5">
              <div className="page-in">
                <div style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', borderRadius:20, padding:'.3rem .9rem', fontSize:'.78rem', fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:'1.25rem', border:'1px solid rgba(255,255,255,.15)' }}>
                  ✈️ &nbsp;Your journey starts here
                </div>
                <h1 className="hero-title text-white">
                  Fly Anywhere,<br />
                  <span style={{ color:'#93c5fd' }}>Anytime.</span>
                </h1>
                <p className="hero-sub text-white mx-auto">
                  Discover amazing destinations and book your perfect flight — all in one beautifully simple platform.
                </p>
              </div>
            </div>

            {/* Search widget */}
            <div className="col-12 col-lg-9 col-xl-8">
              <div className="search-widget">
                {/* Tabs */}
                <div className="d-flex gap-1 mb-3">
                  {['one-way', 'round-trip'].map(t => (
                    <button key={t} className={`search-tab${trip === t ? ' active' : ''}`} onClick={() => setTrip(t)}>
                      {t === 'one-way' ? 'One Way' : 'Round Trip'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faPlaneDeparture} className="me-1" />From</label>
                        <input placeholder="Origin city" value={from} onChange={e => setFrom(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faPlaneArrival} className="me-1" />To</label>
                        <input placeholder="Destination city" value={to} onChange={e => setTo(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faCalendarDays} className="me-1" />Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button type="submit" className="btn btn-primary btn-lg w-100" style={{ borderRadius:'var(--r-md)' }}>
                        Search &nbsp;<FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:300, height:300, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
      </section>

      {/* ── DESTINATIONS ─────────────────────────────── */}
      <section className="section">
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-2">
            <span style={{ fontSize:'.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'var(--primary)' }}>Top Picks</span>
          </div>
          <h2 className="section-title text-center">Featured Destinations</h2>
          <p className="section-sub text-center mx-auto" style={{ maxWidth:500 }}>
            Handpicked destinations loved by millions of travelers every year.
          </p>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {DESTINATIONS.map(d => (
              <div key={d.city} className="col">
                <div className="dest-card" style={{ background: d.bg }} onClick={() => handleDestClick(d.city)}>
                  <div className="dest-card-overlay" />
                  <div className="dest-card-body">
                    <span className="dest-emoji">{d.emoji}</span>
                    <div className="dest-city">{d.city}</div>
                    <div className="dest-country">{d.country}</div>
                    <span className="dest-price">From ${d.from}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="text-center mb-2">
            <span style={{ fontSize:'.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'var(--primary)' }}>Why Us</span>
          </div>
          <h2 className="section-title text-center">Why Choose SkyLine?</h2>
          <p className="section-sub text-center mx-auto" style={{ maxWidth:480 }}>
            We put the passenger first — every feature, every policy.
          </p>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {FEATURES.map(f => (
              <div key={f.title} className="col">
                <div className="feature-card">
                  <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                    <FontAwesomeIcon icon={f.icon} />
                  </div>
                  <div style={{ fontWeight:700, marginBottom:'.4rem' }}>{f.title}</div>
                  <p style={{ fontSize:'.83rem', color:'var(--text-2)', margin:0, lineHeight:1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      {!user && (
        <section className="section" style={{ background: 'linear-gradient(135deg,#0f1f3d,#2563eb)', color:'#fff', textAlign:'center' }}>
          <div className="container-fluid px-4">
            <h2 style={{ fontSize:'clamp(1.5rem,3vw,2.5rem)', fontWeight:900, letterSpacing:'-.04em', marginBottom:'.75rem' }}>
              Ready to take off?
            </h2>
            <p style={{ opacity:.8, marginBottom:'2rem', maxWidth:440, margin:'0 auto 2rem' }}>
              Join SkyLine today and start discovering the world for less.
            </p>
            <a href="/register" className="btn btn-lg" style={{ background:'#fff', color:'var(--primary)', fontWeight:700, borderRadius:'var(--r-lg)' }}>
              Create Free Account
            </a>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
