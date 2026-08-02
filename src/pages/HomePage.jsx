import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import { getHomepage } from '../utils/contentStore';
import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import homeImg from '../assets/office-photo.jpeg';

const HERO_SLIDES = [
  { image: hero1 },
  { image: hero2 },
  { image: hero3 },
];

export default function HomePage() {
  const hp = getHomepage();
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

      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/85 via-navy/60 to-navy/30" />
        <div className="relative z-10 h-full flex items-center pt-[70px]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-[700px]">
              <div className="inline-block px-4 py-1.5 text-[0.7rem] font-semibold tracking-[2px] uppercase text-gold border border-gold/30 bg-gold/15 mb-6">{hp.hero.badge}</div>
              <h1 className="font-serif text-[clamp(2.5rem,6vw,4.2rem)] text-white font-bold leading-[1.1] mb-5">{hp.hero.headline}</h1>
              <p className="text-[1.05rem] text-white/80 max-w-[540px] leading-relaxed mb-8">{hp.hero.subheadline}</p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">{hp.hero.ctaPrimary} →</Link>
                <Link to="/practice-areas" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">{hp.hero.ctaSecondary}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {hp.stats.map((stat, i) => (
              <div key={i} className="reveal-anim"><div className="font-serif text-4xl font-bold text-gold mb-1">{stat.value}</div><div className="text-xs text-white/60 uppercase tracking-[1.5px]">{stat.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            <div className="w-full lg:w-1/2 reveal-left-anim">
              <img src={homeImg} alt="Pluto Associates office and legal team in Kathmandu, Nepal" title="Pluto Associates office, Kathmandu" loading="lazy" className="w-full h-[300px] lg:h-[500px] object-cover rounded-lg shadow-md" />
            </div>
            <div className="w-full lg:w-1/2 reveal-right-anim flex flex-col justify-center">
              <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4">About Our Firm</div>
              <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-navy leading-tight mb-6">Trusted Legal Advisors Committed to Your Success</h2>
              <p className="mb-5 text-text-body leading-relaxed">Pluto Associates is a premier law firm in Kathmandu, Nepal, recognized for our depth of expertise across corporate law, foreign investment, litigation, and regulatory compliance. Our team brings together decades of experience, academic rigor, and a client-first approach to deliver outcomes that matter.</p>
              <p className="mb-5 text-text-body leading-relaxed">From multinational corporations navigating Nepal's FDI landscape to startups seeking incorporation and individuals requiring family law counsel — we provide bespoke legal solutions tailored to each client's unique needs.</p>
              <Link to="/about" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-gold hover:text-navy no-underline self-start">Learn More About Us →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Expertise</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Practice Areas</h2>
          <p className="text-base text-text-light max-w-[600px] leading-relaxed mx-auto mb-12 text-center">
            Comprehensive legal services across key practice areas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/practice-areas#fdi" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="font-serif text-xl text-navy mb-3">FDI & Investment</h3>
              <p className="text-sm text-text-body leading-relaxed">Navigate Nepal's foreign investment landscape with expert guidance on regulations, approvals, and structuring.</p>
            </Link>
            <Link to="/practice-areas#corporate" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="font-serif text-xl text-navy mb-3">Corporate Law</h3>
              <p className="text-sm text-text-body leading-relaxed">Comprehensive corporate services from company registration to mergers, acquisitions, and governance.</p>
            </Link>
            <Link to="/practice-areas#energy" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-serif text-xl text-navy mb-3">Energy Law</h3>
              <p className="text-sm text-text-body leading-relaxed">Legal advisory for energy projects, power purchase agreements, regulatory compliance, and dispute resolution.</p>
            </Link>
            <Link to="/practice-areas#litigation" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="font-serif text-xl text-navy mb-3">Litigation</h3>
              <p className="text-sm text-text-body leading-relaxed">Representation across all tiers of the Nepali judiciary with a track record of favorable outcomes.</p>
            </Link>
            <Link to="/practice-areas#ip" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="font-serif text-xl text-navy mb-3">Intellectual Property</h3>
              <p className="text-sm text-text-body leading-relaxed">Protect your innovations with trademark registration, patent filing, copyright enforcement, and IP litigation.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Ready to Resolve Your Legal Matters?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Schedule a confidential consultation with our experienced legal team today.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Book a Consultation →</Link>
            <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">Call Us Now</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
