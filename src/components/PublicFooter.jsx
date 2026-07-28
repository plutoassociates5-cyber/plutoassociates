import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PublicFooter() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src={logo} alt="Pluto Associates" style={{ width: 42, height: 42, objectFit: 'contain', marginRight: '.75rem' }} />
              <div className="nav-logo-text">
                <span className="nav-logo-name">Pluto Associates</span>
                <span className="nav-logo-tagline">Advocates & Legal Consultants</span>
              </div>
            </Link>
            <p>Pluto Associates is a full-service law firm based in Kathmandu, Nepal, providing expert legal solutions across corporate law, FDI, litigation, intellectual property, and more.</p>
          </div>

          <div>
            <h4>Practice Areas</h4>
            <ul>
              <li><Link to="/practice-areas#fdi">FDI & Investment</Link></li>
              <li><Link to="/practice-areas#corporate">Corporate Law</Link></li>
              <li><Link to="/practice-areas#energy">Energy Law</Link></li>
              <li><Link to="/practice-areas#litigation">Litigation</Link></li>
              <li><Link to="/practice-areas#ip">Intellectual Property</Link></li>
            </ul>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/teams">Our Team</Link></li>
              <li><Link to="/publications">Publications</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="https://plutoassociates.com/admin" target="_blank" rel="noopener noreferrer">Admin</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+977-9802356987">📞 +977-9802356987</a></li>
              <li><a href="mailto:info@plutoassociates.com">✉️ info@plutoassociates.com</a></li>
              <li><span>📍 Kathmandu, Nepal</span></li>
              <li><span>🕐 Sun-Fri: 10AM - 6PM</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pluto Associates. All rights reserved.</span>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}