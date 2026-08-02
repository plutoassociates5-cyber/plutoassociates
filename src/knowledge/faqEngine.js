/**
 * FAQ engine for the Pluto Associates Legal Knowledge Centre.
 *
 * Pure, framework-agnostic logic so it runs identically in the browser, during
 * Node prerender and in build scripts. It consumes the seed database plus any
 * admin overrides, normalises every FAQ (slug, meta title/description, tags,
 * related practice areas/services, status, scheduling, search weight), builds
 * the knowledge graph and smart internal links, answers search, detects
 * duplicates, and emits structured data (schema.org) for SEO.
 */
import { getFaqs, saveFaqs, slugify } from '../utils/contentStore.js';
import { getServices } from '../services/store.js';
import { getFaqCategory } from './faqCategories.js';

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

export { slugify };

function stripHtml(v) {
  return String(v || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function words(str) {
  return new Set(stripHtml(str).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2));
}

function jaccard(a, b) {
  const sa = words(a);
  const sb = words(b);
  let both = 0;
  sa.forEach((w) => { if (sb.has(w)) both += 1; });
  return both / Math.max(1, sa.size + sb.size - both);
}

function uniqueSlug(question, all, ignoreId) {
  const base = slugify(stripHtml(question)) || 'faq';
  const taken = new Set(
    all
      .filter((f) => f.id !== ignoreId)
      .map((f) => (f.slug ? String(f.slug).toLowerCase() : slugify(f.question))),
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/* ------------------------------------------------------------------ */
/* Normalisation + metadata enrichment                                 */
/* ------------------------------------------------------------------ */

function makeTitle(q, ra) {
  const m = stripHtml(q).trim();
  return m ? `${m} | Pluto Associates Nepal` : 'Legal FAQ | Pluto Associates Nepal';
}

function makeDescription(q, a, ra) {
  const lead = stripHtml(q).trim();
  const body = stripHtml(a).trim();
  const head = body.length > 140 ? `${body.slice(0, 140).trim()}…` : body;
  const prefix = lead ? `${lead} ${ra.name ? `(${ra.name})` : ''} — ` : '';
  return (prefix + head).slice(0, 160);
}

function serviceLookup(map) {
  return (name) => {
    const hit = map.get(String(name).toLowerCase());
    return hit ? hit.slug : String(name).toLowerCase();
  };
}

function enrich(raw, all, settings, services) {
  const ra = getFaqCategory(raw.category) || {};
  const kw = raw.keywords || [];
  const toSlug = serviceLookup(new Map(services.map((s) => [String(s.name).toLowerCase(), s])));
  const fromCat = ra.tags || [];
  const tags = Array.from(new Set([...fromCat, ...kw])).slice(0, 8);
  const relatedServices = (raw.relatedServices || []).concat(
    (ra.services || []).map(toSlug),
  );

  return {
    ...raw,
    id: raw.id || 'faq-' + Math.random().toString(16).slice(2, 8),
    category: ra.id || 'general',
    tags,
    metaTitle: raw.metaTitle || makeTitle(raw.question, ra),
    metaDescription: raw.metaDescription || makeDescription(raw.question, raw.answer, ra),
    slug: raw.slug || uniqueSlug(raw.question, all, raw.id),
    relatedPracticeAreas: raw.relatedPracticeAreas || ra.practiceAreas || [],
    relatedServices: Array.from(new Set(relatedServices)),
    status: raw.status || 'published',
    searchWeight: raw.searchWeight ?? 5,
    updatedAt: raw.updatedAt || today(),
    source: raw.source || 'seed',
  };
}

/* ------------------------------------------------------------------ */
/* Public read API                                                     */
/* ------------------------------------------------------------------ */

export function getFaqList() {
  const services = getServices();
  const rawList = getFaqs();
  const enriched = [];
  for (const f of rawList) enriched.push(enrich(f, rawList, null, services));
  return enriched;
}

function enrichOne(f, all, services) {
  return enrich(f, all || getFaqs(), null, services);
}

/* ------------------------------------------------------------------ */
/* Eligibility (published + not future-scheduled)                      */
/* ------------------------------------------------------------------ */

export function getPublishedFaqs() {
  const now = Date.now();
  return getFaqList().filter((f) => {
    if (f.status !== 'published') return false;
    if (f.publishAt && new Date(f.publishAt).getTime() > now) return false;
    return true;
  });
}

export function getFaqBySlug(slug) {
  return getPublishedFaqs().find((f) => f.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export function searchFaqs(list, query, opts = {}) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return list;
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = list.map((f) => {
    const hay = [
      f.question, f.answer, (f.tags || []).join(' '),
      (f.metaDescription || ''), (f.category || ''),
    ].join(' ').toLowerCase();
    let hits = 0;
    terms.forEach((t) => { if (hay.includes(t)) hits += 1; });
    const relevance = hits / terms.length;
    const boosted = relevance * (1 + (f.searchWeight || 5) / 10);
    return { f, relevance: boosted };
  });
  const res = scored.filter((s) => s.relevance > 0).sort((a, b) => b.relevance - a.relevance);
  const limit = opts.limit || res.length;
  return res.slice(0, limit).map((r) => r.f);
}

/* ------------------------------------------------------------------ */
/* Internal linking / knowledge graph                                  */
/* ------------------------------------------------------------------ */

export function relatedFaqs(slug, list, limit = 4) {
  const all = list || getPublishedFaqs();
  const current = all.find((f) => f.slug === slug);
  if (!current) return [];
  const scored = all
    .filter((f) => f.id !== current.id)
    .map((f) => {
      let s = jaccard(current.question + ' ' + current.answer, f.question + ' ' + f.answer);
      const sharedCat = f.category === current.category ? 0.25 : 0;
      const sharedTag = (f.tags || []).filter((t) => (current.tags || []).includes(t)).length * 0.1;
      return { f, s: s + sharedCat + sharedTag };
    })
    .filter((r) => r.s > 0.02)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map((r) => r.f);
}

function practiceAreaName(id, areas) {
  const a = areas.find((x) => x.id === id);
  return { id, name: (a && (a.title || a.name)) || id };
}

export function buildGraph() {
  const list = getPublishedFaqs();
  const cats = new Map();
  list.forEach((f) => {
    if (!cats.has(f.category)) cats.set(f.category, []);
    cats.get(f.category).push(f.slug);
  });
  return { categories: cats, count: list.length };
}

/* ------------------------------------------------------------------ */
/* Structured data (schema.org)                                        */
/* ------------------------------------------------------------------ */

export function faqSchema(list, settings, webUrl) {
  const url = (webUrl || '').replace(/\/$/, '');
  const org = {
    '@type': 'Organization',
    name: settings.name || 'Pluto Associates',
    url: url || '/',
    logo: settings.logo ? { '@type': 'ImageObject', url: settings.logo } : undefined,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: url || '/' },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: (url || '') + '/faq' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: list.map((f) => ({
          '@type': 'Question',
          name: stripHtml(f.question),
          acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.answer) },
        })),
      },
    ],
  };
}

export function articleSchema(bulkFaqs, site, webUrl) {
  return faqSchema(bulkFaqs, site, webUrl);
}

/* ------------------------------------------------------------------ */
/* CRUD + status helpers used by the admin                             */
/* ------------------------------------------------------------------ */

export function saveAll(list) {
  const cleaned = list.map((f) => {
    const { } = f;
    return f;
  });
  saveFaqs(cleaned);
  return getFaqList();
}

export function upsert(faq) {
  const list = getFaqs();
  const idx = list.findIndex((f) => f.id === faq.id);
  const next = { ...faq, updatedAt: today() };
  if (idx >= 0) list[idx] = next;
  else list.push(next);
  saveFaqs(list);
  return getFaqList();
}

export function setStatuses(ids, status) {
  const list = getFaqs();
  const now = today();
  list.forEach((f) => { if (ids.includes(f.id)) { f.status = status; f.updatedAt = now; } });
  saveFaqs(list);
  return getFaqList();
}

export function removeFaqs(ids) {
  saveFaqs(getFaqs().filter((f) => !ids.includes(f.id)));
  return getFaqList();
}

export function duplicate(ids) {
  const src = getFaqs();
  const copy = [];
  src.forEach((f) => {
    if (!ids.includes(f.id)) return;
    copy.push({
      category: f.category,
      question: f.question,
      answer: f.answer,
      keywords: f.keywords ? [...f.keywords] : [],
      status: 'draft',
      source: 'duplicate',
    });
  });
  saveFaqs(src.concat(copy));
  return getFaqList();
}

/* ------------------------------------------------------------------ */
/* Duplicate detection                                                 */
/* ------------------------------------------------------------------ */

export function detectDuplicates(question, list = getFaqList(), threshold = 0.72) {
  const qKey = question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return list
    .map((f) => ({ f, sim: jaccard(qKey, f.question) }))
    .filter((r) => r.sim >= threshold)
    .sort((a, b) => b.sim - a.sim)
    .map((r) => ({ id: r.f.id, question: r.f.question, similarity: Math.round(r.sim * 100) }));
}

/* ------------------------------------------------------------------ */
/* Grouping for the public page                                        */
/* ------------------------------------------------------------------ */

export function groupByCategory(list) {
  const map = new Map();
  list.forEach((f) => {
    if (!map.has(f.category)) map.set(f.category, { category: getFaqCategory(f.category), items: [] });
    map.get(f.category).items.push(f);
  });
  return Array.from(map.values());
}

/* re-export for the admin editor */
export { saveFaqs, getFaqs };