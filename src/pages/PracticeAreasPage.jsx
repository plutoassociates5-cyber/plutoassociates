import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
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

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">What We Do</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Our Practice Areas</h2>
          <p className="text-base text-text-light max-w-[600px] leading-relaxed mx-auto mb-12 text-center">
            Comprehensive legal services across Nepal's most dynamic sectors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREAS.map((area, idx) => (
              <div key={area.id} id={area.id} className="bg-white border border-light-gray overflow-hidden cursor-pointer transition-all duration-400 hover:shadow-lg hover:-translate-y-[3px] reveal-anim">
                <img src={area.img} alt={area.title} loading="lazy" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-serif text-xl text-navy mb-3">{area.icon} {area.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{area.desc}</p>
                </div>
              </div>
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
