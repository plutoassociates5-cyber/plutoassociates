/**
 * Pull blog posts from WordPress into src/content/articles.json.
 *
 * src/content/articles.json is the source of truth for /publications.
 * `npm run build` does NOT call this script. Run `npm run wp:sync` for a
 * dry run, or `npm run wp:sync:write` to deliberately replace the local
 * article file with WordPress content.
 *
 * TRANSPORT: XML-RPC (/xmlrpc.php). The site's free WordPress.com plan does
 * not expose the REST API, so posts are read with wp.getPosts. Featured-image
 * URLs are read from the `pluto_featured_image` custom field (written by
 * wp-import.cjs / settable on any post), falling back to the previous
 * article's image so a URL never breaks.
 *
 * Environment (repo .env locally, Cloudflare Pages env vars in production):
 *   WP_URL            e.g. https://name.wordpress.com
 *   WP_USER           WordPress username
 *   WP_APP_PASSWORD   Application password (Spaces are fine.)
 *
 * Safety:
 *   - Dry run unless --write is passed (or WP_SYNC_WRITE=1); a build cannot
 *     overwrite articles.json by accident
 *   - Unconfigured (no WP env vars) -> exits 0, keeps committed articles.json
 *   - WP unreachable -> exits 0 with a loud warning and leaves articles.json
 *     untouched
 *   - WP returns zero posts -> exits 1 (never wipe the site's content);
 *     set WP_SYNC_ALLOW_EMPTY=1 to override deliberately
 *   - articles.json is only rewritten when something actually changed
 */
const fs = require('fs');
const path = require('path');
const {
  getWpConfig, withBlogId, wpCall, sleep,
  normalizeRpcPost, mapPostToArticle, basenameFromUrl,
} = require('./wp-lib.cjs');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT, 'src', 'content', 'articles.json');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const WRITE = process.argv.includes('--write') || process.env.WP_SYNC_WRITE === '1';

function readLocalArticles() {
  try {
    return JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

/** Ensure a featured-image file exists locally; download it from WP if not. */
async function ensureLocalImage(sourceUrl, articleSlug) {
  if (!sourceUrl) return;
  const base = basenameFromUrl(sourceUrl);
  if (!base || !/\.(jpe?g|png|webp|gif|avif)$/i.test(base)) return;
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

  let rawPosts;
  try {
    await withBlogId(config);
    rawPosts = await wpCall(config, 'wp.getPosts', [{ number: 500, post_type: 'post' }]);
  } catch (err) {
    console.warn(`[sync-wp] WARNING: WordPress unreachable (${err.message}) — keeping committed articles.json.`);
    return 0;
  }

  if (!rawPosts.length) {
    if (process.env.WP_SYNC_ALLOW_EMPTY === '1') {
      console.warn(`[sync-wp] WARNING: WordPress returned zero posts and WP_SYNC_ALLOW_EMPTY=1 — ${WRITE ? 'writing' : 'would write'} empty article list.`);
    } else {
      console.error('[sync-wp] ERROR: WordPress returned zero posts. Run `npm run wp:import -- --yes` first, or set WP_SYNC_ALLOW_EMPTY=1 if an empty blog is intended.');
      process.exit(1);
    }
  }

  const previous = readLocalArticles();
  const prevBySlug = new Map(previous.map((a) => [a.slug, a]));

  const articles = [];
  for (const raw of rawPosts) {
    const post = normalizeRpcPost(raw);
    const article = mapPostToArticle(post, {}, prevBySlug.get(post.slug));
    articles.push(article);
    if (WRITE) await ensureLocalImage(post.featuredImageUrl, article.slug);
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

  if (!WRITE) {
    console.log(`[sync-wp] DRY RUN: articles.json would change — ${articles.length} posts from WordPress (${publishedCount} published).`);
    console.log('[sync-wp] Re-run with `npm run wp:sync:write` to replace src/content/articles.json.');
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
