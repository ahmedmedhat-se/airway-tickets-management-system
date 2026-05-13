import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container-fluid px-4 px-lg-5">
        <div className="row g-4 mb-4">
          {/* Brand col */}
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div style={{ width:30,height:30,background:'linear-gradient(135deg,#2563eb,#60a5fa)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.8rem' }}>
                <FontAwesomeIcon icon={faPlane} />
              </div>
              <span className="footer-brand">SkyLine</span>
            </div>
            <p style={{ fontSize:'.82rem', lineHeight:1.7, marginTop:'.75rem' }}>
              Making air travel simple, affordable, and effortless. Book your next adventure in seconds.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[faTwitter, faInstagram, faLinkedin].map((ic, i) => (
                <a key={i} href="#" className="footer-link" style={{ fontSize:'1rem' }}>
                  <FontAwesomeIcon icon={ic} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="col-6 col-md-2">
            <div style={{ color:'#fff', fontWeight:600, fontSize:'.82rem', marginBottom:'.75rem' }}>Navigate</div>
            {[['Home', '/'], ['Flights', '/flights'], ['My Trips', '/my-trips']].map(([l, to]) => (
              <div key={l} className="mb-2"><Link to={to} className="footer-link">{l}</Link></div>
            ))}
          </div>

          <div className="col-6 col-md-2">
            <div style={{ color:'#fff', fontWeight:600, fontSize:'.82rem', marginBottom:'.75rem' }}>Company</div>
            {['About Us', 'Careers', 'Blog', 'Press'].map(l => (
              <div key={l} className="mb-2"><a href="#" className="footer-link">{l}</a></div>
            ))}
          </div>

          <div className="col-md-4">
            <div style={{ color:'#fff', fontWeight:600, fontSize:'.82rem', marginBottom:'.75rem' }}>Contact</div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faEnvelope} style={{ width:14 }} />
              support@skyline.com
            </div>
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faPhone} style={{ width:14 }} />
              +1 (800) SKY-LINE
            </div>
          </div>
        </div>

        <hr className="footer-hr" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2" style={{ fontSize:'.78rem' }}>
          <span>© {new Date().getFullYear()} SkyLine. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
