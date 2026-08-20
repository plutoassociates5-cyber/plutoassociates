/**
 * FAQ legal-assistant engine for the Pluto Associates chatbot.
 *
 * Pure, framework-agnostic retrieval that answers a user's question using the
 * site's own knowledge base (FAQs, services, practice areas, publications) and
 * recommends the best-matching entries with related keywords. No API keys are
 * needed: this runs entirely in the browser on the same seed data the pages
 * render, so the chatbot answer is always available offline/on static hosting.
 * An AI/web-search enrichment happens separately in the Cloudflare Function
 * `functions/api/chat.js`; this module stays dependency-free and synchronous.
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for',
  'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'can',
  'could', 'would', 'should', 'will', 'shall', 'may', 'might', 'must', 'do',
  'does', 'did', 'how', 'what', 'why', 'when', 'where', 'which', 'who', 'whom',
  'whose', 'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'my', 'your',
  'our', 'their', 'his', 'her', 'this', 'that', 'these', 'those', 'there',
  'from', 'as', 'if', 'not', 'no', 'so', 'than', 'about', 'into', 'over',
  'under', 'between', 'during', 'through', 'out', 'up', 'down', 'off', 'again',
]);

function stripHtml(v) {
  return String(v || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(text) {
  const out = new Map();
  String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .forEach((w) => {
      if (w.length > 2 && !STOPWORDS.has(w)) out.set(w, (out.get(w) || 0) + 1);
    });
  return out;
}

function score(question, hay) {
  const q = tokens(question);
  const body = tokens(hay);
  if (!q.size) return 0;
  let overlap = 0;
  q.forEach((count, word) => {
    const b = body.get(word) || 0;
    if (b > 0) overlap += Math.min(count, b);
  });
  const exactPhrase = stripHtml(hay).toLowerCase().includes(stripHtml(question).toLowerCase()) ? 1.5 : 1;
  return (overlap / q.size) * exactPhrase;
}

// FAQ fields weighted by relevance: question hits count most, answer and tags
// still contribute so broad queries still surface useful detail pages.
function faqScore(question, f) {
  return (
    score(question, f.question) * 1.0 +
    score(question, f.answer) * 0.5 +
    score(question, (f.tags || []).join(' ')) * 0.25 +
    (f.searchWeight || 5) / 100
  );
}

function normalize(item) {
  return {
    id: item.id || item.slug,
    slug: item.slug,
    title: item.question || item.title || item.name,
    category: item.category || 'general',
    keywords: item.tags || item.metaKeywords?.split(',').map((s) => s.trim()) || [],
  };
}

function toFaqCard(f, baseUrl) {
  const anchor = f.slug ? `#faq-${f.slug}` : '';
  return {
    id: f.id,
    question: f.question,
    answer: stripHtml(f.answer),
    category: f.category,
    keywords: (f.tags || []).slice(0, 5),
    href: `${baseUrl}/faq${anchor}`,
    faqHref: `${baseUrl}/faq`,
  };
}

function toAreaCard(a) {
  return {
    id: a.id,
    title: a.title || a.name,
    href: `/practice-areas/${a.id}#faqs`,
  };
}

function toServiceCard(s) {
  return { id: s.id || s.slug, name: s.name, href: `/services/${s.slug}` };
}

function toArticleCard(a) {
  return { id: a.slug, title: a.title, href: `/publications/${a.slug}` };
}

function toTeamCard(t) {
  return {
    id: t.id,
    name: t.name,
    designation: t.designation || 'Legal Professional',
    focus: t.focus || t.bio || '',
    href: '/teams',
  };
}

function cleanDashes(v) {
  return String(v || '')
    .replace(/\s+–\s+/g, ' to ')
    .replace(/\s+—\s+/g, ', ');
}

function teamAnswer(q, team) {
  const top = team[0];
  const intro = `Our team includes ${team.map((t) => `${t.name}, ${t.designation}`).join('; ')}.`;
  const focus = top.focus ? ` ${top.name} focuses on ${cleanDashes(top.focus)}.` : '';
  return {
    sources: ['Team'],
    text: intro + focus,
    intro: 'Our team:',
  };
}

function contactAnswer(s) {
  const bits = [
    s.name ? `${s.name}${s.tagline ? ', ' + cleanDashes(s.tagline) : ''}` : '',
    s.address ? cleanDashes(s.address) : '',
    s.phone ? `Phone: ${s.phone}` : '',
    s.email ? `Email: ${s.email}` : '',
    s.whatsapp ? `WhatsApp: ${s.whatsapp}` : '',
    s.hours ? `Office hours: ${cleanDashes(s.hours)}` : '',
  ].filter(Boolean);
  return {
    sources: ['Contact'],
    text: bits.join('. ') + '.',
    intro: 'Contact details:',
  };
}

function aboutAnswer(s, homepage) {
  const headline = homepage && homepage.hero && homepage.hero.headline;
  const body = [
    headline ? cleanDashes(headline) : '',
    s.footerAbout ? cleanDashes(s.footerAbout) : (s.tagline ? cleanDashes(s.tagline) : 'Full-service law firm based in Kathmandu, Nepal.'),
  ].filter(Boolean).join(' ');
  return {
    sources: ['About'],
    text: body,
    intro: 'About Pluto Associates:',
  };
}

/**
 * Answer a user question from the site knowledge base.
 * @param {string} question
 * @param {object} kb — { faqs, services, areas, articles } (raw, non-normalized)
 * @param {string} baseUrl — absolute or relative site root for FAQ deep links
 * @returns {{ answer, recommended, relatedKeywords, links, matched? }}
 */
export function answerFromKnowledgeBase(question, kb = {}, baseUrl = '') {
  const q = String(question || '').trim();
  const bin = { faqs: [], services: [], areas: [], articles: [], team: [] };

  const faqs = (kb.faqs || []).filter((f) => f.status === 'published');
  const bestFaqs = faqs
    .map((f) => ({ f, s: faqScore(q, f) }))
    .filter((r) => r.s > 0.15)
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);

  if (bestFaqs.length) {
    const top = bestFaqs[0];
    bin.faqs = bestFaqs.map((r) => toFaqCard(r.f, baseUrl));
    const extra = faqs
      .map((f) => ({ f, s: (f.tags || []).filter((t) => tokens(q).has(t)).length / Math.max(1, tokens(q).size) }))
      .filter((r) => r.s > 0 && !bin.faqs.some((c) => c.id === r.f.id))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3);
    bin.faqs = bin.faqs.concat(extra.map((r) => toFaqCard(r.f, baseUrl)));
  }

  const services = (kb.services || []).filter((s) => s.status === 'published');
  bin.services = services
    .map((s) => ({ s, sc: score(q, `${s.name} ${s.shortDescription || ''} ${(s.tags || []).join(' ')}`) }))
    .filter((r) => r.sc > 0.25)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 3)
    .map((r) => toServiceCard(r.s));

  const areas = (kb.areas || []).filter(Boolean);
  bin.areas = areas
    .map((a) => ({ a, sc: score(q, `${a.title || ''} ${a.heading || ''} ${a.desc || ''} ${(a.highlights || []).join(' ')}`) }))
    .filter((r) => r.sc > 0.2)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 3)
    .map((r) => toAreaCard(r.a));

  const articles = (kb.articles || []).filter((a) => a.status === 'published');
  bin.articles = articles
    .map((a) => ({ a, sc: score(q, `${a.title} ${(a.excerpt || '').toString()} ${a.category || ''} ${(a.tags || []).join(' ')}`) }))
    .filter((r) => r.sc > 0.2)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, 3)
    .map((r) => toArticleCard(r.a));

  const lawyers = (kb.lawyers || []).filter(Boolean);
  const teamScored = lawyers
    .map((l) => ({ l, sc: score(q, `${l.name} ${l.designation || ''} ${l.focus || ''} ${l.bio || ''} pluto associates legal team lawyer lawyers advocate advocates attorney attorneys legal associate associates bar`) }))
    .filter((r) => r.sc > 0.12)
    .sort((a, b) => b.sc - a.sc);
  bin.team = teamScored.slice(0, 4).map((r) => toTeamCard(r.l));

  const settings = kb.settings || {};
  const homepage = kb.homepage || {};
  const lq = q.toLowerCase();
  const teamIntent = /\b(lawyer|advocate|attorney|barrister|legal associate|associate|partner|solicitor|team member|our team|staff)\b/.test(lq) || (/\bwho (is|are)\b/.test(lq) && bin.team.length > 0);
  const contactIntent = /\b(contact|phone|email|address|location|office|reach|call|whatsapp|hours|where are you)\b/.test(lq);
  const aboutIntent =
    (lq.includes('pluto') || lq.includes('your firm') || lq.includes('your company') ||
     lq.includes('who are you') || lq.includes('what do you do')) &&
    !/(register a company|company registration|divorce|trademark|visa|bail|property|incorporat|how much|cost|charge|fee)/.test(lq);

  const relatedKeywords = Array.from(new Set(
    (bin.faqs.length ? bin.faqs[0].keywords : [])
      .concat(bin.services.map((s) => s.name))
      .concat(bin.areas.map((a) => a.title))
      .concat(bin.articles.map((a) => a.title))
      .concat(bin.team.map((t) => t.name)),
  )).filter(Boolean).slice(0, 8);

  // Pick the single best source. Compare like-for-like: how strongly the
  // query matches a FAQ *question* versus an article *title*. A precise FAQ
  // question match is the strongest answer, but a strongly-matching article
  // title (e.g. "cost of divorce" vs a company-registration cost FAQ) should win.
  const bestFaqItem = bin.faqs[0]
    ? faqs.find((f) => f.id === bin.faqs[0].id) || {}
    : null;
  const bestFaqStrong = bestFaqItem ? score(q, bestFaqItem.question || '') : 0;
  const bestArticleTitle = bin.articles[0] ? score(q, bin.articles[0].title || '') : 0;
  const bestTeamScore = teamScored[0] ? teamScored[0].sc : 0;

  const teamStrong = teamIntent && bin.team.length > 0 && bestTeamScore >= 0.12;
  const contactStrong = contactIntent && (settings.phone || settings.email || settings.address);
  const aboutStrong = aboutIntent && (settings.footerAbout || settings.tagline || homepage.hero);
  const personIntent = /\bwho (is|are)\b|who 's|\bmeet\b|\bhire\b/i.test(lq);

  let answer;
  if (bestFaqItem && bestFaqStrong >= 0.9 && bestFaqStrong >= bestArticleTitle && !(personIntent && teamStrong)) {
    answer = {
      sources: ['FAQ'],
      text: bin.faqs[0].answer,
      intro: `This is answered in our legal knowledge centre: ${bin.faqs[0].question}`,
    };
  } else if (bin.articles[0] && bestArticleTitle >= 0.9 && bestArticleTitle > bestFaqStrong) {
    answer = {
      sources: ['Insight'],
      text: `Our article "${bin.articles[0].title}" covers this in depth. Open it for the full walkthrough, timelines and requirements.`,
      intro: 'Recommended reading from Pluto Associates:',
    };
  } else if (teamStrong) {
    answer = teamAnswer(q, bin.team);
  } else if (contactStrong) {
    answer = contactAnswer(settings);
  } else if (aboutStrong) {
    answer = aboutAnswer(settings, homepage);
  } else if (bestFaqItem) {
    answer = {
      sources: ['FAQ'],
      text: bin.faqs[0].answer,
      intro: `This is answered in our legal knowledge centre: ${bin.faqs[0].question}`,
    };
  } else if (bin.services.length || bin.areas.length) {
    const targets = [bin.services[0]?.name, bin.areas[0]?.title].filter(Boolean);
    answer = {
      sources: ['Practice Area', 'Service'],
      text: `Pluto Associates handles ${targets.join(' and ') || 'this matter'} for businesses, investors and individuals across Nepal. Our senior partners assess the specifics of your case and advise on the practical next steps, including documentation, timelines, costs and compliance.`,
      intro: targets.length ? `This appears related to ${targets.join(' and ')}.` : '',
    };
  } else {
    answer = {
      sources: [],
      text: "I couldn't find a specific match in our knowledge base for that. Pluto Associates provides focused legal advice on a wide range of matters. You can raise this with our team directly for a tailored answer.",
      intro: '',
    };
  }

  return {
    answer,
    recommended: {
      faqs: bin.faqs.slice(0, 3),
      services: bin.services,
      areas: bin.areas,
      articles: bin.articles,
      team: bin.team.slice(0, 3),
    },
    relatedKeywords,
    links: aggregateLinks(bin),
    matched: {
      hasFaq: bin.faqs.length > 0,
      hasService: bin.services.length > 0,
      hasArea: bin.areas.length > 0,
      hasArticle: bin.articles.length > 0,
      hasTeam: bin.team.length > 0,
    },
  };
}

function aggregateLinks(bin) {
  return {
    faq: bin.faqs.length ? { label: 'FAQs', href: '/faq', count: bin.faqs.length } : null,
    practice: bin.areas.length ? { label: 'Practice Areas', href: '/practice-areas', count: bin.areas.length } : null,
    services: bin.services.length ? { label: 'Our Services', href: '/services', count: bin.services.length } : null,
    publications: bin.articles.length ? { label: 'Publications', href: '/publications', count: bin.articles.length } : null,
    team: bin.team.length ? { label: 'Our Team', href: '/teams', count: bin.team.length } : null,
  };
}