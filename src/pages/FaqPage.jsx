import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { getFaqs, getPracticeAreas } from '../utils/contentStore';
import hero1 from '../assets/hero-1.jpeg';

export default function FaqPage() {
  const [open, setOpen] = useState({});
  const faqs = getFaqs();
  const areas = getPracticeAreas();

  const general = faqs.filter((f) => f.area === 'general');
  const areaFaqs = faqs.filter((f) => f.area !== 'general');
  const groupedAreas = areas
    .map((a) => ({ area: a, items: areaFaqs.filter((f) => f.area === a.id) }))
    .filter((g) => g.items.length > 0);

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById('faq-' + id)?.scrollIntoView({ behavior: 'smooth' });
    };
    onHash();
  }, []);

  const FAQAccordion = ({ list }) => (
    <div className="flex flex-col gap-3">
      {list.map((f) => {
        const isOpen = !!open[f.id];
        return (
          <div key={f.id} id={`faq-${f.id}`} className="bg-white border border-light-gray rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggle(f.id)}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 bg-transparent border-none cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-navy text-base leading-snug group-hover:text-gold">{f.question}</span>
              <span className={`w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-text-body leading-relaxed border-t border-light-gray pt-4">{f.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <PublicNavbar />

      <section className="relative h-[45vh] min-h-[300px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-white/75 max-w-2xl mx-auto px-4">Quick answers to the questions our clients ask most often.</p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#f6f7f8]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-4 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5 reveal-anim">Help Centre</span>
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] text-navy leading-tight mb-4 font-semibold reveal-anim">Everything You Need to Know</h2>
            <p className="text-base text-text-light leading-relaxed reveal-anim">Can't find your answer? Our team is happy to help directly.</p>
          </div>

          {general.length > 0 && (
            <div className="mb-12">
              <h3 className="font-serif text-xl text-navy mb-5 flex items-center gap-2.5"><span className="w-10 h-10 rounded-xl bg-gold text-navy flex items-center justify-center text-lg shrink-0">💬</span> General</h3>
              <FAQAccordion list={general} />
            </div>
          )}

          {groupedAreas.map(({ area, items }) => (
            <div key={area.id} id={`area-${area.id}`} className="mb-12">
              <h3 className="font-serif text-xl text-navy mb-5 flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-lg shrink-0">{area.icon}</span>
                <span>{area.title}</span>
              </h3>
              <FAQAccordion list={items} />
              <Link to={`/practice-areas/${area.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gold no-underline border-b-2 border-gold mt-4 hover:gap-3 transition-all">Visit this practice area →</Link>
            </div>
          ))}

          {faqs.length === 0 && <p className="text-text-light text-center py-10">FAQs will appear here soon.</p>}

          <div className="bg-navy text-white rounded-2xl p-8 text-center mt-6 reveal-anim">
            <h3 className="font-serif text-xl mb-2">Still have questions?</h3>
            <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">Reach out and we will get back to you with clear, practical advice.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300">Contact Us →</Link>
              <a href="tel:+977-9802356987" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">Call Us Now</a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}