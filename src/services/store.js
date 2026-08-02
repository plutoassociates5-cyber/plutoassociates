/**
 * Services store — single, modular data layer for the Services CMS module.
 *
 * The store depends only on a "key/value" adapter (see adapters/local.js).
 * All business logic, seeding/merge of default services, CRUD, ordering and
 * scheduling live here. Because nothing touches storage directly, the module
 * can be moved to Cloudflare KV, D1 or any backend by swapping the adapter —
 * no change to the admin UI or public pages.
 *
 * Note: the local adapter is synchronous to stay consistent with the rest of
 * this static + localStorage CMS (and to keep prerender/SSR correct). Moving
 * to an async backend is a contained change inside this file + the adapter.
 */
import { localAdapter } from './adapters/local.js';

let adapter = localAdapter;

/** Swap the storage adapter (future-proofing for KV/D1/backend). */
export function configureAdapter(next) {
  adapter = next;
  cache = null;
}

export function uid(prefix = 'svc') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 64);
}

export function uniqueSlug(base, list, ignoreId) {
  const slug = slugify(base);
  const taken = new Set(list.filter((s) => s.id !== ignoreId).map((s) => s.slug.toLowerCase()));
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

const SERVICES_KEY = 'pluto_services';
const DELETED_KEY = 'pluto_services_deleted';
const CATS_KEY = 'pluto_service_categories';

function rawGet(key, fallback) {
  const v = adapter.getItem(key);
  try {
    return v != null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function rawSet(key, value) {
  adapter.setItem(key, JSON.stringify(value));
}

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const SEED_CATS = [
  { id: 'corporate', name: 'Corporate & Commercial' },
  { id: 'fdi', name: 'Foreign Direct Investment' },
  { id: 'compliance', name: 'Corporate Compliance' },
  { id: 'commercial', name: 'Commercial Transactions' },
  { id: 'tax', name: 'Tax & Regulatory Advisory' },
  { id: 'employment', name: 'Employment & Labour' },
  { id: 'ip', name: 'Intellectual Property' },
  { id: 'technology', name: 'Technology & Data Privacy' },
  { id: 'real-estate', name: 'Real Estate & Property' },
  { id: 'litigation', name: 'Litigation' },
  { id: 'criminal', name: 'Criminal Defence' },
  { id: 'arbitration', name: 'Arbitration & ADR' },
  { id: 'banking', name: 'Banking & Finance' },
  { id: 'ngo', name: 'NGO / INGO Compliance' },
  { id: 'advisory', name: 'Legal Advisory' },
  { id: 'documentation', name: 'Documentation & Notarization' },
];

const DEFAULT_WHY = [
  'Deep, specialist experience in the core of the matter',
  'Clear, practical drafting and commercially minded advice',
  'A senior partner leading every engagement',
  'Responsive service from briefing to final outcome',
];

const DEFAULT_PROCESS = [
  'Reach out and schedule an initial consultation',
  'We assess your matter and agree a scope and fee',
  'We execute a clear, structured plan with set timelines',
  'We deliver, review with you and support the outcome',
];

const DEFAULT_FAQS = [
  { q: 'How do I get started?', a: 'Reach out through the contact form and we will schedule an initial consultation to understand your matter and agree a clear next step.' },
  { q: 'How do you charge for this service?', a: 'Fees are agreed up-front and depend on the scope and complexity. We confirm a clear fee structure before starting work.' },
  { q: 'What information do you need to begin?', a: 'The relevant agreements, records or documents for your matter. As much context as you have helps us move faster.' },
];

const DEFAULT_DOCS =
  'Identification documents and any existing contracts, registrations or records relevant to your matter. We confirm the exact list during your consultation.';

/**
 * Compose the full default service catalogue from a compact spec so it stays
 * production-ready yet easy for a non-technical admin to edit afterwards.
 */
function buildSeed() {
  const spec = [
    ['Corporate Law', 'corporate', '⚖️', true],
    ['Company Registration & Incorporation', 'corporate', '🏢', true],
    ['Foreign Direct Investment (FDI)', 'fdi', '🌐', true],
    ['Corporate Compliance', 'compliance', '✅', true],
    ['Contract Drafting & Review', 'commercial', '📝', true],
    ['Commercial Transactions', 'commercial', '🤝', true],
    ['Mergers & Acquisitions', 'corporate', '🔀', true],
    ['Due Diligence', 'commercial', '🔍', true],
    ['Tax & Regulatory Advisory', 'tax', '📊', false],
    ['Employment & Labour Law', 'employment', '👥', false],
    ['Intellectual Property', 'ip', '💡', false],
    ['Technology & Data Privacy Law', 'technology', '💻', false],
    ['Real Estate & Property Law', 'real-estate', '🏠', false],
    ['Civil Litigation', 'litigation', '⚖️', false],
    ['Criminal Defence', 'criminal', '🛡️', false],
    ['Arbitration & ADR', 'arbitration', '🤝', false],
    ['Banking & Finance', 'banking', '🏦', false],
    ['NGO/INGO Legal Compliance', 'ngo', '🏛️', false],
    ['Legal Opinions', 'advisory', '📜', false],
    ['Documentation & Notarization', 'documentation', '💼', false],
  ];

  return spec.map(([name, category, icon, featured], i) => {
    const short = `${name} legal support delivered by the Pluto Associates team — combining regulatory depth with practical, commercially minded advice across Nepal.`;
    return {
      id: slugify(name),
      name,
      slug: slugify(name),
      category,
      icon,
      shortDescription: short,
      content:
        `<p>At Pluto Associates we deliver dependable ${name.toLowerCase()} support to businesses, investors and individuals in Nepal. Our team combines deep regulatory knowledge with a practical, business-first approach, so you receive advice that is both technically sound and commercially usable.</p>` +
        `<p>We begin by understanding your objectives and the specifics of your matter, then design a clear plan of action. From assessment and documentation to execution and ongoing support, you always have one dedicated point of contact keeping things on track.</p>`,
      bannerImage: '',
      featuredImage: '',
      ogImage: '',
      twitterCard: '',
      gallery: [],
      why: DEFAULT_WHY,
      process: DEFAULT_PROCESS,
      faqs: DEFAULT_FAQS,
      documents: DEFAULT_DOCS,
      timeline: [],
      pricing: '',
      related: [],
      tags: [],
      ctaLabel: 'Schedule Consultation',
      contactLabel: 'Contact Us',
      status: 'published',
      scheduledAt: '',
      featured: !!featured,
      showHome: i < 6,
      showMenu: i < 8,
      menuOrder: i + 1,
      seoTitle: `${name} | Pluto Associates Nepal`,
      seoDescription: short,
      keywords: `${name}, legal services Nepal, Pluto Associates law firm Kathmandu`,
      canonical: '',
      schemaJson: '',
      author: 'Adv. Sudeep Nepal',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  });
}

const SEED = buildSeed();
const SEED_IDS = new Set(SEED.map((s) => s.id));

/* ------------------------------------------------------------------ */
/* Reads (seeds + admin overrides), always sorted by menu order        */
/* ------------------------------------------------------------------ */

function sortByOrder(list) {
  return list.slice().sort((a, b) => (a.menuOrder ?? 999) - (b.menuOrder ?? 999));
}

export function getServices() {
  const stored = rawGet(SERVICES_KEY, []);
  const deleted = rawGet(DELETED_KEY, []);
  const map = new Map(stored.map((s) => [s.id, s]));
  const merged = [];
  for (const s of SEED) {
    if (deleted.includes(s.id)) continue;
    merged.push(map.get(s.id) || s);
  }
  for (const s of stored) {
    if (!SEED_IDS.has(s.id)) merged.push(s);
  }
  return sortByOrder(merged);
}

export function getPublishedServices() {
  const now = Date.now();
  return getServices().filter((s) => {
    if (s.status !== 'published') return false;
    if (s.scheduledAt && new Date(s.scheduledAt).getTime() > now) return false;
    return true;
  });
}

export function getServiceBySlug(slug) {
  return getPublishedServices().find((s) => s.slug === slug);
}

export function getFeaturedServices() {
  return getPublishedServices().filter((s) => s.featured || s.showHome);
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export function getServiceCategories() {
  const stored = rawGet(CATS_KEY, []);
  return stored && stored.length ? stored : SEED_CATS;
}

export function saveServiceCategories(list) {
  rawSet(CATS_KEY, list);
  return list;
}

export function addServiceCategory(name) {
  const list = getServiceCategories();
  const clean = String(name || '').trim();
  if (!clean) return list;
  if (list.some((c) => c.name.toLowerCase() === clean.toLowerCase())) return list;
  const next = list.concat({ id: slugify(clean) || uid('cat'), name: clean });
  return saveServiceCategories(next);
}

/* ------------------------------------------------------------------ */
/* CRUD                                                                */
/* ------------------------------------------------------------------ */

export function saveServices(list) {
  rawSet(SERVICES_KEY, list);
  return sortByOrder(list);
}

export function upsertService(service) {
  const list = getServices();
  const idx = list.findIndex((s) => s.id === service.id);
  if (idx >= 0) list[idx] = { ...list[idx], ...service };
  else list.push(service);
  return saveServices(list);
}

export function deleteServices(ids) {
  const del = rawGet(DELETED_KEY, []);
  ids.forEach((id) => { if (!del.includes(id)) del.push(id); });
  rawSet(DELETED_KEY, del);
  return saveServices(getServices().filter((s) => !ids.includes(s.id)));
}

export function duplicateService(id) {
  const list = getServices();
  const src = list.find((s) => s.id === id);
  if (!src) return list;
  const copy = {
    ...src,
    id: uid(),
    name: `${src.name} (Copy)`,
    slug: uniqueSlug(src.name, list, id),
    featured: false,
    showHome: false,
    status: 'draft',
  };
  return upsertService(copy);
}

export function bulkUpdate(ids, patch) {
  const list = getServices();
  ids.forEach((id) => {
    const idx = list.findIndex((s) => s.id === id);
    if (idx >= 0) list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString().split('T')[0] };
  });
  return saveServices(list);
}