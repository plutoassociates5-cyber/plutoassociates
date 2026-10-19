import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero1 from '../assets/hero-1.jpeg';
import { getServiceGroups } from '../services/store';

export default function ServicesPage() {
  const { hash } = useLocation();
  const groups = getServiceGroups();
  const total = groups.reduce((n, g) => n + g.services.length, 0);

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

      <section className="relative flex items-center justify-center text-center bg-cover bg-center py-24 min-h-[360px]" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/92 via-navy/80 to-navy/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gold" />
        <div className="relative z-10 pt-[60px] px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-5 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5">Our Services</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.6rem)] text-white font-bold mb-5 leading-tight">Legal services for every matter</h1>
          <p className="text-white/75 max-w-xl mx-auto leading-relaxed">
            {total} services across {groups.length} practice groups, each led by a senior partner.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#f6f7f8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {groups.map((g, i) => (
              <div
                key={g.id}
                id={'group-' + g.id}
                className="scroll-mt-28 group bg-white rounded-2xl border border-light-gray p-7 sm:p-8 transition-all duration-300 hover:border-gold/50 hover:shadow-xl hover:shadow-navy/[0.06] hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4 mb-5">
                  <span className="w-12 h-12 rounded-xl bg-gold/10 text-2xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    {g.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[0.68rem] font-bold tracking-[0.2em] text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <h2 className="font-serif text-navy text-xl sm:text-[1.35rem] leading-snug">{g.name}</h2>
                    </div>
                    <p className="text-text-body text-[0.83rem] leading-relaxed mt-1.5">{g.intro}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-5 border-t border-light-gray">
                  {g.services.map((s) => (
                    <Link
                      key={s.id}
                      to={'/services/' + s.slug}
                      className="inline-flex items-center gap-1.5 text-[0.8rem] leading-snug text-navy no-underline bg-[#f6f7f8] hover:bg-navy hover:text-white border border-light-gray hover:border-navy rounded-full px-3.5 py-1.5 transition-all duration-200"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center bg-navy rounded-2xl px-8 py-10">
            <h2 className="font-serif text-white text-2xl mb-2">Not sure where to start?</h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">Tell us what you are trying to achieve and we will point you to the right service.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300">Ask Our Team</Link>
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
