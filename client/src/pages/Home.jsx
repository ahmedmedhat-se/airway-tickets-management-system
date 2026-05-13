import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './Home.css';

const Home = () => {
  const [origin, setOrigin] = [useState(''), useState('')][0];
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const _setOrigin = origin[1];
  const originVal = origin[0];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/flights?origin=${originVal}&destination=${destination}&date=${date}`);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover the world with <span className="text-gradient">AeroSpace</span></h1>
          <p className="hero-subtitle">Experience premium flights with unmatched comfort and style. Your journey begins here.</p>
          
          <div className="search-widget glass-panel">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <div className="input-wrapper">
                  <label className="input-label">From</label>
                  <input 
                    type="text" 
                    placeholder="Origin City" 
                    value={originVal} 
                    onChange={(e) => _setOrigin(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="search-divider"></div>
              
              <div className="search-input-group">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                <div className="input-wrapper">
                  <label className="input-label">To</label>
                  <input 
                    type="text" 
                    placeholder="Destination City" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="search-divider"></div>
              
              <div className="search-input-group">
                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
                <div className="input-wrapper">
                  <label className="input-label">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" className="btn-primary search-btn">
                <FontAwesomeIcon icon={faSearch} /> Search
              </button>
            </form>
          </div>
        </div>
        
        <div className="hero-decorations">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </div>
      
      <div className="features-section page-container">
        <h2 className="section-title">Why fly with us?</h2>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon">✨</div>
            <h3>Premium Experience</h3>
            <p>Enjoy luxury seating, gourmet dining, and top-tier entertainment on every flight.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🛡️</div>
            <h3>Safe & Secure</h3>
            <p>Your safety is our priority. We maintain the highest standards of security and hygiene.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">⚡</div>
            <h3>Fast Booking</h3>
            <p>Book your flights in seconds with our seamless and intuitive booking system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
