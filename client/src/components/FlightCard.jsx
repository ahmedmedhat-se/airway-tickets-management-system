import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlaneDeparture, faClock, faChair,
  faBan, faCircleCheck, faHourglass, faPlane,
} from '@fortawesome/free-solid-svg-icons';

const STATUS = {
  SCHEDULED: { cls: 's-scheduled', icon: faCircleCheck, label: 'Scheduled' },
  DELAYED:   { cls: 's-delayed',   icon: faHourglass,   label: 'Delayed'   },
  CANCELLED: { cls: 's-cancelled', icon: faBan,         label: 'Cancelled' },
  COMPLETED: { cls: 's-completed', icon: faCircleCheck, label: 'Completed' },
};

const fmt = (iso) =>
  !iso ? '—' : new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const dur = (a, b) => {
  if (!a || !b) return '—';
  const m = Math.round((new Date(b) - new Date(a)) / 60000);
  if (m <= 0) return '—';
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

export default function FlightCard({ flight, onBook }) {
  const st        = STATUS[flight.status] ?? STATUS.SCHEDULED;
  const full      = !flight.availableSeats || flight.availableSeats <= 0;
  const cancelled = flight.status === 'CANCELLED';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 18,
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'box-shadow .22s ease, transform .22s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* ── Top gradient bar ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        padding: '0.75rem 1.1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '.88rem', letterSpacing: '.04em' }}>
          <FontAwesomeIcon icon={faPlaneDeparture} style={{ marginRight: '.5rem' }} />
          {flight.flightNumber}
        </span>
        <span style={{
          fontSize: '.72rem', fontWeight: 700, padding: '.22em .65em',
          borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em',
        }} className={st.cls}>
          <FontAwesomeIcon icon={st.icon} style={{ marginRight: '.3rem' }} />
          {st.label}
        </span>
      </div>

      {/* ── Route row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '1rem 1.1rem 0',
      }}>
        {/* Origin */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
            {flight.origin}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--text-3)', marginTop: '.15rem', whiteSpace: 'nowrap' }}>
            {fmt(flight.departureTime)}
          </div>
        </div>

        {/* Arrow line */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '.3rem', color: 'var(--text-3)', minWidth: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <FontAwesomeIcon icon={faPlane} style={{ fontSize: '.85rem', color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Destination */}
        <div style={{ minWidth: 0, textAlign: 'right' }}>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
            {flight.destination}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--text-3)', marginTop: '.15rem', whiteSpace: 'nowrap' }}>
            {fmt(flight.arrivalTime)}
          </div>
        </div>
      </div>

      {/* ── Info chips ── */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', padding: '.75rem 1.1rem 0' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', background: 'var(--surface-3)', borderRadius: 20, padding: '.2rem .65rem', fontSize: '.74rem', color: 'var(--text-2)', fontWeight: 500 }}>
          <FontAwesomeIcon icon={faClock} style={{ color: 'var(--primary)', fontSize: '.65rem' }} />
          {dur(flight.departureTime, flight.arrivalTime)}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', background: 'var(--surface-3)', borderRadius: 20, padding: '.2rem .65rem', fontSize: '.74rem', fontWeight: 500, color: full ? 'var(--danger)' : 'var(--text-2)' }}>
          <FontAwesomeIcon icon={faChair} style={{ color: full ? 'var(--danger)' : '#16a34a', fontSize: '.65rem' }} />
          {full ? 'No seats' : `${flight.availableSeats} / ${flight.totalSeats} seats`}
        </span>
      </div>

      {/* ── Price + CTA ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '.9rem 1.1rem 1.1rem', marginTop: 'auto',
      }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-.04em', color: 'var(--primary)', lineHeight: 1 }}>
            ${flight.price?.toFixed(2) ?? '—'}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--text-3)', marginTop: '.1rem' }}>per person</div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          style={{ borderRadius: 10, paddingLeft: '1rem', paddingRight: '1rem' }}
          onClick={() => onBook(flight)}
          disabled={cancelled || full}
        >
          {cancelled ? 'Cancelled' : full ? 'Full' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}
