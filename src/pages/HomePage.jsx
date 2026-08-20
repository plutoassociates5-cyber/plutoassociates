import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import { getHomepage } from '../utils/contentStore';
import { getPublishedArticles } from '../seo';
import { getServiceGroups } from '../services/store';
import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import homeImg from '../assets/office-photo.jpeg';

const HERO_SLIDES = [
  { image: hero1 },
  { image: hero2 },
  { image: hero3 },
];

const CATEGORY_LABELS = {
  general: 'Updates', fdi: 'FDI & Investment', corporate: 'Corporate Law',
  labor: 'Labor & Employment', energy: 'Energy Law', tax: 'Taxation',
  ip: 'Intellectual Property', litigation: 'Litigation',
};
function catLabel(c) { return CATEGORY_LABELS[c] || 'Updates'; }

const FEATURES = [
  { icon: '🎯', title: 'Results-Driven Approach', desc: 'We are measured by the outcomes we secure. Every strategy is built around your objectives, not our protocols.' },
  { icon: '🤝', title: 'Client-First Culture', desc: 'We listen first, advise clearly, and tailor every recommendation to your unique situation and goals.' },
  { icon: '🌐', title: 'Local Insight, Global Standards', desc: 'Deep command of Nepali law and institutions, matched with the sophistication expected of an international firm.' },
  { icon: '⚡', title: 'Responsive & Accessible', desc: 'Direct access to your counsel. When the matter is urgent, your lawyer is a phone call away.' },
  { icon: '🔒', title: 'Confidential & Trusted', desc: 'Absolute discretion on every engagement, so you can share freely and act with confidence.' },
  { icon: '🗂️', title: 'Full-Service Firm', desc: 'Corporate, litigation, tax, energy, IP and more — comprehensive counsel under one roof.' },
];

const TESTIMONIALS = [
  { quote: 'Pluto Associates guided our investment into Nepal from start to finish. Their clarity on FDI compliance and approvals made an otherwise complex process seamless.', name: 'Gautam R.', role: 'Managing Director, Kathmandu' },
  { quote: 'Their litigation team is relentless and precise. We finally resolved a dispute that had stalled our business for years — and they kept us informed at every step.', name: 'Priya S.', role: 'Founder, Manufacturing Sector' },
  { quote: 'From incorporation to contract drafting, their corporate practice handled everything with remarkable efficiency. A trusted partner in every sense.', name: 'Adv. Deepak M.', role: 'Corporate Client, Nepal' },
];

const PROCESS = [
  { step: '01', title: 'Initial Consultation', desc: 'We listen carefully to understand your situation, objectives, and constraints in a confidential first meeting.' },
  { step: '02', title: 'Strategy & Plan', desc: 'Your counsel develops a clear, tailored legal strategy — with timeline, options, and transparent fee guidance.' },
  { step: '03', title: 'Execution & Advocacy', desc: 'We act decisively — drafting, negotiating, and representing you before courts, tribunals, and regulators.' },
  { step: '04', title: 'Resolution & Review', desc: 'We see matters through to completion and remain on hand for follow-up, compliance, and future guidance.' },
];

export default function HomePage() {
  const hp = getHomepage();
  const servicesGroups = getServiceGroups();
  const latest = getPublishedArticles()
    .slice()
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
    .slice(0, 3);
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

      <section className="relative h-screen h-svh min-h-[600px] overflow-hidden">
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
            <Link to="/practice-areas#licensing" className="bg-white border border-light-gray p-6 lg:p-8 transition-all duration-400 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="font-serif text-xl text-navy mb-3">Licensing</h3>
              <p className="text-sm text-text-body leading-relaxed">Secure the licences and approvals your business needs, including real estate project approvals and business operating permits.</p>
            </Link>
          </div>
        </div>
      </section>

      {hp.servicesSection?.visible !== false && (
        <section className="py-16 lg:py-24">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 inline-block reveal-anim">What We Do</span>
                <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight font-semibold reveal-anim">{hp.servicesSection.title}</h2>
                <p className="text-base text-text-light max-w-[620px] leading-relaxed mt-3 reveal-anim">{hp.servicesSection.subtitle}</p>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-navy no-underline border-b-2 border-gold hover:gap-3 transition-all self-start md:self-auto reveal-anim">{hp.servicesSection.ctaLabel || 'View All Services'} →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesGroups.map((g) => (
                <Link
                  key={g.id}
                  to={'/services#group-' + g.id}
                  className="group bg-white border border-light-gray p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold no-underline block reveal-anim"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-2xl flex items-center justify-center">{g.icon}</div>
                    <span className="text-xs text-text-light font-semibold uppercase tracking-[1px]">{g.count} services</span>
                  </div>
                  <h3 className="font-serif text-lg text-navy mb-2 group-hover:text-gold transition-colors">{g.name}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{g.intro}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold mt-4 group-hover:gap-3 transition-all">Explore <span>→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 inline-block reveal-anim">Why Choose Pluto Associates</span>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.6rem)] text-navy leading-tight mb-4 font-semibold reveal-anim">A Firm Built Around You</h2>
            <p className="text-base text-text-light leading-relaxed reveal-anim">Everything you expect from a premier law firm — expertise, responsiveness, and results — delivered with genuine care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-white border border-light-gray p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold reveal-anim">
                <div className="w-12 h-12 rounded-xl bg-gold/10 text-2xl flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-serif text-lg text-navy mb-2">{f.title}</h3>
                <p className="text-sm text-text-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 inline-block reveal-anim">From Our Team</span>
              <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight font-semibold reveal-anim">Legal Updates & Insights</h2>
            </div>
            <Link to="/publications" className="inline-flex items-center gap-2 text-sm font-semibold text-navy no-underline border-b-2 border-gold hover:gap-3 transition-all self-start md:self-auto reveal-anim">View All Publications →</Link>
          </div>

          {latest.length === 0 ? (
            <p className="text-text-light text-sm">New publications from our team will appear here soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latest.map((a) => (
                <Link key={a.id} to={`/publications/${a.slug}`} className="group bg-white border border-light-gray p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold no-underline block reveal-anim">
                  <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-3">{catLabel(a.category)}</div>
                  <h3 className="font-serif text-lg text-navy mb-2 leading-snug group-hover:text-gold">{a.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{a.excerpt || (a.content ? a.content.replace(/<[^>]*>/g, '').substring(0, 120) : '')}…</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold mt-4 group-hover/read:gap-3 transition-all">Read Article <span>→</span></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-navy text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 inline-block reveal-anim">Client Stories</span>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-white leading-tight font-semibold reveal-anim">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col transition-all duration-300 hover:bg-white/10 reveal-anim">
                <span className="text-3xl text-gold leading-none mb-4">“</span>
                <blockquote className="text-[0.95rem] text-white/85 leading-relaxed flex-1">{t.quote}</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-white/10">
                  <div className="font-semibold text-gold">{t.name}</div>
                  <div className="text-sm text-white/50">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 inline-block reveal-anim">How We Work</span>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.6rem)] text-navy leading-tight font-semibold reveal-anim">A Clear Path to Resolution</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="relative bg-white border border-light-gray p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 reveal-anim">
                <span className="font-serif text-4xl text-gold/30 font-bold block mb-4">{p.step}</span>
                <h3 className="font-serif text-lg text-navy mb-2">{p.title}</h3>
                <p className="text-sm text-text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
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
