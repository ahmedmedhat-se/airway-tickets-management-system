import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faUser, faRightFromBracket, faGauge, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className={`glass-nav px-4 d-flex align-items-center justify-content-between${scrolled ? ' scrolled' : ''}`}>
      {/* Brand */}
      <Link className="brand" to="/">
        <div className="brand-icon">
          <FontAwesomeIcon icon={faPlane} style={{ fontSize: '.85rem' }} />
        </div>
        SkyLine
      </Link>

      {/* Center links */}
      <div className="d-flex align-items-center gap-1">
        <NavLink to="/" end className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}>Home</NavLink>
        <NavLink to="/flights" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}>Flights</NavLink>
        {user && (
          <NavLink to="/my-trips" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}>My Trips</NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}>
            <FontAwesomeIcon icon={faGauge} className="me-1" size="xs" />Admin
          </NavLink>
        )}
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center gap-2">
        {user ? (
          <div className="dropdown">
            <button className="btn btn-secondary btn-sm d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,var(--primary),#60a5fa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'.7rem', fontWeight:700 }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize:'.85rem', fontWeight:500 }}>{user.username}</span>
              <FontAwesomeIcon icon={faChevronDown} size="xs" style={{ color:'var(--text-3)' }} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><span className="dropdown-item-text" style={{ fontSize:'.75rem', color:'var(--text-3)', padding:'.4rem .9rem' }}>{user.email}</span></li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faRightFromBracket} size="sm" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
