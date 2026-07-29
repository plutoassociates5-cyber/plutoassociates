import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { useToast } from '../context/ToastContext';
import hero1 from '../assets/hero-1.jpeg';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', area: 'general', message: '' });
  const [sent, setSent] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consultation Request - ${form.area} - ${form.fname} ${form.lname}`);
    const body = encodeURIComponent(
      `Name: ${form.fname} ${form.lname}\nEmail: ${form.email}\nPhone: ${form.phone}\nArea: ${form.area}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info@plutoassociates.com?subject=${subject}&body=${body}`;
    setSent(true);
    toast('Opening your email client to send the consultation request.');
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <PublicNavbar />

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Contact Us</h1>
          <p className="text-sm text-white/60">
            <Link to="/" className="text-white/60 hover:text-gold">Home</Link> / Contact
          </p>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-serif text-lg text-white mb-2">Visit Us</h4>
              <p className="text-sm text-white/70">Kathmandu, Nepal</p>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">📞</div>
              <h4 className="font-serif text-lg text-white mb-2">Call Us</h4>
              <a href="tel:+977-9802356987" className="text-sm text-gold hover:underline">+977-9802356987</a>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">✉️</div>
              <h4 className="font-serif text-lg text-white mb-2">Email Us</h4>
              <a href="mailto:info@plutoassociates.com" className="text-sm text-gold hover:underline">info@plutoassociates.com</a>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-serif text-lg text-white mb-2">WhatsApp</h4>
              <a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline">Chat Now</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div className="reveal-anim">
              <h3 className="font-serif text-2xl text-navy mb-4">Request a Consultation</h3>
              <div className="bg-off-white p-4 rounded-md mb-6 text-[0.85rem] leading-relaxed">
                <strong>How consultations work:</strong><br />
                Fill out the form below and it will open your email client with your details pre-filled.
                Send the email to <strong>info@plutoassociates.com</strong> and our team will reply within 24 hours.
                You can also email us directly or call <strong>+977-9802356987</strong>.
              </div>
              <p className="text-sm text-text-body mb-6">Fill out the form and our team will get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-navy mb-1.5">First Name</label>
                    <input type="text" value={form.fname} onChange={(e) => update('fname', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-navy mb-1.5">Last Name</label>
                    <input type="text" value={form.lname} onChange={(e) => update('lname', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-navy mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-navy mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-navy mb-1.5">Practice Area</label>
                  <select value={form.area} onChange={(e) => update('area', e.target.value)} className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold">
                    <option value="general">General Inquiry</option>
                    <option value="fdi">FDI & Investment</option>
                    <option value="corporate">Corporate Law</option>
                    <option value="energy">Energy Law</option>
                    <option value="banking">Banking & Finance</option>
                    <option value="litigation">Litigation</option>
                    <option value="ip">Intellectual Property</option>
                    <option value="labor">Labor & Employment</option>
                    <option value="realestate">Real Estate</option>
                    <option value="tax">Taxation</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-navy mb-1.5">Message</label>
                  <textarea rows="5" value={form.message} onChange={(e) => update('message', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">
                  {sent ? '✓ Message Sent!' : 'Send Message →'}
                </button>
              </form>
            </div>

            <div className="reveal-anim">
              <div className="bg-off-white p-6 mb-6">
                <h4 className="font-serif text-base text-navy mb-3">🕐 Office Hours</h4>
                <p className="text-sm text-text-body mb-2"><strong>Sunday – Friday:</strong> 10:00 AM – 6:00 PM</p>
                <p className="text-sm text-text-body mb-2"><strong>Saturday:</strong> Closed</p>
                <p className="text-sm text-text-light/70 mt-2 text-[0.78rem]">Weekend appointments available upon request.</p>
              </div>
              <div className="bg-off-white p-6 mb-6">
                <h4 className="font-serif text-base text-navy mb-3">👥 Speak with Partners</h4>
                <p className="text-sm text-text-body mb-2"><strong>Adv. Sudeep Nepal</strong><br />sudeep@plutoassociates.com</p>
                <p className="text-sm text-text-body mt-2"><strong>Associate Sujan Subedi</strong><br />sujan@plutoassociates.com</p>
              </div>
              <div className="bg-off-white p-6 mb-6">
                <h4 className="font-serif text-base text-navy mb-3">⚡ Quick Connect</h4>
                <p className="mb-2"><a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" className="text-wp-blue text-sm">💬 WhatsApp</a></p>
                <p className="mb-2"><a href="mailto:info@plutoassociates.com" className="text-wp-blue text-sm">✉️ Email Us</a></p>
                <p className="mb-2"><a href="tel:+977-9802356987" className="text-wp-blue text-sm">📞 Call Now</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[300px] lg:h-[400px]">
        <iframe
          title="Pluto Associates Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2!2d85.324!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAxLjkiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1"
          allowFullScreen
          loading="lazy"
          className="w-full h-full border-none"
        />
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Ready to Get Started?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">We're here to help with all your legal needs.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Call Us Now →</a>
            <a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">WhatsApp</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
