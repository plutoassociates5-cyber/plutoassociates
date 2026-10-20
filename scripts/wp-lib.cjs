/**
 * Shared helpers for the WordPress <-> site article pipeline.
 *
 * WordPress (free WordPress.com plan or any self-hosted install) is the
 * editorial backend for blog posts. At build time `sync-wp.cjs` pulls posts
 * over the REST API and regenerates src/content/articles.json, so the React
 * site keeps its design and /publications URLs while the team writes posts
 * in the WordPress editor.
 *
 * Fields WordPress cannot store on a free plan (custom meta is plugin-only)
 * ride along inside an invisible HTML comment appended to post content:
 *   <!-- pluto-meta:{"id":"seed-...","seoTitle":"..."} -->
 * The comment is encodeURIComponent-encoded JSON, invisible on the page and
 * preserved by the WordPress editor inside a Custom HTML block.
 */
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

/** Parse a .env file (KEY=VALUE lines, # comments, optional quotes). */
function parseEnvFile(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

/** WP config from process.env, falling back to repo-root .env. Returns null when unset. */
function getWpConfig(root = path.resolve(__dirname, '..')) {
  const fileEnv = parseEnvFile(path.join(root, '.env'));
  const pick = (k) => process.env[k] || fileEnv[k] || '';
  const url = pick('WP_URL').replace(/\/+$/, '');
  const user = pick('WP_USER');
  const pass = pick('WP_APP_PASSWORD').replace(/\s+/g, '');
  if (!url || !user || !pass) return null;
  return { base: `${url}/wp-json/wp/v2`, user, pass, site: url };
}

function authHeader(config) {
  return 'Basic ' + Buffer.from(`${config.user}:${config.pass}`, 'utf8').toString('base64');
}

/**
 * REST request helper. `opts.json` is sent as a JSON body; `opts.formData`
 * (FormData) is sent as multipart. Returns parsed JSON (or raw Response for
 * opts.raw). Throws on non-2xx with the API error message when available.
 */
async function api(config, endpoint, opts = {}) {
  const { method = 'GET', json, formData, raw = false, timeout = 60000 } = opts;
  const headers = { Authorization: authHeader(config) };
  const init = { method, headers, signal: AbortSignal.timeout(timeout) };
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
    init.body = JSON.stringify(json);
  } else if (formData) {
    init.body = formData; // fetch sets the multipart boundary
  }
  const res = await fetch(`${config.base}${endpoint}`, init);
  if (raw) {
    if (!res.ok) throw new Error(`WP ${method} ${endpoint} -> HTTP ${res.status}`);
    return res;
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* fall through to error handling below */
  }
  if (!res.ok) {
    const msg = data && data.code ? `${data.code}: ${data.message}` : `HTTP ${res.status}`;
    throw new Error(`WP ${method} ${endpoint} -> ${msg}`);
  }
  return data;
}

/** GET all pages of a collection endpoint. */
async function apiAll(config, endpoint) {
  const out = [];
  const sep = endpoint.includes('?') ? '&' : '?';
  for (let page = 1; page <= 50; page++) {
    const batch = await api(config, `${endpoint}${sep}per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* HTML helpers                                                        */
/* ------------------------------------------------------------------ */

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', middot: '·', copy: '©', reg: '®',
  trade: '™', rarr: '→', larr: '←', deg: '°', times: '×',
};

/** Decode HTML entities (named + numeric) that WordPress adds to titles/excerpts. */
function decodeEntities(str) {
  return String(str || '').replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X'
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      if (Number.isFinite(code)) {
        try { return String.fromCodePoint(code); } catch { return whole; }
      }
      return whole;
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named !== undefined ? named : whole;
  });
}

function stripTags(html) {
  return decodeEntities(String(html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,…;:!?)])/g, '$1')
    .trim();
}

/* ------------------------------------------------------------------ */
/* Pluto meta comment (fields WordPress cannot store on a free plan)   */
/* ------------------------------------------------------------------ */

const META_RE = /<!--\s*pluto-meta:([^]*?)-->/g;

/** Remove any pluto-meta comments and return { html, meta }. */
function extractPlutoMeta(html) {
  const text = String(html || '');
  let meta = {};
  let last = null;
  let m;
  META_RE.lastIndex = 0;
  while ((m = META_RE.exec(text)) !== null) last = m[1];
  if (last) {
    try {
      meta = JSON.parse(decodeURIComponent(last.trim()));
    } catch {
      meta = {};
    }
  }
  META_RE.lastIndex = 0;
  return { html: text.replace(META_RE, '').trim(), meta };
}

/** Append (or replace) the meta comment at the end of the content HTML. */
function attachPlutoMeta(html, meta) {
  const { html: clean } = extractPlutoMeta(html);
  const json = encodeURIComponent(JSON.stringify(meta || {}));
  return `${clean}\n<!-- pluto-meta:${json} -->`;
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

/** Canonical category ids used by the site, with display labels. */
const CATEGORY_LABELS = {
  general: 'General', fdi: 'FDI & Investment', corporate: 'Corporate Law',
  labor: 'Labor & Employment', energy: 'Energy Law', tax: 'Taxation',
  ip: 'Intellectual Property', litigation: 'Litigation',
  family: 'Family Law', ngo: 'NGO / INGO', nrn: 'NRN & International',
  property: 'Property & Real Estate', criminal: 'Criminal Law',
  licensing: 'Business Licensing', realestate: 'Real Estate & Property',
};

function categoryLabel(id) {
  if (CATEGORY_LABELS[id]) return CATEGORY_LABELS[id];
  return String(id || 'general')
    .split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ------------------------------------------------------------------ */
/* Post -> article mapping                                             */
/* ------------------------------------------------------------------ */

function basenameFromUrl(url) {
  if (!url) return '';
  return decodeURIComponent(url.split('?')[0].split('#')[0].split('/').pop() || '');
}

/**
 * Map a WP REST post object to the site's article schema.
 *
 * @param post        WP post (context=edit friendly; content/title/excerpt .rendered)
 * @param ctx         { mediaMap: {id: {source_url, alt_text}}, catMap: {id: slug}, tagMap: {id: name} }
 * @param prevArticle Optional previous article for this slug — its featured
 *                    image path is reused when WP has no media, so a lost
 *                    upload never breaks an existing URL.
 */
function mapPostToArticle(post, ctx = {}, prevArticle = null) {
  const { mediaMap = {}, catMap = {}, tagMap = {} } = ctx;
  const { html, meta } = extractPlutoMeta(post.content && post.content.rendered);

  const title = decodeEntities((post.title && post.title.rendered) || '').trim();
  const excerpt = stripTags((post.excerpt && post.excerpt.rendered) || '');
  const dateGmt = (post.date_gmt || post.date || '').replace('T', ' ').slice(0, 19);
  const date = dateGmt ? dateGmt.slice(0, 10) : (meta.date || '');

  const media = post.featured_media ? mediaMap[post.featured_media] : null;
  const mediaBase = media ? basenameFromUrl(media.source_url) : '';
  const featuredImage = mediaBase
    ? `/images/${mediaBase}`
    : (prevArticle && prevArticle.featuredImage) || meta.featuredImage || '';

  const tagNames = Array.isArray(post.tags)
    ? post.tags.map((id) => tagMap[id]).filter(Boolean)
    : [];
  const categorySlug = (Array.isArray(post.categories) && post.categories.length)
    ? (catMap[post.categories[0]] || '')
    : '';

  const status = post.status === 'publish' ? 'published' : 'draft';

  const article = {
    ...meta,
    id: meta.id || `wp-${post.id}`,
    title,
    slug: post.slug || meta.slug || '',
    content: html,
    excerpt,
    category: categorySlug || meta.category || 'general',
    authorInitials: meta.authorInitials || 'PA',
    authorName: meta.authorName || 'Pluto Associates Legal Team',
    date,
    createdAt: meta.createdAt || (dateGmt ? `${dateGmt.replace(' ', 'T')}Z` : ''),
    modifiedAt: post.modified_gmt ? `${post.modified_gmt}Z` : (post.modified || meta.modifiedAt || ''),
    status,
    scheduledAt: post.status === 'future' ? (post.date || '') : '',
    tags: tagNames.length ? tagNames : (meta.tags || []),
    featuredImage,
    featuredImageAlt: (media && media.alt_text) || meta.featuredImageAlt || title,
    metaKeywords: meta.metaKeywords || tagNames.join(', '),
    seoTitle: meta.seoTitle || '',
    seoDesc: meta.seoDesc || excerpt,
    canonical: meta.canonical || '',
  };
  return article;
}

module.exports = {
  parseEnvFile,
  getWpConfig,
  authHeader,
  api,
  apiAll,
  sleep,
  decodeEntities,
  stripTags,
  extractPlutoMeta,
  attachPlutoMeta,
  CATEGORY_LABELS,
  categoryLabel,
  basenameFromUrl,
  mapPostToArticle,
};
