import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero1 from '../assets/hero-1.jpeg';
import { getServiceGroups } from '../services/store';

export default function ServicesPage() {
  const { hash } = useLocation();
  const groups = getServiceGroups();
  const total = useMemo(() => groups.reduce((n, g) => n + g.services.length, 0), [groups]);

  useEffect(() => {
    if (hash && hash.startsWith('#group-')) {
      setTimeout(() => {
        document.getElementById('group-' + hash.replace('#group-', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [hash]);

  return (
    <div>
      <PublicNavbar />

      <section className="relative flex items-center justify-center text-center bg-cover bg-center py-20 min-h-[300px]" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[60px] px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-4 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5">Our Services</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-4">Legal services for every matter</h1>
          <p className="text-white/75 max-w-xl mx-auto">
            {total} services across {groups.length} practice groups, delivered with a senior partner on every engagement.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f6f7f8]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {groups.map((g) => (
              <div key={g.id} id={'group-' + g.id} className="scroll-mt-28">
                <h2 className="font-serif text-navy text-lg mb-3 flex items-center gap-2">
                  <span className="text-lg leading-none">{g.icon}</span>
                  <span>{g.name}</span>
                </h2>
                <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                  {g.services.map((s) => (
                    <li key={s.id}>
                      <Link to={'/services/' + s.slug} className="text-sm text-text-body no-underline hover:text-gold transition-colors">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-sans text-sm font-semibold no-underline hover:bg-gold hover:text-navy transition-colors duration-300">Ask Our Team →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
