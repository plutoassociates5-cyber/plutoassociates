import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedFaqs } from '../knowledge/faqEngine';
import { getPublishedServices } from '../services/store';
import { getPracticeAreas } from '../utils/contentStore';
import { getPublishedArticles } from '../seo';
import { answerFromKnowledgeBase } from '../knowledge/faqAssistant';

const QUICK_PROMPTS = [
  'How do I register a company in Nepal?',
  'What does a divorce cost and take?',
  'How do I register a trademark?',
  'Can foreigners buy property in Nepal?',
  'How do I apply for bail?',
];

function markdownish(text) {
  return String(text || '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>')
    .replace(/\n/g, '<br />');
}

const stripHtml = (v) => String(v || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function AssistantAvatar() {
  return (
    <span className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-sm shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2a3 3 0 013 3v1H9V5a3 3 0 013-3zM6 7h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2zm3 11a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-3.5-7L7 15h10l-4.5-4z"/></svg>
    </span>
  );
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const kb = useMemo(() => {
    if (typeof window === 'undefined') return { faqs: [], services: [], areas: [], articles: [] };
    return {
      faqs: getPublishedFaqs(),
      services: getPublishedServices(),
      areas: getPracticeAreas(),
      articles: getPublishedArticles(),
    };
  }, []);

  const welcome = useMemo(() => ({
    id: 'welcome',
    role: 'assistant',
    text: "Welcome to Pluto Associates' legal assistant. Ask me about Nepali law, our services or a specific matter, and I'll answer from our knowledge base — and search the web when needed.",
  }), []);

  useEffect(() => {
    if (!open || messages.length) return;
    setMessages([welcome]);
  }, [open, messages.length, welcome]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Enter' && !e.shiftKey && messages.length === 1) send(messages[0]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, messages]);

  async function send(questionOverride) {
    const q = String(questionOverride || input).trim();
    if (!q || busy) return;
    setInput('');
    setError('');

    const userMsg = { id: 'u-' + Date.now(), role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    const local = answerFromKnowledgeBase(q, kb, typeof window !== 'undefined' ? window.location.origin : '');
    const localAnswer = {
      id: 'a-' + Date.now(),
      role: 'assistant',
      text: local.answer.text,
      intro: local.answer.intro,
      sources: local.answer.sources,
      faqs: local.recommended.faqs,
      areas: local.recommended.areas,
      services: local.recommended.services,
      articles: local.recommended.articles,
      match: local.matched,
    };

    setMessages((prev) => [...prev, localAnswer]);

    let enriched = null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, faqs: local.recommended.faqs }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok && data.answer && data.answer.text) enriched = data;
      }
    } catch {
      enriched = null;
    }

    if (enriched) {
      const en = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        text: enriched.answer.text,
        intro: 'Web & AI search result:',
        sources: (enriched.sources || enriched.searched || []).filter(Boolean).slice(0, 4),
        faqs: local.recommended.faqs,
        areas: local.recommended.areas,
        services: local.recommended.services,
        articles: local.recommended.articles,
        match: { hasAi: true, ...local.matched },
      };
      setMessages((prev) => [...prev.slice(0, -1), en]);
    }
    setBusy(false);
  }

  function toggle() {
    setOpen((v) => {
      document.body.style.overflow = v ? '' : 'hidden';
      return !v;
    });
  }

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  const hasRecommendations = useMemo(() => {
    const last = messages[messages.length - 1];
    return last && (last.faqs?.length || last.areas?.length || last.services?.length || last.articles?.length);
  }, [messages]);

  return (
    <>
      <button
        onClick={toggle}
        aria-label={open ? 'Close legal assistant' : 'Open Pluto Associates legal assistant'}
        className={`fixed bottom-6 sm:bottom-8 left-4 sm:left-8 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-none ${
          open ? 'bg-navy text-gold' : 'bg-gold text-navy'
        }`}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M12 2a3 3 0 013 3v1H9V5a3 3 0 013-3zM6 7h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2zm3 11a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zm-3.5-7L7 15h10l-4.5-4z"/></svg>
        )}
      </button>

      <div
        className={`fixed bottom-24 sm:bottom-28 left-4 sm:left-8 z-[9998] w-[calc(100vw-2rem)] max-w-[400px] transition-all duration-300 ease-out ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Pluto Associates legal assistant"
        aria-hidden={!open}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-light-gray overflow-hidden flex flex-col max-h-[68vh]">
          <div className="flex items-center gap-3 px-5 py-4 bg-navy text-white">
            <span className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-lg shrink-0">⚖</span>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base font-semibold">Legal Assistant</div>
              <div className="text-[0.7rem] text-white/60">Pluto Associates · answers from our knowledge base + live search</div>
            </div>
            <span className="text-[0.62rem] text-gold bg-gold/15 px-2 py-1 rounded-full whitespace-nowrap">Beta</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 public-scroll bg-[#fbfbfc]">
            <div className="mb-6">
              <div className="flex items-start gap-2.5">
                <AssistantAvatar />
                <div className="bg-white border border-light-gray rounded-2xl rounded-tl-md px-4 py-3 text-sm text-text-body leading-relaxed shadow-sm">
                  {welcome.text}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pl-10">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="text-xs text-navy bg-off-white border border-light-gray px-3 py-1.5 rounded-full cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {messages.filter((m) => m.id !== 'welcome').map((m) => (
              <div key={m.id} className="mb-4">
                {m.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-navy text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed max-w-[85%]">{m.text}</div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <AssistantAvatar />
                    <div className="flex-1 min-w-0">
                      {m.intro && <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-light mb-1">{m.intro}</div>}
                      <div
                        className="bg-white border border-light-gray rounded-2xl rounded-tl-md px-4 py-3 text-sm text-text-body leading-relaxed shadow-sm [&_.chat-link]:text-teal [&_.chat-link]:underline"
                        dangerouslySetInnerHTML={{ __html: markdownish(m.text) }}
                      />

                      {m.match && m.match.hasAi && m.sources?.length > 0 && (
                        <div className="mt-2 pl-1">
                          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-text-light mb-1">Sources</div>
                          <ul className="list-none p-0 m-0 flex flex-col gap-1">
                            {m.sources.map((s, i) => (
                              <li key={i}>
                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal no-underline hover:underline">{s.title || s.url}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-2 pl-1 flex flex-wrap gap-2">
                        {m.faqs?.length > 0 && (
                          <Link to="/faq" className="text-xs bg-gold/10 text-gold-dark border border-gold/25 px-3 py-1.5 rounded-full no-underline hover:bg-gold/20 transition-colors">❓ FAQs ({m.faqs.length})</Link>
                        )}
                        {m.areas?.length > 0 && (
                          <Link to="/practice-areas" className="text-xs bg-navy/5 text-navy border border-navy/15 px-3 py-1.5 rounded-full no-underline hover:bg-navy/10 transition-colors">🌍 Practice Areas ({m.areas.length})</Link>
                        )}
                        {m.services?.length > 0 && (
                          <Link to="/services" className="text-xs bg-navy/5 text-navy border border-navy/15 px-3 py-1.5 rounded-full no-underline hover:bg-navy/10 transition-colors">📚 Services ({m.services.length})</Link>
                        )}
                        {m.articles?.length > 0 && (
                          <Link to="/publications" className="text-xs bg-navy/5 text-navy border border-navy/15 px-3 py-1.5 rounded-full no-underline hover:bg-navy/10 transition-colors">📰 Insights ({m.articles.length})</Link>
                        )}
                      </div>

                      {m.faqs?.length > 0 && (
                        <div className="mt-2 pl-1 flex flex-col gap-1">
                          {m.faqs.slice(0, 2).map((f) => (
                            <Link
                              key={f.id}
                              to={f.href.replace(typeof window !== 'undefined' && window.location.origin, '') || '/faq'}
                              className="text-xs text-text-body no-underline border-l-2 border-gold/40 bg-white px-3 py-2 rounded-r-lg hover:bg-gold/5 transition-colors"
                            >
                              <span className="font-semibold text-navy">{f.question.slice(0, 70)}{f.question.length > 70 ? '…' : ''}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex items-start gap-2.5 mb-4">
                <AssistantAvatar />
                <div className="bg-white border border-light-gray rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <span className="inline-flex gap-1.5">
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}

            {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

            {!hasRecommendations && messages.length > 1 && (
              <div className="text-center text-xs text-text-light mt-4">
                <Link to="/faq" className="text-gold-dark no-underline hover:underline">Browse all FAQs</Link>
                <span className="mx-2">·</span>
                <Link to="/contact" className="text-gold-dark no-underline hover:underline">Ask our team</Link>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 px-4 py-3 border-t border-light-gray bg-white"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Nepali law…"
              aria-label="Ask the legal assistant"
              className="flex-1 bg-transparent border border-light-gray rounded-full px-4 py-2.5 text-sm text-navy outline-none focus:border-gold placeholder:text-text-light"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center cursor-pointer border-none hover:bg-navy hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}