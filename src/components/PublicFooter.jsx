import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-text-light pt-16 lg:pt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center no-underline gap-3">
              <img src={logo} alt="Pluto Associates" loading="lazy" className="w-[42px] h-[42px] object-contain" />
              <div className="flex flex-col">
                <span className="font-serif text-white text-base font-semibold leading-tight">Pluto Associates</span>
                <span className="text-[0.6rem] text-text-light tracking-wider">Advocates & Legal Consultants</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-light">Pluto Associates is a full-service law firm based in Kathmandu, Nepal, providing expert legal solutions across corporate law, FDI, litigation, intellectual property, and more.</p>
          </div>

          <div>
            <h4 className="font-serif text-white text-lg mb-6 font-semibold">Practice Areas</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><Link to="/practice-areas#fdi" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">FDI & Investment</Link></li>
              <li><Link to="/practice-areas#corporate" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Corporate Law</Link></li>
              <li><Link to="/practice-areas#energy" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Energy Law</Link></li>
              <li><Link to="/practice-areas#litigation" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Litigation</Link></li>
              <li><Link to="/practice-areas#ip" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Intellectual Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-lg mb-6 font-semibold">Quick Links</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><Link to="/about" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">About Us</Link></li>
              <li><Link to="/teams" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Our Team</Link></li>
              <li><Link to="/publications" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Publications</Link></li>
              <li><Link to="/contact" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-lg mb-6 font-semibold">Contact</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li><a href="tel:+977-9802356987" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">📞 +977-9802356987</a></li>
              <li><a href="mailto:info@plutoassociates.com" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">✉️ info@plutoassociates.com</a></li>
              <li><span className="text-text-light text-sm">📍 Kathmandu, Nepal</span></li>
              <li><span className="text-text-light text-sm">🕐 Sun-Fri: 10AM - 6PM</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>© {new Date().getFullYear()} Pluto Associates. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
