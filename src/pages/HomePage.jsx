import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import aboutImg from '../assets/about1.jpg';

const HERO_SLIDES = [
  { image: hero1 },
  { image: hero2 },
  { image: hero3 },
];

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="hero">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="container-wide">
            <div className="hero-inner">
              <div className="hero-badge">Est. 2019 · Nepal Bar Association Registered</div>
              <h1 className="hero-title">Where Legal <em>Excellence</em> Meets Client <em>Trust</em></h1>
              <p className="hero-desc">Pluto Associates delivers strategic, results-driven legal counsel across Nepal — combining deep regulatory insight with unwavering commitment to our clients' success.</p>
              <div className="hero-buttons">
                <Link to="/contact" className="btn-primary">Schedule a Consultation →</Link>
                <Link to="/practice-areas" className="btn-secondary">Explore Our Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="container-wide">
          <div className="stats-grid">
            <div className="stat-item reveal"><div className="stat-num">30+</div><div className="stat-label">Years Combined Experience</div></div>
            <div className="stat-item reveal"><div className="stat-num">500+</div><div className="stat-label">Cases Successfully Resolved</div></div>
            <div className="stat-item reveal"><div className="stat-num">15+</div><div className="stat-label">Practice Areas</div></div>
            <div className="stat-item reveal"><div className="stat-num">95%</div><div className="stat-label">Client Satisfaction Rate</div></div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="about-brief">
            <div className="reveal-left">
              <img src={aboutImg} alt="About Pluto Associates" className="about-brief-image" />
            </div>
            <div className="about-brief-text reveal-right">
              <div className="section-label">About Our Firm</div>
              <h2>Trusted Legal Advisors Committed to Your Success</h2>
              <p>Pluto Associates is a premier law firm in Kathmandu, Nepal, recognized for our depth of expertise across corporate law, foreign investment, litigation, and regulatory compliance. Our team brings together decades of experience, academic rigor, and a client-first approach to deliver outcomes that matter.</p>
              <p>From multinational corporations navigating Nepal's FDI landscape to startups seeking incorporation and individuals requiring family law counsel — we provide bespoke legal solutions tailored to each client's unique needs.</p>
              <Link to="/about" className="btn-outline">Learn More About Us →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--off-white)' }}>
        <div className="container-wide">
          <div className="section-label center reveal">Our Expertise</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Practice Areas</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            Comprehensive legal services across key practice areas
          </p>
          <div className="practice-grid">
            <Link to="/practice-areas#fdi" className="practice-card reveal">
              <div className="pc-icon">🌐</div>
              <h3>FDI & Investment</h3>
              <p>Navigate Nepal's foreign investment landscape with expert guidance on regulations, approvals, and structuring.</p>
            </Link>
            <Link to="/practice-areas#corporate" className="practice-card reveal">
              <div className="pc-icon">🏢</div>
              <h3>Corporate Law</h3>
              <p>Comprehensive corporate services from company registration to mergers, acquisitions, and governance.</p>
            </Link>
            <Link to="/practice-areas#energy" className="practice-card reveal">
              <div className="pc-icon">⚡</div>
              <h3>Energy Law</h3>
              <p>Legal advisory for energy projects, power purchase agreements, regulatory compliance, and dispute resolution.</p>
            </Link>
            <Link to="/practice-areas#litigation" className="practice-card reveal">
              <div className="pc-icon">⚖️</div>
              <h3>Litigation</h3>
              <p>Representation across all tiers of the Nepali judiciary with a track record of favorable outcomes.</p>
            </Link>
            <Link to="/practice-areas#ip" className="practice-card reveal">
              <div className="pc-icon">💡</div>
              <h3>Intellectual Property</h3>
              <p>Protect your innovations with trademark registration, patent filing, copyright enforcement, and IP litigation.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Ready to Resolve Your Legal Matters?</h2>
          <p className="reveal">Schedule a confidential consultation with our experienced legal team today.</p>
          <div className="cta-btns reveal">
            <Link to="/contact" className="btn-primary">Book a Consultation →</Link>
            <a href="tel:+977-9802356987" className="btn-secondary">Call Us Now</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
      <BackToTop />
    </div>
  );
}