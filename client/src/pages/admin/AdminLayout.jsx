import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge, faPlaneDeparture, faTicket, faUsers, faBars, faXmark
} from '@fortawesome/free-solid-svg-icons';

const NAV = [
  { to: '/admin',           label: 'Dashboard', icon: faGauge,          end: true },
  { to: '/admin/flights',   label: 'Flights',   icon: faPlaneDeparture, end: false },
  { to: '/admin/bookings',  label: 'Bookings',  icon: faTicket,         end: false },
  { to: '/admin/passengers',label: 'Passengers',icon: faUsers,          end: false },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Mobile toggle */}
      <button
        className="btn btn-secondary btn-sm d-md-none"
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000, borderRadius: 50, width: 48, height: 48 }}
        onClick={() => setMobileOpen(o => !o)}
      >
        <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
      </button>

      {/* Sidebar */}
      <aside className="admin-sidebar" style={mobileOpen ? { display: 'block', position: 'fixed', zIndex: 1500, height: '100vh' } : {}}>
        <div className="admin-sidebar-title">Navigation</div>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <FontAwesomeIcon icon={n.icon} style={{ width: 16 }} />
            {n.label}
          </NavLink>
        ))}
      </aside>

      {/* Content */}
      <main className="admin-content page-enter">
        <Outlet />
      </main>
    </div>
  );
}
