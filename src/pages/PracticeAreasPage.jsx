import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import hero1 from '../assets/hero-1.jpeg';
import hero2 from '../assets/hero-2.jpeg';
import hero3 from '../assets/hero-3.jpeg';
import paFdi from '../assets/pa-fdi.jpg';
import paCorporate from '../assets/pa-corporate.jpg';
import paEnergy from '../assets/pa-energy.jpg';
import paBanking from '../assets/pa-banking.jpg';
import paLitigation from '../assets/pa-litigation.jpg';
import paIp from '../assets/pa-ip.jpg';
import paLabor from '../assets/pa-labor.jpg';
import paRealestate from '../assets/pa-realestate.jpg';
import paTax from '../assets/pa-tax.jpg';

const AREAS = [
  { id: 'fdi', img: paFdi, icon: '🌐', title: 'Foreign Direct Investment (FDI)', desc: 'Expert guidance for foreign investors navigating Nepal\'s regulatory landscape. We handle investment approvals, sector-specific regulations, joint ventures, and structuring of foreign investments.' },
  { id: 'corporate', img: paCorporate, icon: '🏢', title: 'Corporate & Commercial Law', desc: 'End-to-end corporate services including company registration, corporate governance, mergers & acquisitions, due diligence, and commercial contracts.' },
  { id: 'energy', img: paEnergy, icon: '⚡', title: 'Energy, Infrastructure & Project Finance', desc: 'Legal advisory for energy projects — from hydroelectric to solar. Services include PPA negotiation, regulatory approvals, financing, and dispute resolution.' },
  { id: 'banking', img: paBanking, icon: '🏦', title: 'Banking & Finance', desc: 'Regulatory compliance, loan documentation, financial restructuring, and representation in banking disputes before courts and regulatory bodies.' },
  { id: 'litigation', img: paLitigation, icon: '⚖️', title: 'Litigation & Dispute Resolution', desc: 'Representation across all levels of the Nepali judiciary, arbitration, mediation, and alternative dispute resolution services.' },
  { id: 'ip', img: paIp, icon: '💡', title: 'Intellectual Property', desc: 'Trademark registration, patent filing, copyright protection, IP portfolio management, and litigation for IP infringement cases.' },
  { id: 'labor', img: paLabor, icon: '👥', title: 'Labor & Employment Law', desc: 'Employment contracts, labor compliance, dispute resolution, collective bargaining, and HR policy advisory for employers.' },
  { id: 'realestate', img: paRealestate, icon: '🏠', title: 'Real Estate & Property', desc: 'Property due diligence, title verification, land acquisition, lease agreements, and real estate dispute resolution.' },
  { id: 'tax', img: paTax, icon: '📊', title: 'Taxation', desc: 'Tax planning, corporate tax compliance, VAT advisory, tax dispute representation, and international tax structuring.' },
];

export default function PracticeAreasPage() {
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

      <section className="page-hero" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1>Practice Areas</h1>
          <p className="breadcrumb">
            <Link to="/">Home</Link> / Practice Areas
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="section-label center reveal">What We Do</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Our Practice Areas</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            Comprehensive legal services across Nepal's most dynamic sectors
          </p>
          <div className="practice-grid">
            {AREAS.map((area, idx) => (
              <div key={area.id} id={area.id} className="pa-card reveal">
                <img src={area.img} alt={area.title} />
                <div className="pa-card-body">
                  <h3>{area.icon} {area.title}</h3>
                  <p>{area.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Need Legal Assistance?</h2>
          <p className="reveal">Our experienced team is ready to help you navigate your legal challenges.</p>
          <div className="cta-btns reveal">
            <Link to="/contact" className="btn-primary">Schedule a Consultation →</Link>
            <a href="tel:+977-9802356987" className="btn-secondary">Call Us</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
      <BackToTop />
    </div>
  );
}