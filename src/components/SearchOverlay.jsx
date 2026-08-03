import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublishedServices } from '../services/store';
import { getPracticeAreas } from '../utils/contentStore';
import { getPublishedFaqs } from '../knowledge/faqEngine';
import { getPublishedArticles } from '../seo';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for',
  'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'how', 'what', 'why',
  'when', 'where', 'which', 'who', 'whom', 'from', 'your', 'our', 'we', 'you',
  'it', 'its', 'this', 'that', 'they', 'there', 'about', 'into', 'than', 'not',
]);

const SECTIONS = [
  { key: 'services', label: 'Services', icon: '📚', to: (s) => '/services/' + s.slug },
  { key: 'areas', label: 'Practice Areas', icon: '🌍', to: (a) => '/practice-areas/' + (a.slug || a.id) },
  { key: 'faqs', label: 'FAQs', icon: '❓', to: () => '/faq' },
  { key: 'articles', label: 'Insights', icon: '📰', to: (a) => '/publications/' + a.slug },
];

function tokensOf(q) {
  return q.toLowerCase().split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function score(text, toks) {
  const t = (text || '').toLowerCase();
  if (!t || !toks.every((tok) => t.includes(tok))) return 0;
  let s = 1;
  if (t.startsWith(toks[0])) s += 2;
  return s + toks.length;
}

function collect(results, key) {
  const rec = results[key];
  return rec && rec.length ? [{ key, items: rec.slice(0, 5) }] : [];
}

export default function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);
  const location = useLocation();
  const [query, setQuery] = useState('');

  const all = useMemo(() => {
    return {
      services: getPublishedServices(),
      areas: getPracticeAreas(),
      faqs: getPublishedFaqs(),
      articles: getPublishedArticles(),
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const timer = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(timer); document.body.style.overflow = prevOverflow; };
  }, [open]);

  useEffect(() => {
    if (open) onClose();
  }, [location.pathname, location.hash]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return { services: [], areas: [], faqs: [], articles: [] };
    const toks = tokensOf(q);
    if (!toks.length) return { services: [], areas: [], faqs: [], articles: [] };

    const rank = (list, text) =>
      list
        .map((item) => ({ item, s: score(text(item), toks) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.item);

    return {
      services: rank(all.services, (s) => `${s.name} ${s.shortDescription || ''} ${(s.tags || []).join(' ')}`),
      areas: rank(all.areas, (a) => `${a.title || a.name} ${a.heading || ''} ${a.short || ''}`),
      faqs: rank(all.faqs, (f) => `${f.question} ${f.answer}`),
      articles: rank(all.articles, (a) => `${a.title} ${a.excerpt || ''} ${a.category || ''}`),
    };
  }, [query, all]);

  const total = results.services.length + results.areas.length + results.faqs.length + results.articles.length;

  return (
    <div className={`fixed inset-0 z-[10050] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible'}`} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 mt-[12vh]">
        <div className="bg-white rounded-2xl shadow-2xl border border-light-gray overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-light-gray">
            <span className="text-lg leading-none text-text-light">🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, practice areas, FAQs & insights…"
              aria-label="Search site"
              className="flex-1 bg-transparent border-none outline-none font-sans text-base text-navy placeholder:text-text-light"
            />
            <button onClick={onClose} className="text-text-light text-sm bg-wp-gray px-2.5 py-1 rounded cursor-pointer border-none font-sans">Esc</button>
          </div>

          <div className="max-h-[55vh] overflow-y-auto">
            {query.trim().length < 2 && (
              <div className="px-6 py-12 text-center">
                <p className="text-3xl mb-3">🔎</p>
                <p className="font-serif text-navy text-lg mb-1">What are you looking for?</p>
                <p className="text-sm text-text-light">Search our services, practice areas, FAQs and legal insights. Press <kbd className="bg-wp-gray px-1.5 py-0.5 rounded text-xs">/</kbd> anytime to search.</p>
              </div>
            )}

            {query.trim().length >= 2 && total === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-3xl mb-3">🤔</p>
                <p className="font-serif text-navy text-lg mb-1">No results for “{query.trim()}”</p>
                <p className="text-sm text-text-light">Try a shorter keyword, or contact our team for guidance.</p>
                <Link to="/contact" onClick={onClose} className="inline-block mt-4 px-5 py-2.5 bg-gold text-navy text-sm font-semibold no-underline">Ask Us Instead</Link>
              </div>
            )}

            {query.trim().length >= 2 && total > 0 && (
              <div className="flex flex-col">
                {SECTIONS.map((meta) => {
                  const group = collect(results, meta.key)[0];
                  if (!group) return null;
                  return (
                    <div key={meta.key} className="border-t border-light-gray first:border-t-0">
                      <div className="px-6 pt-4 pb-1 text-[0.65rem] font-semibold uppercase tracking-[1.5px] text-text-light">
                        {meta.icon} {meta.label}
                      </div>
                      <ul className="list-none m-0 p-0">
                        {group.items.map((item) => (
                          <li key={meta.key + '-' + (item.slug || item.id)}>
                            <Link
                              to={meta.to(item)}
                              onClick={onClose}
                              className="flex items-start gap-3 px-6 py-3 no-underline hover:bg-gold/5 transition-colors"
                            >
                              <span className="text-base leading-none mt-0.5 shrink-0">{item.icon || meta.icon}</span>
                              <span className="min-w-0">
                                <span className="block font-serif text-navy text-sm leading-snug">{item.name || item.title || item.question}</span>
                                <span className="block text-xs text-text-light truncate mt-0.5">
                                  {(item.shortDescription || item.heading || item.answer || item.excerpt || item.category || '').replace(/<[^>]*>/g, '')}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-3 bg-[#f6f7f8] border-t border-light-gray text-[0.65rem] text-text-light">
            <span>Browse results by section</span>
            <span><kbd className="bg-white border border-light-gray px-1.5 py-0.5 rounded">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
