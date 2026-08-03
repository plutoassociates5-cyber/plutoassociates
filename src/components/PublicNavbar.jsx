import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getSettings } from '../utils/contentStore';
import { getServiceGroups } from '../services/store';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/services', label: 'Our Services' },
  { to: '/teams', label: 'Our Teams' },
  { to: '/publications', label: 'Publications' },
  { to: '/faq', label: 'FAQs' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const location = useLocation();
  const site = getSettings();
  const logoSrc = site?.logo || logo;
  const groups = getServiceGroups();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServices(false);
  }, [location]);

  const linkClass = (path) =>
    `relative text-sm font-sans no-underline transition-colors duration-300 py-1 ${location.pathname === path ? 'text-gold' : 'text-white/80 hover:text-gold'}`;

  const isServicesPath = location.pathname === '/services' || location.pathname.startsWith('/services/');

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <nav className={`fixed top-0 left-0 w-full z-[10000] transition-all duration-300${scrolled ? ' bg-navy shadow-lg shadow-black/20' : ' bg-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <Link to="/" className="flex items-center no-underline gap-3.5">
              <span className="flex items-center justify-center h-12 lg:h-[52px] w-12 lg:w-[52px] rounded-full bg-white/10 backdrop-blur-sm shrink-0 overflow-hidden">
                <img src={logoSrc} alt="Pluto Associates — Advocates and Legal Consultants" title="Pluto Associates" className="w-full h-full object-cover" />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-white text-lg font-semibold leading-tight">Pluto Associates</span>
                <span className="text-[0.65rem] text-text-light tracking-wider hidden sm:block">Advocates & Legal Consultants</span>
              </div>
            </Link>

            <ul className="hidden lg:flex items-center gap-7 list-none m-0 p-0">
              {NAV_ITEMS.map((item) =>
                item.to === '/services' ? (
                  <li
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      className={`${linkClass(item.to)} flex items-center gap-1.5 bg-transparent border-none cursor-pointer`}
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <span className={`text-[0.6rem] transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full pt-5 w-[920px] transition-all duration-300 ${servicesOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
                    >
                      <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 border border-light-gray overflow-hidden">
                        <div className="grid grid-cols-3 gap-0 p-6 max-h-[560px] overflow-y-auto">
                          {groups.map((g) => (
                            <div key={g.id} className="px-4 py-3 border-l border-light-gray first:border-l-0">
                              <Link
                                to={'/services#group-' + g.id}
                                className="flex items-center gap-2 font-serif text-navy text-sm font-semibold no-underline hover:text-gold transition-colors mb-2.5"
                                onClick={() => setServicesOpen(false)}
                              >
                                <span className="text-base leading-none">{g.icon}</span>
                                <span className="leading-tight">{g.name}</span>
                              </Link>
                              <ul className="flex flex-col gap-1 list-none m-0 p-0">
                                {g.services.slice(0, 5).map((s) => (
                                  <li key={s.id}>
                                    <Link
                                      to={'/services/' + s.slug}
                                      className="block text-[0.8rem] text-text-body no-underline hover:text-gold py-1 transition-colors leading-snug"
                                      onClick={() => setServicesOpen(false)}
                                    >
                                      {s.name}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link
                                    to={'/services#group-' + g.id}
                                    className="inline-block text-[0.75rem] text-gold font-semibold no-underline hover:text-navy py-1 transition-colors"
                                    onClick={() => setServicesOpen(false)}
                                  >
                                    View all ({g.count}) →
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-4 px-8 py-4 bg-navy">
                          <span className="text-white/80 text-sm">Not sure which service fits? We'll guide you.</span>
                          <Link
                            to="/contact"
                            className="inline-flex items-center px-5 py-2 bg-gold text-navy text-xs font-semibold no-underline hover:bg-white transition-colors"
                            onClick={() => setServicesOpen(false)}
                          >
                            Get Consultation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass(item.to)}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="hidden lg:block">
              <Link
                to="/contact"
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
        <div className="flex items-center gap-3 p-6 border-b border-white/5">
          <span className="flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm shrink-0 overflow-hidden">
            <img src={logoSrc} alt="Pluto Associates" title="Pluto Associates" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-white text-base font-bold">Pluto Associates</span>
        </div>
        <ul className="flex flex-col list-none m-0 p-4 pt-8 overflow-y-auto">
          {NAV_ITEMS.map((item) =>
            item.to === '/services' ? (
              <li key={item.to}>
                <button
                  className={`w-full flex items-center justify-between py-3 px-4 text-sm no-underline bg-transparent border-none cursor-pointer transition-colors duration-300 ${isServicesPath ? 'text-gold' : 'text-text-light hover:text-gold'}`}
                  onClick={() => setMobileServices((v) => !v)}
                  aria-expanded={mobileServices}
                >
                  <span>{item.label}</span>
                  <span className={`text-[0.6rem] transition-transform duration-300 ${mobileServices ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <div className={`grid transition-all duration-300 ${mobileServices ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="px-2 pb-3">
                      {groups.map((g) => (
                        <div key={g.id} className="mb-1">
                          <Link
                            to={'/services#group-' + g.id}
                            className={`flex items-center gap-2 py-2 px-3 text-[0.8rem] font-semibold no-underline ${isServicesPath ? 'text-gold' : 'text-white/85 hover:text-gold'}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            <span>{g.icon}</span>
                            <span className="flex-1">{g.name}</span>
                            <span className="text-xs text-text-light">{g.count}</span>
                          </Link>
                          <div className="pl-9 flex flex-col">
                            {g.services.slice(0, 4).map((s) => (
                              <Link
                                key={s.id}
                                to={'/services/' + s.slug}
                                className="py-1.5 px-3 text-[0.78rem] text-text-light no-underline hover:text-gold transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {s.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block py-3 px-4 text-sm no-underline transition-colors duration-300 ${location.pathname === item.to ? 'text-gold' : 'text-text-light hover:text-gold'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
          <li>
            <Link
              to="/contact"
              className={`block py-3 px-4 text-sm no-underline transition-colors duration-300 ${location.pathname === '/contact' ? 'text-gold' : 'text-text-light hover:text-gold'}`}
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
