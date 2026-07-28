import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
import { HeroSlideshow } from '../components/PublicHooks';
import hero1 from '../assets/hero-1.jpeg';
import teamsBg from '../assets/teams-background.jpg';
import teamSudeep from '../assets/team-sudeep.jpg';
import teamGhimire from '../assets/team-sujan.jpeg';
import teamNikesh from '../assets/team-nikesh.jpeg';

export default function TeamsPage() {
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

      <section className="page-hero" style={{ backgroundImage: `url(${teamsBg})` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1>Our Team</h1>
          <p className="breadcrumb">
            <Link to="/">Home</Link> / Our Team
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="section-label center reveal">Who We Are</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Meet Our Team</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 3rem' }}>
            Experienced legal professionals dedicated to your success
          </p>

          <div className="team-member-card reveal" style={{ marginBottom: '3rem' }}>
            <img src={teamSudeep} alt="Adv. Sudeep Nepal" />
            <div>
              <h3 className="tm-name">Adv. Sudeep Nepal</h3>
              <div className="tm-role">Founder & Senior Partner</div>
              <p className="tm-bio">
                Adv. Sudeep Nepal is the founding partner of Pluto Associates, bringing years of extensive experience in corporate law, FDI, litigation, and regulatory affairs. He has represented clients before the Supreme Court of Nepal, appellate courts, and various tribunals. His practice focuses on cross-border investments, commercial litigation, and strategic legal advisory for multinational corporations operating in Nepal.
              </p>
              <p className="tm-bio">
                A recognized thought leader in Nepali legal circles, Adv. Nepal has authored numerous articles on corporate law and investment regulations. He is committed to mentoring the next generation of legal professionals and advancing the rule of law in Nepal.
              </p>
              <div className="tm-contact">
                <a href="mailto:sudeep@plutoassociates.com">✉️ sudeep@plutoassociates.com</a>
                <a href="tel:+977-9802356987">📞 Contact</a>
              </div>
            </div>
          </div>

          <div className="team-member-card reveal" style={{ marginBottom: '3rem' }}>
            <img src={teamGhimire} alt="Adv. Ram Sharan Ghimire" />
            <div>
              <h3 className="tm-name">Adv. Ram Sharan Ghimire</h3>
              <div className="tm-role">Co-Founder & Senior Partner</div>
              <p className="tm-bio">
                Adv. Ram Sharan Ghimire brings extensive experience in litigation, banking law, and dispute resolution. His practice encompasses civil and criminal litigation, banking and financial disputes, and arbitration proceedings. He has successfully represented clients in complex commercial disputes and is known for his strategic approach to litigation.
              </p>
              <p className="tm-bio">
                With a deep understanding of Nepal's judicial system, Adv. Ghimire provides invaluable insights to clients navigating regulatory challenges. His dedication to client service and legal excellence has earned him the trust of a diverse clientele spanning across industries.
              </p>
              <div className="tm-contact">
                <a href="mailto:ram@plutoassociates.com">✉️ ram@plutoassociates.com</a>
                <a href="tel:+977-9802356987">📞 Contact</a>
              </div>
            </div>
          </div>

          <div className="section-label center reveal" style={{ marginTop: '4rem' }}>Associates</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Our Associates</h2>

          <div className="associates-grid" style={{ marginTop: '2rem' }}>
            <div className="associate-card reveal">
              <img src={teamNikesh} alt="Nikesh Nepal" className="ac-avatar" />
              <h4>Nikesh Nepal</h4>
              <div className="ac-role">Legal Associate</div>
              <p>Civil Law, Corporate Law, Contract Drafting</p>
            </div>
            <div className="associate-card reveal">
              <div className="ac-avatar" style={{ background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--navy)', fontWeight: 700 }}>RS</div>
              <h4>Sujan Subedi</h4>
              <div className="ac-role">Legal Associate</div>
              <p>Corporate Law, Litigation, Compliance</p>
            </div>
            <div className="join-card reveal">
              <h4>Join Our Team</h4>
              <p>We're always looking for talented legal professionals.</p>
              <a href="mailto:careers@plutoassociates.com">Send your CV →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Have a Legal Matter?</h2>
          <p className="reveal">Our team is ready to assist you with expert legal counsel.</p>
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