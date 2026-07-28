import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import teamSudeep from '../assets/team-sudeep.jpg';

const HERO_SLIDES = [
  { image: hero1 },
  { image: hero2 },
  { image: hero3 },
];

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
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

      <section className="page-hero" style={{ backgroundImage: `url(${hero2})` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1>About Us</h1>
          <p className="breadcrumb">
            <Link to="/">Home</Link> / About Us
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="about-story">
            <div className="reveal-left">
              <img src={teamSudeep} alt="Our Story" className="about-story-image" />
            </div>
            <div className="about-story-text reveal-right">
              <div className="section-label">Our Story</div>
              <h2>Building a Legacy of Legal Excellence Since 2019</h2>
              <p>Founded by Adv. Sudeep Nepal, Pluto Associates was established with a singular vision: to create a law firm that combines international legal standards with deep local expertise. What began as a boutique practice has grown into one of Nepal's most respected legal advisory firms.</p>
              <p>Our journey is defined by the trust our clients place in us — from Fortune 500 companies entering the Nepali market to local businesses seeking strategic legal counsel. Every case we handle is approached with the same dedication, thoroughness, and pursuit of excellence.</p>
              <p>Today, our team of experienced advocates and legal consultants covers over 15 practice areas, serving clients across Nepal and internationally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--off-white)' }}>
        <div className="container-wide">
          <div className="section-label center reveal">Our Values</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Mission & Core Values</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            Our guiding principles shape every aspect of our practice
          </p>
          <div className="values-grid">
            <div className="value-card reveal">
              <div className="vc-icon">🎯</div>
              <h4>Excellence</h4>
              <p>We pursue the highest standards of legal work, staying ahead of legal developments to provide cutting-edge advice.</p>
            </div>
            <div className="value-card reveal">
              <div className="vc-icon">🛡️</div>
              <h4>Integrity</h4>
              <p>Honesty, transparency, and ethical practice form the bedrock of every client relationship we build.</p>
            </div>
            <div className="value-card reveal">
              <div className="vc-icon">🤝</div>
              <h4>Client-First</h4>
              <p>Our clients' goals drive our strategy. We listen first, then craft solutions that align with their objectives.</p>
            </div>
            <div className="value-card reveal">
              <div className="vc-icon">🌍</div>
              <h4>Accessibility</h4>
              <p>We believe quality legal counsel should be accessible. Our pricing is transparent, and our team is always reachable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="section-label center reveal">Recognition</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Our Track Record</h2>
          <div className="recognition-grid" style={{ marginTop: '2rem' }}>
            <div className="recognition-card reveal">
              <div className="rc-num">30+</div>
              <div className="rc-label">Years of combined legal experience across our team</div>
            </div>
            <div className="recognition-card reveal">
              <div className="rc-num">95%</div>
              <div className="rc-label">Client satisfaction rate across all practice areas</div>
            </div>
            <div className="recognition-card reveal">
              <div className="rc-num">15+</div>
              <div className="rc-label">Specialized practice areas serviced by our team</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--off-white)' }}>
        <div className="container-wide">
          <div className="section-label center reveal">Affiliations</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Professional Memberships</h2>
          <div className="affiliations-grid" style={{ marginTop: '2rem' }}>
            <div className="affiliation-card reveal">Nepal Bar Association</div>
            <div className="affiliation-card reveal">Supreme Court Bar Association</div>
            <div className="affiliation-card reveal">SAARC Law Nepal Chapter</div>
            <div className="affiliation-card reveal">International Bar Association</div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="section-label center reveal">Our Process</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>How We Work</h2>
          <div className="process-grid" style={{ marginTop: '2rem' }}>
            <div className="process-step reveal">
              <div className="ps-num">01</div>
              <h4>Consultation</h4>
              <p>We begin with a thorough discussion to understand your legal needs, concerns, and objectives.</p>
            </div>
            <div className="process-step reveal">
              <div className="ps-num">02</div>
              <h4>Strategy</h4>
              <p>Our team develops a tailored legal strategy, outlining the approach, timeline, and expected outcomes.</p>
            </div>
            <div className="process-step reveal">
              <div className="ps-num">03</div>
              <h4>Execution</h4>
              <p>We implement the strategy with precision, keeping you informed at every stage of the process.</p>
            </div>
            <div className="process-step reveal">
              <div className="ps-num">04</div>
              <h4>Resolution</h4>
              <p>We deliver results and provide ongoing support to ensure your legal matters are fully resolved.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Let's Work Together</h2>
          <p className="reveal">Schedule a consultation to discuss how we can assist with your legal needs.</p>
          <div className="cta-btns reveal">
            <Link to="/contact" className="btn-primary">Get in Touch →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
      <BackToTop />
    </div>
  );
}