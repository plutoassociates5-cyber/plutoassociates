import { Link } from 'react-router-dom';
import { getSettings } from '../utils/contentStore';

export default function PublicFooter() {
  const site = getSettings();

  return (
    <footer className="bg-navy text-text-light pt-16 lg:pt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center no-underline gap-3">
              <span className="grid place-items-center w-[48px] h-[48px] aspect-square rounded-full bg-white/10 ring-1 ring-white/10 backdrop-blur-sm shrink-0 overflow-hidden p-[3px]">
                <img src={site.logo} alt={site.name} loading="lazy" className="w-9 h-9 max-w-full max-h-full object-contain" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-white text-base font-semibold leading-tight">{site.name}</span>
                <span className="text-[0.6rem] text-text-light tracking-wider">{site.tagline}</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-light">{site.footerAbout}</p>
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
              {site.phone && <li><a href={`tel:${site.phone}`} className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">📞 {site.phone}</a></li>}
              {site.email && <li><a href={`mailto:${site.email}`} className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">✉️ {site.email}</a></li>}
              {site.address && <li><span className="text-text-light text-sm">📍 {site.address}</span></li>}
              {site.hours && <li><span className="text-text-light text-sm">🕐 {site.hours}</span></li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>{site.copyright.replace('{year}', new Date().getFullYear())}</span>
          <div className="flex gap-6">
            {site.social?.facebook && <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Facebook</a>}
            {site.social?.linkedin && <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">LinkedIn</a>}
            {site.social?.twitter && <a href={site.social.twitter} target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Twitter</a>}
            {site.social?.instagram && <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-text-light text-sm no-underline transition-colors duration-300 hover:text-gold">Instagram</a>}
          </div>
        </div>
      </div>
    </footer>
  );
}