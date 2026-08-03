import seedArticles from '../content/articles.json';

const ART_KEY = 'pluto_articles';
const CRED_KEY = 'mlp_creds';
const DEL_KEY = 'pluto_deleted';

/**
 * Seed articles are the committed, crawlable source of truth (they are also
 * prerendered at build time and listed in the sitemap). Admin edits are stored
 * in localStorage and override the seed on a per-id basis. Articles created in
 * the admin that are not part of the seed are appended after the seeds.
 */
export function getArticles() {
  let local = [];
  let deleted = [];
  try { local = JSON.parse(localStorage.getItem(ART_KEY)) || []; } catch { /* ignore */ }
  try { deleted = JSON.parse(localStorage.getItem(DEL_KEY)) || []; } catch { /* ignore */ }

  const localMap = new Map(local.map((a) => [a.id, a]));
  const seedIds = new Set(seedArticles.map((a) => a.id));

  const merged = [];
  for (const seed of seedArticles) {
    if (deleted.includes(seed.id)) continue;
    merged.push(localMap.get(seed.id) || seed);
  }
  for (const a of local) {
    if (!seedIds.has(a.id)) merged.push(a);
  }
  return merged;
}

export function saveArticles(articles) {
  localStorage.setItem(ART_KEY, JSON.stringify(articles));
}

export function deleteArticle(id) {
  let deleted = [];
  try { deleted = JSON.parse(localStorage.getItem(DEL_KEY)) || []; } catch { /* ignore */ }
  if (!deleted.includes(id)) {
    deleted.push(id);
    localStorage.setItem(DEL_KEY, JSON.stringify(deleted));
  }
  saveArticles(getArticles().filter((a) => a.id !== id));
}

/**
 * Unique URL slug for a title, avoiding collisions with existing articles
 * (e.g. `my-title`, `my-title-2`, `my-title-3`). Pass the article's own id
 * as `ignoreId` when the slug is being edited so it does not clash with itself.
 */
export function uniqueSlug(base, articles, ignoreId) {
  const slug = slugify(base);
  const others = (articles || getArticles()).filter((a) => a.id !== ignoreId);
  const taken = new Set(others.map((a) => (a.slug || '').toLowerCase()));
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

/**
 * Estimated reading time in minutes for an HTML article body.
 */
export function readingTime(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ').trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function getSeedArticles() {
  return seedArticles;
}

export function getCreds() {
  try {
    return JSON.parse(localStorage.getItem(CRED_KEY)) || { u: 'pluto', p: 'pluto@2025', n: 'Admin', role: 'super' };
  } catch {
    return { u: 'pluto', p: 'pluto@2025', n: 'Admin', role: 'super' };
  }
}

export function saveCreds(creds) {
  localStorage.setItem(CRED_KEY, JSON.stringify(creds));
}

export function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

export function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}