import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { useToast } from '../context/ToastContext';
import { getSettings, addMessage, uid } from '../utils/contentStore';
import hero1 from '../assets/hero-1.jpeg';

export default function ContactPage() {
  const { toast } = useToast();
  const site = getSettings();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', area: 'general', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const sender = { name: `${form.fname} ${form.lname}`, email: form.email, phone: form.phone, area: form.area, subject: `Consultation Request - ${form.area}`, message: form.message };

    addMessage({ id: uid('msg'), ...sender, status: 'new', date: new Date().toISOString() });

    const formId = (site.formspreeId || '').trim();
    if (!formId) {
      setSubmitting(false);
      toast('⚠️ Form delivery is not configured yet. Your message was saved in the admin inbox.', 'err');
      setSent(true);
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sender.name,
          email: sender.email,
          phone: sender.phone,
          practiceArea: form.area,
          subject: sender.subject,
          message: sender.message,
          _replyto: sender.email,
          _subject: sender.subject,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err && err.errors && err.errors[0] && err.errors[0].message) || `Send failed (${res.status})`);
      }
      setSent(true);
      setForm({ fname: '', lname: '', email: '', phone: '', area: 'general', message: '' });
      toast('✓ Your message has been sent to ' + (site.email || 'our team') + '. We will reply within 24 hours.');
    } catch (err) {
      toast('⚠️ ' + (err.message || 'Could not send your message. Please email us directly at ' + site.email + '.'), 'err');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <PublicNavbar />

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Contact Us</h1>

        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-serif text-lg text-white mb-2">Visit Us</h3>
              <p className="text-sm text-white/70">{officeAddress(site)}</p>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-serif text-lg text-white mb-2">Call Us</h3>
              <a href={`tel:${site.phone}`} className="text-sm text-gold hover:underline">{site.phone}</a>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-serif text-lg text-white mb-2">Email Us</h3>
              <a href={`mailto:${site.email}`} className="text-sm text-gold hover:underline">{site.email}</a>
            </div>
            <div className="text-center p-6 lg:p-8 border border-white/10 reveal-anim">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-serif text-lg text-white mb-2">WhatsApp</h3>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gold hover:underline">Chat Now</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            <div className="reveal-anim">
              <h2 className="font-serif text-2xl text-navy mb-4">Request a Consultation</h2>
              <div className="bg-off-white p-4 rounded-md mb-6 text-[0.85rem] leading-relaxed">
                <strong>How consultations work:</strong><br />
                Fill out the form below and hit <strong>Send Message</strong> — your message goes straight to <strong>{site.email}</strong>.
                Our team will reply to your email within 24 hours.
                You can also email us directly or call <strong>{site.phone}</strong>.
              </div>
              <p className="text-sm text-text-body mb-6">Fill out the form and our team will get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label htmlFor="contact-fname" className="block text-xs font-semibold text-navy mb-1.5">First Name</label>
                    <input id="contact-fname" name="fname" type="text" value={form.fname} onChange={(e) => update('fname', e.target.value)} required autoComplete="given-name" className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contact-lname" className="block text-xs font-semibold text-navy mb-1.5">Last Name</label>
                    <input id="contact-lname" name="lname" type="text" value={form.lname} onChange={(e) => update('lname', e.target.value)} required autoComplete="family-name" className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-navy mb-1.5">Email</label>
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required autoComplete="email" className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-navy mb-1.5">Phone</label>
                    <input id="contact-phone" name="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required autoComplete="tel" className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="contact-area" className="block text-xs font-semibold text-navy mb-1.5">Practice Area</label>
                  <select id="contact-area" name="area" value={form.area} onChange={(e) => update('area', e.target.value)} className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold">
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
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-navy mb-1.5">Message</label>
                  <textarea id="contact-message" name="message" rows="5" value={form.message} onChange={(e) => update('message', e.target.value)} required className="w-full px-3.5 py-3 border border-mid-gray font-sans text-sm outline-none transition-all duration-200 focus:border-gold" />
                </div>
                <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Sending…' : sent ? '✓ Message Sent!' : 'Send Message →'}
                </button>
              </form>
            </div>

            <div className="reveal-anim">
              <div className="bg-off-white p-6 mb-6">
                <h3 className="font-serif text-base text-navy mb-3">🕐 Office Hours</h3>
                <p className="text-sm text-text-body mb-2"><strong>{site.hours}</strong></p>
                <p className="text-sm text-text-body mb-2"><strong>{site.hoursSat}</strong></p>
                <p className="text-sm text-text-light/70 mt-2 text-[0.78rem]">Weekend appointments available upon request.</p>
              </div>
              <div className="bg-off-white p-6 mb-6">
                <h3 className="font-serif text-base text-navy mb-3">👥 Speak with Partners</h3>
                <p className="text-sm text-text-body mb-2"><strong>Adv. Sudeep Nepal</strong><br />sudeep@plutoassociates.com</p>
                <p className="text-sm text-text-body mt-2"><strong>Associate Sujan Subedi</strong><br />sujan@plutoassociates.com</p>
              </div>
              <div className="bg-off-white p-6 mb-6">
                <h3 className="font-serif text-base text-navy mb-3">⚡ Quick Connect</h3>
                <p className="mb-2"><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-wp-blue text-sm">💬 WhatsApp</a></p>
                <p className="mb-2"><a href={`mailto:${site.email}`} className="text-wp-blue text-sm">✉️ Email Us</a></p>
                <p className="mb-2"><a href={`tel:${site.phone}`} className="text-wp-blue text-sm">📞 Call Now</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[300px] lg:h-[400px]">
        <iframe
          title="Pluto Associates Location"
          src={site.mapsEmbed}
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

function officeAddress(site) {
  const o = (site.brand && site.brand.office) || {};
  const parts = [o.officeName, o.street, o.city, o.province, o.postalCode, o.country].filter(Boolean);
  return parts.length ? parts.join(', ') : site.address;
}
