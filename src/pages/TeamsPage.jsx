import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import teamsBg from '../assets/teams-background.jpg';
import teamSudeep from '../assets/team-sudeep.jpg';
import teamGhimire from '../assets/team-sujan.jpeg';
import teamNikesh from '../assets/team-nikesh.jpeg';
import teamNeehal from '../assets/team-motey.jpeg';

export default function TeamsPage() {
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

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${teamsBg})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Our Team</h1>
          <p className="text-sm text-white/60">
            <Link to="/" className="text-white/60 hover:text-gold">Home</Link> / Our Team
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Who We Are</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Meet Our Team</h2>
          <p className="text-base text-text-light max-w-[600px] leading-relaxed mx-auto mb-12 text-center">
            Experienced legal professionals dedicated to your success
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-10 bg-white shadow-sm p-6 lg:p-8 items-start reveal-anim mb-12">
            <img src={teamSudeep} alt="Adv. Sudeep Nepal" loading="lazy" className="w-full h-[300px] lg:h-full object-cover" />
            <div>
              <h3 className="font-serif text-2xl text-navy mb-1">Adv. Sudeep Nepal</h3>
              <div className="text-xs text-gold font-semibold tracking-[1px] uppercase mb-4">Founder & Senior Partner</div>
              <p className="text-sm leading-relaxed mb-4 text-text-body">
                Adv. Sudeep Nepal is the founding partner of Pluto Associates, bringing years of extensive experience in corporate law, FDI, litigation, and regulatory affairs. He has represented clients before the Supreme Court of Nepal, appellate courts, and various tribunals. His practice focuses on cross-border investments, commercial litigation, and strategic legal advisory for multinational corporations operating in Nepal.
              </p>
              <p className="text-sm leading-relaxed mb-4 text-text-body">
                A recognized thought leader in Nepali legal circles, Adv. Nepal has authored numerous articles on corporate law and investment regulations. He is committed to mentoring the next generation of legal professionals and advancing the rule of law in Nepal.
              </p>
              <div className="flex gap-4">
                <a href="mailto:sudeep@plutoassociates.com" className="text-gold text-sm hover:underline">✉️ sudeep@plutoassociates.com</a>
                <a href="tel:+977-9802356987" className="text-gold text-sm hover:underline">📞 Contact</a>
              </div>
            </div>
          </div>



          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim mt-16">Associates</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Our Associates</h2>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white shadow-sm p-6 text-center reveal-anim">
              <img src={teamNikesh} alt="Nikesh Nepal" loading="lazy" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <h4 className="font-serif text-lg text-navy mb-2">Nikesh Nepal</h4>
              <div className="text-xs text-gold font-semibold uppercase tracking-[0.5px] mb-2">Legal Associate</div>
              <p className="text-sm text-text-body">Civil Law, Corporate Law, Contract Drafting</p>
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white shadow-sm p-6 text-center reveal-anim">
              <img src={teamGhimire} alt="Sujan Subedi" loading="lazy" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <h4 className="font-serif text-lg text-navy mb-2">Sujan Subedi</h4>
              <div className="text-xs text-gold font-semibold uppercase tracking-[0.5px] mb-2">Legal Associate</div>
              <p className="text-sm text-text-body">Corporate Law, Litigation, Compliance</p>
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white shadow-sm p-6 text-center reveal-anim">
              <img src={teamNeehal} alt="Neehal Pokharel" loading="lazy" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
              <h4 className="font-serif text-lg text-navy mb-2">Neehal Pokharel</h4>
              <div className="text-xs text-gold font-semibold uppercase tracking-[0.5px] mb-2">Legal Associate</div>
              <p className="text-sm text-text-body">Corporate Law, Litigation, Compliance</p>
            </div>
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-navy shadow-sm p-6 lg:p-8 text-center flex flex-col items-center justify-center text-white reveal-anim">
              <h4 className="font-serif text-xl mb-3">Join Our Team</h4>
              <p className="text-sm text-white/70 mb-4">We're always looking for talented legal professionals.</p>
              <a href="mailto:careers@plutoassociates.com" className="text-gold font-semibold hover:underline inline-block">Send your CV →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Have a Legal Matter?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Our team is ready to assist you with expert legal counsel.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Get in Touch →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
