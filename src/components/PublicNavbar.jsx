import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/teams', label: 'Our Teams' },
  { to: '/publications', label: 'Publications' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-bar">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              <img src={logo} alt="Pluto Associates" />
              <div className="nav-logo-text">
                <span className="nav-logo-name">Pluto Associates</span>
                <span className="nav-logo-tagline">Advocates & Legal Consultants</span>
              </div>
            </Link>

            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.to} className={location.pathname === item.to ? 'active' : ''}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>

            <div className="nav-cta">
              <Link to="/contact">Get Consultation</Link>
            </div>

            <button
              className={`mobile-toggle${mobileOpen ? ' active' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-overlay${mobileOpen ? ' active' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu${mobileOpen ? ' active' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
        <div className="mob-logo" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <img src={logo} alt="Pluto Associates" style={{ width: 35, height: 35, objectFit: 'contain', marginRight: '.6rem' }} />
          <span style={{ fontFamily: 'var(--serif)', color: '#fff', fontSize: '1rem', fontWeight: 700 }}>Pluto Associates</span>
        </div>
        <ul className="mob-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={location.pathname === item.to ? 'current' : ''}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'current' : ''} onClick={() => setMobileOpen(false)}>
              Get Consultation
            </Link>
          </li>
        </ul>
        <div className="mob-contact">
          <a href="tel:+977-9802356987">📞 +977-9802356987</a>
          <a href="mailto:info@plutoassociates.com">✉️ info@plutoassociates.com</a>
        </div>
      </div>
    </>
  );
}