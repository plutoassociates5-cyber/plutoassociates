/**
 * Shared helpers for the WordPress <-> site article pipeline.
 *
 * WordPress (this site runs on a free WordPress.com plan) is an optional
 * editorial backend for blog posts. src/content/articles.json is the source of
 * truth; `sync-wp.cjs --write` deliberately pulls WordPress posts and replaces
 * that file, while `npm run build` never syncs.
 *
 * TRANSPORT: XML-RPC, not the REST API.
 *   The free WordPress.com plan does not expose /wp-json (it 404s), but the
 *   legacy XML-RPC endpoint at /xmlrpc.php accepts app-password authentication
 *   and supports everything we need: wp.getPosts, wp.newPost, wp.editPost,
 *   wp.uploadFile, wp.getCategories/wp.newCategory, wp.getTags/wp.newTerm.
 *
 * Fields WordPress.com cannot store on a free plan (custom meta is
 * plugin-only) ride along inside an invisible HTML comment appended to the
 * post content:
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

/**
 * WP config from process.env, falling back to repo-root .env. Returns null
 * when unset. `url` is the site root (e.g. https://name.wordpress.com); the
 * XML-RPC endpoint is `${url}/xmlrpc.php`.
 */
function getWpConfig(root = path.resolve(__dirname, '..')) {
  const fileEnv = parseEnvFile(path.join(root, '.env'));
  const pick = (k) => process.env[k] || fileEnv[k] || '';
  let url = pick('WP_URL').replace(/\/+$/, '');
  // Tolerate a pasted wp-admin URL: strip the trailing /wp-admin[/...].
  url = url.replace(/\/wp-admin(\/.*)?$/i, '');
  const user = pick('WP_USER');
  const pass = pick('WP_APP_PASSWORD').replace(/\s+/g, '');
  if (!url || !user || !pass) return null;
  return { url, rpc: `${url}/xmlrpc.php`, user, pass, site: url };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* XML-RPC transport                                                   */
/* ------------------------------------------------------------------ */

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Encode one PHP-ish JS value as an XML-RPC <value>. */
function encodeValue(v) {
  if (v === null || v === undefined) return '<value><nil/></value>';
  if (typeof v === 'number') {
    return Number.isInteger(v) ? `<value><int>${v}</int></value>` : `<value><double>${v}</double></value>`;
  }
  if (typeof v === 'boolean') return `<value><boolean>${v ? 1 : 0}</boolean></value>`;
  if (v && v.__base64) return `<value><base64>${v.__base64}</base64></value>`;
  if (Array.isArray(v)) {
    return `<value><array><data>${v.map((x) => encodeValue(x)).join('')}</data></array></value>`;
  }
  if (typeof v === 'object') {
    const members = Object.entries(v)
      .map(([k, x]) => `<member><name>${xmlEscape(k)}</name>${encodeValue(x)}</member>`)
      .join('');
    return `<value><struct>${members}</struct></value>`;
  }
  return `<value><string>${xmlEscape(v)}</string></value>`;
}

const XML_ENTITIES = {
  '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&apos;': "'", '&amp;': '&',
};
function xmlUnescape(s) {
  return String(s).replace(/&(lt|gt|quot|#039|apos|amp);/g, (m) => XML_ENTITIES[m]);
}

/**
 * Extract the balanced contents of the first <tag>...</tag>, counting nested
 * occurrences of the same tag so structures containing arrays of structs (or
 * structs of arrays) decode correctly. Regex cannot do this reliably.
 */
function balancedInner(xml, tag) {
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  const start = xml.indexOf(open);
  if (start === -1) return '';
  let i = start + open.length;
  let depth = 1;
  while (i < xml.length) {
    const nextOpen = xml.indexOf(open, i);
    const nextClose = xml.indexOf(close, i);
    if (nextClose === -1) return '';
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + open.length;
    } else {
      depth -= 1;
      if (depth === 0) return xml.slice(start + open.length, nextClose);
      i = nextClose + close.length;
    }
  }
  return '';
}

/** Split a container's children into top-level <value> blocks (balanced). */
function splitValues(containerXml) {
  const blocks = [];
  let i = 0;
  while (i < containerXml.length) {
    const open = containerXml.indexOf('<value>', i);
    if (open === -1) break;
    // find the matching </value> for this <value> using balance
    let j = open + '<value>'.length;
    let depth = 1;
    while (j < containerXml.length && depth > 0) {
      const no = containerXml.indexOf('<value>', j);
      const nc = containerXml.indexOf('</value>', j);
      if (nc === -1) break;
      if (no !== -1 && no < nc) { depth += 1; j = no + '<value>'.length; }
      else { depth -= 1; j = nc + '</value>'.length; }
    }
    blocks.push(containerXml.slice(open, j));
    i = j;
  }
  return blocks;
}

/**
 * Decode a single XML-RPC <value>...</value> block. Handles string, int/i4,
 * boolean, double, base64, dateTime, nil, array and struct (recursively).
 */
function decodeValue(block) {
  const typeMatch = block.match(/<value>\s*<([A-Za-z0-9.]+)/);
  const type = typeMatch ? typeMatch[1] : null;

  if (!type) {
    // bare <value>text</value>
    const m = block.match(/<value>([\s\S]*?)<\/value>/);
    return m ? xmlUnescape(m[1]) : null;
  }
  if (type === 'string') return xmlUnescape(balancedInner(block, 'string'));
  if (type === 'int' || type === 'i4') return parseInt(balancedInner(block, type) || '0', 10);
  if (type === 'double') return parseFloat(balancedInner(block, 'double') || '0');
  if (type === 'boolean') return balancedInner(block, 'boolean').trim() === '1';
  if (type === 'base64') return Buffer.from(balancedInner(block, 'base64'), 'base64');
  if (type === 'dateTime.iso8601' || type === 'dateTime') {
    return balancedInner(block, 'dateTime.iso8601') || balancedInner(block, 'dateTime');
  }
  if (type === 'nil') return null;

  if (type === 'array') {
    const data = balancedInner(balancedInner(block, 'array'), 'data');
    return splitValues(data).map((b) => decodeValue(b));
  }
  if (type === 'struct') {
    const structXml = balancedInner(block, 'struct');
    const out = {};
    let i = 0;
    while (i < structXml.length) {
      const open = structXml.indexOf('<member>', i);
      if (open === -1) break;
      const memberXml = balancedInner(structXml.slice(open), 'member');
      const nameM = memberXml.match(/<name>([\s\S]*?)<\/name>/);
      const key = nameM ? xmlUnescape(nameM[1]) : '';
      const valBlock = splitValues(memberXml)[0] || '';
      out[key] = decodeValue(valBlock);
      i = open + '<member>'.length + memberXml.length + '</member>'.length;
    }
    return out;
  }
  return null;
}

/** Decode the first <param> of a methodResponse (or throw on fault). */
function decodeResponse(xml) {
  if (/<fault>/.test(xml)) {
    const faultValue = splitValues(balancedInner(xml, 'fault'))[0] || '';
    const value = decodeValue(faultValue) || {};
    const str = value.faultString || value.faultCode || 'unknown fault';
    const code = value.faultCode;
    throw new Error(String(str) + (code && code !== str ? ` (${code})` : ''));
  }
  const paramsXml = balancedInner(xml, 'params');
  const firstParam = balancedInner(paramsXml, 'param');
  return firstParam ? decodeValue(splitValues(firstParam)[0] || '') : null;
}

/** Call one XML-RPC method. Throws on transport error or <fault>. */
async function rpc(config, method, params = [], timeout = 90000) {
  const body = '<?xml version="1.0"?><methodCall>' +
    `<methodName>${method}</methodName>` +
    `<params>${params.map((p) => `<param>${encodeValue(p)}</param>`).join('')}</params>` +
    '</methodCall>';
  const res = await fetch(config.rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    body,
    signal: AbortSignal.timeout(timeout),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`XML-RPC ${method} -> HTTP ${res.status}`);
  return decodeResponse(text);
}

/** Convenience wrapper that prepends blogId/username/password to the args. */
function wpCall(config, method, args = [], timeout) {
  return rpc(config, method, [config.blogId, config.user, config.pass, ...args], timeout);
}

/** Discover the numeric blog id (needed for every authenticated call). */
async function discoverBlogId(config) {
  const blogs = await rpc(config, 'wp.getUsersBlogs', [config.user, config.pass], 30000);
  const primary = Array.isArray(blogs)
    ? (blogs.find((b) => b.isPrimary) || blogs[0])
    : null;
  if (!primary || !primary.blogid) throw new Error('wp.getUsersBlogs returned no blog');
  return primary.blogid;
}

/** Ensure config.blogId is populated (cached on the config object). */
async function withBlogId(config) {
  if (!config.blogId) config.blogId = await discoverBlogId(config);
  return config;
}

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

/**
 * Remove the `<!-- wp:html --> … <!-- /wp:html -->` block wrapper the import
 * script adds, so a post round-trips back to the original body HTML.
 */
function stripWpHtmlWrapper(html) {
  const s = String(html || '').trim();
  const m = s.match(/^<!--\s*wp:html\s*-->\s*([^]*?)\s*<!--\s*\/wp:html\s*-->$/);
  return m ? m[1].trim() : s;
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

/** Read a custom field value out of an XML-RPC post's custom_fields array. */
function customField(post, key) {
  const list = (post && post.custom_fields) || [];
  if (!Array.isArray(list)) return '';
  const hit = list.find((f) => f && f.key === key);
  if (!hit) return '';
  const v = hit.value;
  if (v === null || v === undefined) return '';
  if (Buffer.isBuffer(v)) return v.toString('utf8');
  return String(v);
}

/** First term name for a taxonomy in an XML-RPC post's `terms` array. */
function firstTermSlug(post, taxonomy) {
  const terms = (post && post.terms) || [];
  const hit = terms.find((t) => t && t.taxonomy === taxonomy);
  return hit ? (hit.slug || '') : '';
}
function termNames(post, taxonomy) {
  const terms = (post && post.terms) || [];
  return terms.filter((t) => t && t.taxonomy === taxonomy).map((t) => t.name).filter(Boolean);
}

/**
 * Parse a WordPress XML-RPC date into ISO-8601 (UTC).
 *
 * WordPress.com returns date_gmt as the compact `YYYYMMDDTHH:MM:SS` form
 * (e.g. 20261018T00:00:00), while some backends return `YYYY-MM-DD HH:MM:SS`.
 * Both are normalised here; blank/zero dates return ''.
 */
function parseWpDate(value) {
  if (!value) return '';
  const s = String(value).trim();
  if (!s || s.startsWith('0000-00-00')) return '';
  let m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
  return s;
}

/**
 * Normalise a WordPress XML-RPC post struct into a plain shape with the
 * field names the rest of the pipeline (and the site schema) expects.
 */
function normalizeRpcPost(post) {
  return {
    id: post.post_id,
    slug: post.post_name || post.post_id,
    title: post.post_title || '',
    content: post.post_content || '',
    excerpt: post.post_excerpt || '',
    status: post.post_status || 'draft',
    link: post.link || '',
    date: parseWpDate(post.post_date_gmt || post.post_date),
    modified: parseWpDate(post.post_modified_gmt || post.post_modified),
    categories: termNames(post, 'category'),
    categorySlug: firstTermSlug(post, 'category'),
    tags: termNames(post, 'post_tag'),
    featuredImageUrl: customField(post, 'pluto_featured_image'),
    featuredImageAlt: customField(post, 'pluto_featured_image_alt'),
  };
}

/**
 * Map a normalised WP post (see normalizeRpcPost) to the site's article schema.
 *
 * @param post        normalised post
 * @param ctx         reserved for future use
 * @param prevArticle Optional previous article for this slug — its featured
 *                    image path is reused when WP has no image, so a lost
 *                    upload never breaks an existing URL.
 */
function mapPostToArticle(post, ctx = {}, prevArticle = null) {
  const { html, meta } = extractPlutoMeta(stripWpHtmlWrapper(post.content));

  const title = decodeEntities(post.title || '').trim();
  const excerpt = stripTags(post.excerpt || '') || meta.excerpt || '';
  const date = (post.date || '').slice(0, 10) || meta.date || '';

  const featuredImage = post.featuredImageUrl
    || (prevArticle && prevArticle.featuredImage)
    || meta.featuredImage
    || '';

  const status = post.status === 'publish' ? 'published'
    : post.status === 'future' ? 'draft'
    : (post.status === 'private' ? 'draft' : 'draft');

  return {
    ...meta,
    id: meta.id || `wp-${post.id}`,
    title,
    slug: post.slug || meta.slug || '',
    content: html,
    excerpt,
    // WordPress.com's XML-RPC drops the `terms` argument, so every post lands
    // in "Uncategorized". The real category/tags travel in the pluto-meta
    // comment and take precedence over whatever WP assigned.
    category: meta.category || post.categorySlug || 'general',
    authorInitials: meta.authorInitials || 'PA',
    authorName: meta.authorName || 'Pluto Associates Legal Team',
    date,
    createdAt: meta.createdAt || post.date || '',
    // Preserve the recorded modified time from meta so a no-op sync does not
    // churn the file every time WordPress bumps post_modified on a save.
    modifiedAt: meta.modifiedAt || post.modified || '',
    status,
    scheduledAt: post.status === 'future' ? post.date : '',
    tags: (meta.tags && meta.tags.length) ? meta.tags : (post.tags || []),
    featuredImage,
    featuredImageAlt: post.featuredImageAlt || meta.featuredImageAlt || title,
    metaKeywords: meta.metaKeywords || (post.tags || []).join(', '),
    seoTitle: meta.seoTitle || '',
    seoDesc: meta.seoDesc || excerpt,
    canonical: meta.canonical || '',
  };
}

module.exports = {
  parseEnvFile,
  getWpConfig,
  rpc,
  wpCall,
  withBlogId,
  discoverBlogId,
  decodeValue,
  decodeResponse,
  sleep,
  decodeEntities,
  stripTags,
  stripWpHtmlWrapper,
  parseWpDate,
  extractPlutoMeta,
  attachPlutoMeta,
  CATEGORY_LABELS,
  categoryLabel,
  basenameFromUrl,
  customField,
  normalizeRpcPost,
  mapPostToArticle,
};
