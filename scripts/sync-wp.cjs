/**
 * Pull blog posts from WordPress and regenerate src/content/articles.json.
 *
 * WordPress is the editorial source of truth for everything under
 * /publications. Runs at the start of every build (`npm run build`), so a
 * Cloudflare Pages deploy always ships the latest published posts.
 *
 * Environment (repo .env locally, Cloudflare Pages env vars in production):
 *   WP_URL            e.g. https://yourname.wordpress.com
 *   WP_USER           WordPress username
 *   WP_APP_PASSWORD   Application password (Spaces are fine.)
 *
 * Safety:
 *   - Unconfigured (no WP env vars) -> exits 0, keeps committed articles.json
 *   - WP unreachable -> exits 0 with a loud warning (stale content beats a
 *     broken deploy; the next scheduled build picks up the change)
 *   - WP returns zero posts -> exits 1 (never wipe the site's content);
 *     set WP_SYNC_ALLOW_EMPTY=1 to override deliberately
 *   - articles.json is only rewritten when something actually changed
 */
const fs = require('fs');
const path = require('path');
const {
  getWpConfig, api, apiAll, mapPostToArticle, basenameFromUrl,
} = require('./wp-lib.cjs');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT, 'src', 'content', 'articles.json');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

const POST_FIELDS = [
  'id', 'slug', 'title', 'content', 'excerpt', 'categories', 'tags',
  'status', 'date', 'date_gmt', 'modified', 'modified_gmt', 'featured_media',
].join(',');

function readLocalArticles() {
  try {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

/** Ensure a featured-image file exists locally; download it from WP if not. */
async function ensureLocalImage(config, media, articleSlug) {
  const sourceUrl = media && media.source_url;
  if (!sourceUrl) return;
  const base = basenameFromUrl(sourceUrl);
  if (!base) return;
  const target = path.join(IMAGES_DIR, base);
  if (fs.existsSync(target)) return;
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    fs.writeFileSync(target, buf);
    console.log(`  downloaded image ${base} (${Math.round(buf.length / 1024)} KB) for ${articleSlug}`);
  } catch (err) {
    console.warn(`  ! could not download image for ${articleSlug}: ${err.message}`);
  }
}

async function sync() {
  const config = getWpConfig(ROOT);
  if (!config) {
    console.log('[sync-wp] WP_URL / WP_USER / WP_APP_PASSWORD not set — skipping WordPress sync, using committed articles.json.');
    return 0;
  }

  let posts;
  try {
    posts = await apiAll(
      config,
      `/posts?status=any&context=edit&order=desc&orderby=date&_fields=${POST_FIELDS}`
    );
  } catch (err) {
    console.warn(`[sync-wp] WARNING: WordPress unreachable (${err.message}) — keeping committed articles.json.`);
    return 0;
  }

  if (!posts.length) {
    if (process.env.WP_SYNC_ALLOW_EMPTY === '1') {
      console.warn('[sync-wp] WARNING: WordPress returned zero posts and WP_SYNC_ALLOW_EMPTY=1 — writing empty article list.');
    } else {
      console.error('[sync-wp] ERROR: WordPress returned zero posts. Run `npm run wp:import -- --yes` first, or set WP_SYNC_ALLOW_EMPTY=1 if an empty blog is intended.');
      process.exit(1);
    }
  }

  const [cats, tags] = await Promise.all([
    apiAll(config, '/categories?hide_empty=0'),
    apiAll(config, '/tags?hide_empty=0'),
  ]);
  const catMap = Object.fromEntries(cats.map((c) => [c.id, c.slug]));
  const tagMap = Object.fromEntries(tags.map((t) => [t.id, t.name]));

  const mediaIds = [...new Set(posts.map((p) => p.featured_media).filter(Boolean))];
  const mediaMap = {};
  for (let i = 0; i < mediaIds.length; i += 50) {
    const chunk = mediaIds.slice(i, i + 50);
    const media = await api(config, `/media?include=${chunk.join(',')}&per_page=100&_fields=id,source_url,alt_text`);
    for (const m of media) mediaMap[m.id] = m;
  }

  const previous = readLocalArticles();
  const prevBySlug = new Map(previous.map((a) => [a.slug, a]));

  const articles = [];
  for (const post of posts) {
    const article = mapPostToArticle(post, { mediaMap, catMap, tagMap }, prevBySlug.get(post.slug));
    articles.push(article);
    await ensureLocalImage(config, mediaMap[post.featured_media], article.slug);
  }

  articles.sort((a, b) => {
    const d = String(b.date || '').localeCompare(String(a.date || ''));
    return d !== 0 ? d : String(a.slug).localeCompare(String(b.slug));
  });

  const next = JSON.stringify(articles, null, 2) + '\n';
  const current = fs.existsSync(ARTICLES_FILE) ? fs.readFileSync(ARTICLES_FILE, 'utf8') : '';
  const publishedCount = articles.filter((a) => a.status === 'published').length;

  if (next === current) {
    console.log(`[sync-wp] ${articles.length} posts from WordPress (${publishedCount} published) — articles.json already up to date.`);
    return articles.length;
  }

  fs.writeFileSync(ARTICLES_FILE, next, 'utf8');
  console.log(`[sync-wp] wrote src/content/articles.json — ${articles.length} posts from WordPress (${publishedCount} published).`);
  return articles.length;
}

if (require.main === module) {
  sync().catch((err) => {
    console.error(`[sync-wp] ERROR: ${err.stack || err.message}`);
    process.exit(1);
  });
}

module.exports = { sync };
