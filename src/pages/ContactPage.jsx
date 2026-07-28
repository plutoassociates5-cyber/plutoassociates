import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
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
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast('Message Sent! We will get back to you shortly.');
    setForm({ fname: '', lname: '', email: '', phone: '', area: 'general', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="page-hero" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1>Contact Us</h1>
          <p className="breadcrumb">
            <Link to="/">Home</Link> / Contact
          </p>
        </div>
      </section>

      <section className="dark-section">
        <div className="container-wide">
          <div className="contact-cards">
            <div className="contact-card-item reveal">
              <div className="cci-icon">📍</div>
              <h4>Visit Us</h4>
              <p>Kathmandu, Nepal</p>
            </div>
            <div className="contact-card-item reveal">
              <div className="cci-icon">📞</div>
              <h4>Call Us</h4>
              <a href="tel:+977-9802356987">+977-9802356987</a>
            </div>
            <div className="contact-card-item reveal">
              <div className="cci-icon">✉️</div>
              <h4>Email Us</h4>
              <a href="mailto:info@plutoassociates.com">info@plutoassociates.com</a>
            </div>
            <div className="contact-card-item reveal">
              <div className="cci-icon">💬</div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer">Chat Now</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="contact-main">
            <div className="contact-form reveal">
              <h3>Request a Consultation</h3>
              <p className="form-sub">Fill out the form and our team will get back to you within 24 hours.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" value={form.fname} onChange={(e) => update('fname', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" value={form.lname} onChange={(e) => update('lname', e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Practice Area</label>
                  <select value={form.area} onChange={(e) => update('area', e.target.value)}>
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
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" value={form.message} onChange={(e) => update('message', e.target.value)} required />
                </div>
                <button type="submit" className="form-submit">
                  {sent ? '✓ Message Sent!' : 'Send Message →'}
                </button>
              </form>
            </div>

            <div className="contact-sidebar reveal">
              <div className="hours-box">
                <h4>🕐 Office Hours</h4>
                <p><strong>Sunday – Friday:</strong> 10:00 AM – 6:00 PM</p>
                <p><strong>Saturday:</strong> Closed</p>
                <p style={{ marginTop: '.5rem', fontSize: '.78rem' }}>Weekend appointments available upon request.</p>
              </div>
              <div className="hours-box">
                <h4>👥 Speak with Partners</h4>
                <p><strong>Adv. Sudeep Nepal</strong><br />sudeep@plutoassociates.com</p>
                <p style={{ marginTop: '.5rem' }}><strong>Adv. Ram Sharan Ghimire</strong><br />ram@plutoassociates.com</p>
              </div>
              <div className="hours-box">
                <h4>⚡ Quick Connect</h4>
                <p><a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--wp-blue)' }}>💬 WhatsApp</a></p>
                <p><a href="mailto:info@plutoassociates.com" style={{ color: 'var(--wp-blue)' }}>✉️ Email Us</a></p>
                <p><a href="tel:+977-9802356987" style={{ color: 'var(--wp-blue)' }}>📞 Call Now</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <iframe
          title="Pluto Associates Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2!2d85.324!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAxLjkiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1"
          allowFullScreen
          loading="lazy"
        />
      </section>

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Ready to Get Started?</h2>
          <p className="reveal">We're here to help with all your legal needs.</p>
          <div className="cta-btns reveal">
            <a href="tel:+977-9802356987" className="btn-primary">Call Us Now →</a>
            <a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" className="btn-secondary">WhatsApp</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
      <BackToTop />
    </div>
  );
}