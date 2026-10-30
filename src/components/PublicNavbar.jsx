import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSettings } from '../utils/contentStore';
import SmartLogo from './SmartLogo';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about/', label: 'About Us' },
  { to: '/practice-areas/', label: 'Practice Areas' },
  { to: '/services/', label: 'Our Services' },
  { to: '/teams/', label: 'Our Teams' },
  { to: '/publications/', label: 'Publications' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const site = getSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const h = (site.brand && site.brand.header) || {};
    const base = Number(h.logoSize || (site.logoConfig && site.logoConfig.size) || 80);
    const sticky = Number(h.stickyLogoSize || 0);
    if (base >= 40 && base <= 140) {
      document.documentElement.style.setProperty('--logo-base', base + 'px');
    }
    if (sticky >= 36 && sticky <= 110) {
      document.documentElement.style.setProperty('--logo-size-sticky', sticky + 'px');
    }
  }, [site.brand, site.logoConfig]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const linkClass = (path) =>
    `relative text-sm font-sans no-underline transition-colors duration-300 py-1 ${location.pathname === path ? 'text-gold' : 'text-white/80 hover:text-gold'}`;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav className={`fixed top-0 left-0 w-full z-[10000] transition-all duration-300${scrolled ? ' bg-navy shadow-lg shadow-black/20' : ' bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-[var(--brand-sticky-h,66px)] lg:h-[var(--brand-sticky-h,72px)]' : 'h-[var(--brand-mobile-h,78px)] lg:h-[var(--brand-header-h,96px)]'}`}>
            <Link to="/" className={`pluto-brand flex items-center no-underline gap-3 sm:gap-4 transition-all duration-300 ${scrolled ? 'is-scrolled' : ''}`}>
              <SmartLogo size="var(--logo-size)" alt="Pluto Associates | Advocates and Legal Consultants" eager />
              <span className="flex flex-col justify-center leading-tight min-w-0">
                <span className={`font-serif text-white font-bold truncate transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl lg:text-2xl'}`}>{site.name}</span>
                <span className="hidden sm:block text-[0.62rem] lg:text-[0.68rem] text-white/55 font-medium tracking-[0.14em] uppercase mt-0.5">{site.tagline}</span>
              </span>
            </Link>

            <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass(item.to)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contact/"
                className="inline-flex items-center px-5 py-2.5 bg-gold text-navy text-sm font-semibold no-underline transition-all duration-300 hover:bg-navy hover:text-gold border-2 border-gold"
              >
                Get Consultation
              </Link>
            </div>

            <button
              className={`lg:hidden flex flex-col gap-[4px] bg-transparent border-none cursor-pointer p-2 z-[10002]${mobileOpen ? ' [&>span:nth-child(1)]:rotate-45 [&>span:nth-child(1)]:translate-y-[6px] [&>span:nth-child(2)]:opacity-0 [&>span:nth-child(3)]:-rotate-45 [&>span:nth-child(3)]:-translate-y-[6px]' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="w-6 h-[2px] bg-white transition-all duration-300 block"></span>
              <span className="w-6 h-[2px] bg-white transition-all duration-300 block"></span>
              <span className="w-6 h-[2px] bg-white transition-all duration-300 block"></span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`fixed top-0 -right-full w-[85%] max-w-[360px] h-screen bg-navy z-[10001] transition-all duration-500 flex flex-col${mobileOpen ? ' right-0' : ''}`} id="mobile-menu" aria-label="Mobile navigation">
        <button className="absolute top-4 right-4 bg-transparent border-none text-white text-2xl cursor-pointer p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
        <div className="pluto-brand flex items-center gap-3 p-6 border-b border-white/5">
          <SmartLogo size="var(--logo-size)" alt="Pluto Associates" />
          <span className="flex flex-col justify-center leading-tight">
            <span className="font-serif text-white text-base font-bold">{site.name}</span>
            <span className="text-[0.6rem] text-white/55 font-medium tracking-[0.14em] uppercase mt-0.5">{site.tagline}</span>
          </span>
        </div>
        <ul className="flex flex-col list-none m-0 p-4 pt-8 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block py-3 px-4 text-sm no-underline transition-colors duration-300 ${location.pathname === item.to ? 'text-gold' : 'text-text-light hover:text-gold'}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/contact/"
              className={`block py-3 px-4 text-sm no-underline transition-colors duration-300 ${location.pathname === '/contact/' ? 'text-gold' : 'text-text-light hover:text-gold'}`}
              onClick={() => setMobileOpen(false)}
            >
              Get Consultation
            </Link>
          </li>
        </ul>
        <div className="flex flex-col gap-3 p-6 border-t border-white/5 mt-auto">
          <a href="tel:+977-9802356987" className="text-text-light text-sm no-underline hover:text-gold transition-colors">📞 +977-9802356987</a>
          <a href="mailto:info@plutoassociates.com" className="text-text-light text-sm no-underline hover:text-gold transition-colors">✉️ info@plutoassociates.com</a>
        </div>
      </div>
    </>
  );
}
