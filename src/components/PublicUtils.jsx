import { useState, useEffect } from 'react';

export function WhatsAppPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  return (
    <>
      <div className={`whatsapp-popup${show ? ' show' : ''}`}>
        <button className="whatsapp-popup-close" onClick={dismiss}>✕</button>
        <a href="https://wa.me/9779802356987" target="_blank" rel="noopener noreferrer" className="whatsapp-popup-inner">
          <span style={{ fontSize: '1.4rem' }}>💬</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '.85rem' }}>Chat with us!</div>
            <div style={{ fontSize: '.75rem', opacity: 0.9 }}>We reply within minutes</div>
          </div>
        </a>
      </div>

      <a
        href="https://wa.me/9779802356987"
        target="_blank"
        rel="noopener noreferrer"
        className={`whatsapp-popup whatsapp-floating${showFloat ? ' show' : ''}`}
        style={show ? { display: 'none' } : {}}
      >
        <div className="whatsapp-popup-inner">
          <span style={{ fontSize: '1.5rem' }}>💬</span>
        </div>
      </a>
    </>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`back-to-top${show ? ' show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.public-page .reveal, .public-page .reveal-left, .public-page .reveal-right');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}