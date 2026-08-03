import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero1 from '../assets/hero-1.jpeg';
import { getServiceGroups } from '../services/store';

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export default function ServicesPage() {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const { hash } = useLocation();

  const groups = getServiceGroups();

  useEffect(() => {
    if (hash && hash.startsWith('#group-')) {
      setActiveGroup(hash.replace('#group-', ''));
      setTimeout(() => {
        document.getElementById('group-' + hash.replace('#group-', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [hash]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const walk = (s) =>
      [s.name, s.category, s.group, (s.tags || []).join(' '), (s.shortDescription || '')]
        .join(' ')
        .toLowerCase()
        .includes(q);
    if (activeGroup === 'all') return q ? groups.filter((g) => g.services.some(walk)) : groups;
    return groups
      .filter((g) => g.id === activeGroup)
      .map((g) => ({ ...g, services: q ? g.services.filter(walk) : g.services }))
      .filter((g) => g.services.length > 0);
  }, [groups, query, activeGroup]);

  const total = useMemo(() => groups.reduce((n, g) => n + g.services.length, 0), [groups]);

  const jump = (id) => {
    setActiveGroup(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTimeout(() => {
      document.getElementById('group-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div>
      <PublicNavbar />

      <section className="relative flex items-center justify-center text-center bg-cover bg-center py-24 min-h-[340px]" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[60px] px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-4 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5">Our Services</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-4">Legal services for every matter, from business to family</h1>
          <p className="text-white/75 max-w-2xl mx-auto mb-7">
            {total}+ services organised across nine practice groups — delivered by Pluto Associates with a senior partner on every engagement.
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services e.g. trademark, divorce, arbitration…"
              className="w-full rounded-full border border-white/20 bg-white/10 backdrop-blur px-5 py-3.5 pr-28 text-white placeholder:text-white/60 outline-none focus:border-gold text-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f6f7f8]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* group filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => jump('all')}
              className={`text-xs px-4 py-2 rounded-full border transition-colors cursor-pointer ${activeGroup === 'all' ? 'bg-navy text-white border-navy' : 'bg-white border-light-gray text-text-body hover:border-gold'}`}
            >
              All Groups ({total})
            </button>
            {groups.map((g, i) => (
              <button
                key={g.id}
                onClick={() => jump(g.id)}
                className={`text-xs px-4 py-2 rounded-full border transition-colors cursor-pointer ${activeGroup === g.id ? 'bg-navy text-white border-navy' : 'bg-white border-light-gray text-text-body hover:border-gold'}`}
              >
                {GROUP_LABELS[i] || ''}. {g.name} ({g.count})
              </button>
            ))}
          </div>

          {visible.map((g, i) => (
            <div key={g.id} id={'group-' + g.id} className="mb-14 scroll-mt-28">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <h2 className="font-serif text-2xl text-navy flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center text-xl shrink-0">{g.icon}</span>
                  <span>
                    <span className="text-gold mr-2">{GROUP_LABELS[i]}.</span>
                    {g.name}
                  </span>
                </h2>
                <span className="text-xs text-text-light uppercase tracking-wider">{g.services.length} services</span>
              </div>
              <p className="text-text-body text-sm max-w-2xl mb-6 -mt-2">{g.intro}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.services.map((s) => (
                  <Link
                    key={s.id}
                    to={'/services/' + s.slug}
                    className="group bg-white border border-light-gray rounded-xl p-5 no-underline transition-all duration-300 hover:border-gold hover:shadow-lg hover:shadow-navy/5 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-lg leading-none">{s.icon}</span>
                      <span className="w-7 h-7 rounded-full bg-navy/5 text-navy flex items-center justify-center text-sm group-hover:bg-gold group-hover:text-navy transition-colors">→</span>
                    </div>
                    <h3 className="font-serif text-navy text-base mt-3 mb-2 leading-snug group-hover:text-gold transition-colors">{s.name}</h3>
                    <p className="text-text-body text-xs leading-relaxed line-clamp-2">{s.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="bg-white border border-light-gray rounded-2xl p-10 text-center">
              <p className="text-text-light mb-1">No services match your search.</p>
              <p className="text-sm text-text-light">Try a different keyword, or ask us directly.</p>
            </div>
          )}

          <div className="bg-navy text-white rounded-2xl p-8 text-center mt-6">
            <h3 className="font-serif text-xl mb-2">Not sure where to start?</h3>
            <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">Tell us what you're trying to achieve and we'll point you to the right service.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300">Ask Our Team →</Link>
              <a href="tel:+977-9802356987" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">Call Us Now</a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
