import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero1 from '../assets/hero-1.jpeg';
import { getSettings } from '../utils/contentStore';
import {
  getPublishedFaqs, searchFaqs, relatedFaqs, groupByCategory, faqSchema,
} from '../knowledge/faqEngine';
import { getAllFaqCategories, getFaqCategory } from '../knowledge/faqCategories';

function FaqSchema({ list }) {
  const site = getSettings();
  const webUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const schema = JSON.stringify(faqSchema(list, site, webUrl));
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
  );
}

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [open, setOpen] = useState({});

  const all = getPublishedFaqs();
  const cats = getAllFaqCategories();

  const visible = useMemo(() => {
    let list = all;
    if (query.trim()) list = searchFaqs(all, query);
    if (activeCat !== 'all') list = list.filter((f) => f.category === activeCat);
    return list;
  }, [all, query, activeCat]);

  const grouped = useMemo(() => groupByCategory(activeCat === 'all' ? visible : visible), [visible]);
  const counts = useMemo(() => {
    const m = { all: all.length };
    all.forEach((f) => { m[f.category] = (m[f.category] || 0) + 1; });
    return m;
  }, [all]);

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  const openSlug = (slug) => {
    const f = all.find((x) => x.slug === slug);
    if (!f) return;
    setOpen((prev) => ({ ...prev, [f.id]: true }));
    setTimeout(() => {
      document.getElementById('faq-' + (f.slug || f.id))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 30);
  };

  const Accordion = ({ list }) => (
    <div className="flex flex-col gap-3">
      {list.map((f) => {
        const isOpen = !!open[f.id];
        const rel = relatedFaqs(f.slug, all, 3);
        const relatedCat = getFaqCategory(f.category);
        return (
          <div key={f.id} id={'faq-' + (f.slug || f.id)} className="bg-white border border-light-gray rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => toggle(f.id)} className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 bg-transparent border-none cursor-pointer group" aria-expanded={isOpen}>
              <span className="font-serif text-navy text-base leading-snug group-hover:text-gold">{f.question}</span>
              <span className={`w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="px-5 pb-5">
                  <div className="text-text-body leading-relaxed border-t border-light-gray pt-4">{f.answer}</div>

                  {(rel.length > 0 || relatedCat?.practiceAreas?.length) && (
                    <div className="mt-5 pt-4 border-t border-light-gray flex flex-col sm:flex-row sm:items-center gap-4">
                      {rel.length > 0 && (
                        <div>
                          <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-text-light mb-2">Keep reading</div>
                          <div className="flex flex-wrap gap-2">
                            {rel.map((r) => (
                              <button key={r.id} onClick={() => openSlug(r.slug || r.id)} className="text-xs text-gold bg-gold/5 border border-gold/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gold/10 transition-colors">{r.question.slice(0, 55)}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      {relatedCat?.practiceAreas?.length > 0 && (
                        <div className="sm:ml-auto shrink-0">
                          <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-text-light mb-2">Practice area</div>
                          <div className="flex flex-wrap gap-2">
                            {relatedCat.practiceAreas.map((pa) => (
                              <Link key={pa} to={'/practice-areas/' + pa} className="text-xs text-navy bg-navy/5 border border-navy/15 px-3 py-1.5 rounded-full no-underline hover:bg-navy/10 transition-colors">Explore →</Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  function getCategory(id) {
    return cats.find((c) => c.id === id);
  }

  return (
    <div>
      <PublicNavbar />
      <FaqSchema list={all} />

      <section className="relative flex items-center justify-center text-center bg-cover bg-center py-24 min-h-[340px]" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[60px] px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[3px] uppercase text-gold mb-4 px-4 py-1.5 border border-gold/30 rounded-full bg-gold/5">Legal Knowledge Centre</span>
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-4">Answers on Nepali law, plain and simple</h1>
          <p className="text-white/75 max-w-2xl mx-auto mb-7">Search hundreds of answers drafted for real questions — from company registration to property and disputes.</p>
          <div className="relative max-w-xl mx-auto">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search e.g. register a company, trademark, terminate employee…"
              className="w-full rounded-full border border-white/20 bg-white/10 backdrop-blur px-5 py-3.5 pr-28 text-white placeholder:text-white/60 outline-none focus:border-gold text-sm" />
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f6f7f8]">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* category filter chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button onClick={() => setActiveCat('all')} className={`text-xs px-4 py-2 rounded-full border transition-colors cursor-pointer ${activeCat === 'all' ? 'bg-navy text-white border-navy' : 'bg-white border-light-gray text-text-body hover:border-gold'}`}>All ({counts.all})</button>
            {cats.filter((c) => counts[c.id] > 0).map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} className={`text-xs px-4 py-2 rounded-full border transition-colors cursor-pointer ${activeCat === c.id ? 'bg-navy text-white border-navy' : 'bg-white border-light-gray text-text-body hover:border-gold'}`}>
                {c.icon} {c.name} ({counts[c.id]})
              </button>
            ))}
          </div>

          {grouped.map(({ category, items }) => (
            <div key={category.id} className="mb-10">
              <h3 className="font-serif text-xl text-navy mb-5 flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-lg shrink-0">{category.icon}</span>
                <span>{category.name}</span>
              </h3>
              <Accordion list={items} />
            </div>
          ))}

          {visible.length === 0 && (
            <div className="bg-white border border-light-gray rounded-2xl p-10 text-center">
              <p className="text-text-light mb-1">No answers match your search.</p>
              <p className="text-sm text-text-light">Try a different keyword, or ask us directly.</p>
            </div>
          )}

          <div className="bg-navy text-white rounded-2xl p-8 text-center mt-6">
            <h3 className="font-serif text-xl mb-2">Couldn't find your question?</h3>
            <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">Our team gives clear, practical answers over a short call or message.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300">Ask Our Team →</Link>
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