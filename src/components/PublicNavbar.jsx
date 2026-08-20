import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getSettings } from '../utils/contentStore';
import { getServiceGroups } from '../services/store';
import SmartLogo from './SmartLogo';
import SearchOverlay from './SearchOverlay';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/services', label: 'Our Services' },
  { to: '/teams', label: 'Our Teams' },
  { to: '/publications', label: 'Publications' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const site = getSettings();
  const groups = getServiceGroups();

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
    const onKey = (e) => {
      const target = e.target;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-[var(--brand-sticky-h,66px)] lg:h-[var(--brand-sticky-h,72px)]' : 'h-[var(--brand-mobile-h,78px)] lg:h-[var(--brand-header-h,96px)]'}`}>
            <Link to="/" className={`pluto-brand flex items-center no-underline gap-3 sm:gap-4 transition-all duration-300 ${scrolled ? 'is-scrolled' : ''}`}>
              <SmartLogo size="var(--logo-size)" alt="Pluto Associates — Advocates and Legal Consultants" eager />
              <span className="flex flex-col justify-center leading-tight min-w-0">
                <span className={`font-serif text-white font-bold truncate transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl lg:text-2xl'}`}>{site.name}</span>
                <span className="hidden sm:block text-[0.62rem] lg:text-[0.68rem] text-white/55 font-medium tracking-[0.14em] uppercase mt-0.5">{site.tagline}</span>
              </span>
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

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search site"
                title="Search ( / )"
                className="flex items-center justify-center w-10 h-10 bg-white/10 ring-1 ring-white/15 rounded-full text-white cursor-pointer border-none hover:bg-gold hover:text-navy transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
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
        <div className="pluto-brand flex items-center gap-3 p-6 border-b border-white/5">
          <SmartLogo size="var(--logo-size)" alt="Pluto Associates" />
          <span className="flex flex-col justify-center leading-tight">
            <span className="font-serif text-white text-base font-bold">{site.name}</span>
            <span className="text-[0.6rem] text-white/55 font-medium tracking-[0.14em] uppercase mt-0.5">{site.tagline}</span>
          </span>
        </div>
        <ul className="flex flex-col list-none m-0 p-4 pt-8 overflow-y-auto">
          <li className="px-4 pb-2">
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="w-full flex items-center gap-3 py-2.5 px-4 text-sm no-underline bg-white/5 ring-1 ring-white/10 rounded-lg text-text-light cursor-pointer hover:text-gold transition-colors border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Search the site…</span>
              <span className="ml-auto text-[0.6rem] text-text-light bg-white/10 px-1.5 py-0.5 rounded">/</span>
            </button>
          </li>
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

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
