import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero2 from '../assets/hero-2.jpeg';
import aboutimg from '../assets/about1.jpg';

export default function AboutPage() {
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

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero2})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">About Us</h1>
          <p className="text-sm text-white/60">
            <Link to="/" className="text-white/60 hover:text-gold">Home</Link> / About Us
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="reveal-left-anim">
              <img src={aboutimg} alt="Our Story" loading="lazy" className="w-full h-[350px] lg:h-[500px] object-cover" />
            </div>
            <div className="reveal-right-anim">
              <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4">Our Story</div>
              <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-navy leading-tight mb-6">Building a Legacy of Legal Excellence Since 2019</h2>
              <p className="mb-5 text-text-body leading-relaxed">Founded by Adv. Sudeep Nepal, Pluto Associates was established with a singular vision: to create a law firm that combines international legal standards with deep local expertise. What began as a boutique practice has grown into one of Nepal's most respected legal advisory firms.</p>
              <p className="mb-5 text-text-body leading-relaxed">Our journey is defined by the trust our clients place in us — from Fortune 500 companies entering the Nepali market to local businesses seeking strategic legal counsel. Every case we handle is approached with the same dedication, thoroughness, and pursuit of excellence.</p>
              <p className="mb-5 text-text-body leading-relaxed">Today, our team of experienced advocates and legal consultants covers over 15 practice areas, serving clients across Nepal and internationally.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Values</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Mission & Core Values</h2>
          <p className="text-base text-text-light max-w-[600px] leading-relaxed mx-auto mb-12 text-center">
            Our guiding principles shape every aspect of our practice
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <div className="text-3xl mb-4">🎯</div>
              <h4 className="font-serif text-xl text-navy mb-3">Excellence</h4>
              <p className="text-sm text-text-body leading-relaxed">We pursue the highest standards of legal work, staying ahead of legal developments to provide cutting-edge advice.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <div className="text-3xl mb-4">🛡️</div>
              <h4 className="font-serif text-xl text-navy mb-3">Integrity</h4>
              <p className="text-sm text-text-body leading-relaxed">Honesty, transparency, and ethical practice form the bedrock of every client relationship we build.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <div className="text-3xl mb-4">🤝</div>
              <h4 className="font-serif text-xl text-navy mb-3">Client-First</h4>
              <p className="text-sm text-text-body leading-relaxed">Our clients' goals drive our strategy. We listen first, then craft solutions that align with their objectives.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <div className="text-3xl mb-4">🌍</div>
              <h4 className="font-serif text-xl text-navy mb-3">Accessibility</h4>
              <p className="text-sm text-text-body leading-relaxed">We believe quality legal counsel should be accessible. Our pricing is transparent, and our team is always reachable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Recognition</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Our Track Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-8 lg:p-10 text-center shadow-sm reveal-anim">
              <div className="font-serif text-4xl lg:text-5xl font-bold text-gold">30+</div>
              <div className="text-sm text-text-light mt-3 leading-relaxed">Years of combined legal experience across our team</div>
            </div>
            <div className="bg-white p-8 lg:p-10 text-center shadow-sm reveal-anim">
              <div className="font-serif text-4xl lg:text-5xl font-bold text-gold">95%</div>
              <div className="text-sm text-text-light mt-3 leading-relaxed">Client satisfaction rate across all practice areas</div>
            </div>
            <div className="bg-white p-8 lg:p-10 text-center shadow-sm reveal-anim">
              <div className="font-serif text-4xl lg:text-5xl font-bold text-gold">15+</div>
              <div className="text-sm text-text-light mt-3 leading-relaxed">Specialized practice areas serviced by our team</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Affiliations</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Professional Memberships</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">Nepal Bar Association</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">Supreme Court Bar Association</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">SAARC Law Nepal Chapter</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">International Bar Association</div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Process</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">How We Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">01</div>
              <h4 className="font-serif text-xl text-navy mb-3">Consultation</h4>
              <p className="text-sm text-text-body leading-relaxed">We begin with a thorough discussion to understand your legal needs, concerns, and objectives.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">02</div>
              <h4 className="font-serif text-xl text-navy mb-3">Strategy</h4>
              <p className="text-sm text-text-body leading-relaxed">Our team develops a tailored legal strategy, outlining the approach, timeline, and expected outcomes.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">03</div>
              <h4 className="font-serif text-xl text-navy mb-3">Execution</h4>
              <p className="text-sm text-text-body leading-relaxed">We implement the strategy with precision, keeping you informed at every stage of the process.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">04</div>
              <h4 className="font-serif text-xl text-navy mb-3">Resolution</h4>
              <p className="text-sm text-text-body leading-relaxed">We deliver results and provide ongoing support to ensure your legal matters are fully resolved.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Let's Work Together</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Schedule a consultation to discuss how we can assist with your legal needs.</p>
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
