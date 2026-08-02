import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { getPracticeAreas } from '../utils/contentStore';
import hero1 from '../assets/hero-1.jpeg';

export default function PracticeAreasPage() {
  const AREAS = getPracticeAreas();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-anim, .reveal-left-anim, .reveal-right-anim').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <PublicNavbar />

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Practice Areas</h1>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#f6f7f8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-4 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5 reveal-anim">What We Do</span>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.6rem)] text-navy leading-tight mb-4 font-semibold reveal-anim">Our Practice Areas</h2>
            <p className="text-base text-text-light leading-relaxed reveal-anim">
              Comprehensive legal services across Nepal's most dynamic sectors — delivered by a team that pairs deep regulatory insight with a commitment to our clients' success. Click any area to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREAS.map((area, idx) => (
              <Link
                key={area.id}
                to={`/practice-areas/${area.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col no-underline reveal-anim"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={area.img} alt={area.title} title={area.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                  <span className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/95 backdrop-blur flex items-center justify-center text-xl shadow-md">{area.icon}</span>
                  <span className="absolute bottom-3 right-4 text-[0.62rem] tracking-widest font-semibold text-white/80">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-[1.15rem] leading-snug text-navy mb-3 group-hover:text-gold">{area.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed mb-4">{area.desc}</p>
                  {area.highlights && area.highlights.length > 0 && (
                    <ul className="list-none p-0 m-0 mb-6 flex flex-col gap-2">
                      {area.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text-body">
                          <span className="w-4 h-4 mt-0.5 rounded-full bg-gold/15 text-gold text-[0.6rem] font-bold flex items-center justify-center shrink-0">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold no-underline border-b border-transparent group-hover:border-gold transition-colors self-start">
                    Read more
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Need Legal Assistance?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Our experienced team is ready to help you navigate your legal challenges.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Schedule a Consultation →</Link>
            <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">Call Us</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}