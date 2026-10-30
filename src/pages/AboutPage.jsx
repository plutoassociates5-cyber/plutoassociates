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
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="reveal-left-anim">
              <img src={aboutimg} alt="Pluto Associates legal consultants in Kathmandu, Nepal" title="Pluto Associates law firm in Nepal" loading="lazy" className="w-full h-[350px] lg:h-[500px] object-cover" />
            </div>
            <div className="reveal-right-anim">
              <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4">Our Story</div>
              <h2 className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] text-navy leading-tight mb-4">Practical Legal Advice. A Commitment to Your Interests.</h2>
              <p className="mb-5 text-text-body leading-relaxed">Established in 2003 by Adv. Sudeep Nepal, Pluto Associates was founded on a simple belief: effective legal counsel begins with understanding people, their challenges, and the goals they want to achieve.</p>
              <p className="mb-5 text-text-body leading-relaxed">Based in Nepal, we provide legal advisory and representation services to individuals, businesses, and organizations navigating a wide range of legal matters. Our approach combines a thorough understanding of Nepal's legal framework with a practical perspective on the commercial, professional, and personal considerations behind every legal issue.</p>
              <p className="mb-5 text-text-body leading-relaxed">We recognize that every client comes to us with a different set of circumstances. Whether navigating a business transaction, addressing a dispute, managing regulatory obligations, or seeking guidance on a personal legal matter, our focus remains the same: to understand the situation clearly, explain the available options, and help clients make informed decisions.</p>
              <p className="mb-5 text-text-body leading-relaxed">Since our establishment, we have continued to develop our practice across multiple areas of law, guided by professional responsibility, careful legal analysis, and the trust our clients place in us.</p>
              <p className="mb-5 text-text-body leading-relaxed">At Pluto Associates, we believe good legal service is not simply about knowing the law. It is about applying it thoughtfully, communicating clearly, and standing by our clients throughout the process.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Values</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-4 font-semibold text-center">Our Mission &amp; Core Values</h2>
          <p className="text-base text-text-light max-w-[640px] leading-relaxed mx-auto mb-12 text-center">
            The Principles Behind Our Practice. Our work is guided by the principles that matter most in a professional legal relationship: competence, integrity, clear communication, and a genuine commitment to our clients' interests.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <h3 className="font-serif text-xl text-navy mb-3">Excellence in Legal Practice</h3>
              <p className="text-sm text-text-body leading-relaxed">We approach every matter with diligence, attention to detail, and a commitment to sound legal reasoning. We continuously develop our knowledge to provide advice that reflects applicable laws and the realities of each client's situation.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <h3 className="font-serif text-xl text-navy mb-3">Integrity &amp; Professional Responsibility</h3>
              <p className="text-sm text-text-body leading-relaxed">Trust is earned through honest advice, ethical conduct, and accountability. We communicate openly about legal risks, available options, and practical considerations, helping clients understand their position before making important decisions.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <h3 className="font-serif text-xl text-navy mb-3">A Client-Centered Approach</h3>
              <p className="text-sm text-text-body leading-relaxed">No two legal matters are exactly alike. We take the time to understand each client's concerns and objectives before recommending a course of action tailored to their circumstances.</p>
            </div>
            <div className="bg-white p-6 lg:p-8 border-t-[3px] border-gold shadow-sm reveal-anim">
              <h3 className="font-serif text-xl text-navy mb-3">Clear &amp; Accessible Communication</h3>
              <p className="text-sm text-text-body leading-relaxed">Legal matters can be complicated. We aim to make them easier to navigate by explaining legal concepts in straightforward language, keeping clients informed, and maintaining clear communication throughout our engagement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Affiliations</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-4 font-semibold text-center">Professional Affiliations</h2>
          <p className="text-base text-text-light max-w-[640px] leading-relaxed mx-auto mb-2 text-center">
            Connected to the Legal Profession. Professional engagement and continued learning are important parts of responsible legal practice. Our professional affiliations reflect our engagement with the wider legal community.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">Nepal Bar Association</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">Supreme Court Bar Association</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">SAARC Law Nepal Chapter</div>
            <div className="bg-white p-6 text-center border border-light-gray text-sm font-semibold text-navy leading-tight reveal-anim">International Bar Association</div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-off-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Process</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-4 font-semibold text-center">Our Approach</h2>
          <p className="text-base text-text-light max-w-[640px] leading-relaxed mx-auto mb-12 text-center">
            A Clear, Structured Approach to Every Matter
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">01</div>
              <h3 className="font-serif text-xl text-navy mb-3">Understanding Your Needs</h3>
              <p className="text-sm text-text-body leading-relaxed">Every engagement begins with a conversation. We listen to your concerns, understand the facts, and identify the legal questions and objectives that need to be addressed.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">02</div>
              <h3 className="font-serif text-xl text-navy mb-3">Assessing Your Options</h3>
              <p className="text-sm text-text-body leading-relaxed">We examine the relevant legal framework, evaluate potential risks, and explain the available courses of action. Where appropriate, we discuss the likely costs, timelines, and practical implications of each option.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">03</div>
              <h3 className="font-serif text-xl text-navy mb-3">Taking Informed Action</h3>
              <p className="text-sm text-text-body leading-relaxed">Once an approach is agreed upon, we work to implement it diligently. Whether the matter involves legal documentation, advisory services, negotiations, or representation, we keep you informed of important developments.</p>
            </div>
            <div className="text-center p-6 lg:p-8 bg-white shadow-sm reveal-anim">
              <div className="w-12 h-12 bg-gold text-navy font-bold rounded-full flex items-center justify-center mx-auto mb-4 text-lg">04</div>
              <h3 className="font-serif text-xl text-navy mb-3">Supporting You Through the Process</h3>
              <p className="text-sm text-text-body leading-relaxed">Legal matters often require continued attention beyond the initial advice or action. We remain focused on helping you navigate the next steps, understand the outcome, and address any further legal requirements within the scope of our engagement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-3 reveal-anim">Let's Discuss Your Legal Needs</h2>
          <p className="text-white/80 text-lg mb-2 reveal-anim font-medium">Clear Advice Starts With a Conversation.</p>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Whether you are seeking legal guidance for yourself, your business, or your organization, Pluto Associates is here to help you understand your options and move forward with greater clarity.</p>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Get in touch with our team to discuss your matter and explore how we can assist.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact/" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Contact Us →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
