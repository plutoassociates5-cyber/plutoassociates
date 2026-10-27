/**
 * Push src/content/articles.json into WordPress (one-time migration, and
 * re-runnable any time to reconcile).
 *
 *   npm run wp:import            # dry run — prints what would happen
 *   npm run wp:import -- --yes   # actually create/update posts in WordPress
 *   npm run wp:import -- --yes --slug=divorce-in-nepal-process-cost-and-timeline
 *
 * TRANSPORT: XML-RPC (/xmlrpc.php) — the free WordPress.com plan does not
 * expose the REST API.
 *
 * Environment: WP_URL, WP_USER, WP_APP_PASSWORD (see .env.example).
 *
 * For each article it:
 *   1. Uploads the featured image to the WP media library (once per image)
 *   2. Creates or updates the post, wrapping content in a Custom HTML block,
 *      and stores the featured-image URL, category, tags and SEO extras inside
 *      an invisible pluto-meta comment so they round-trip through sync-wp.cjs.
 *
 * NOTE: WordPress.com's XML-RPC ignores the `terms` argument on
 * wp.newPost/wp.editPost, so categories and tags are NOT assigned in WP's own
 * taxonomy here — they live in the meta comment and drive the site's own
 * category pages exactly as before.
 */
const fs = require('fs');
const path = require('path');
const {
  getWpConfig, withBlogId, wpCall, sleep, attachPlutoMeta, basenameFromUrl,
} = require('./wp-lib.cjs');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT, 'src', 'content', 'articles.json');

const IMAGE_DIRS = [
  path.join(ROOT, 'public', 'images'),
  path.join(ROOT, 'dist', 'images'),
  path.join(ROOT, 'src', 'assets'),
];

function findLocalImage(featuredImage) {
  if (!featuredImage) return null;
  const base = basenameFromUrl(featuredImage);
  if (!base) return null;
  for (const dir of IMAGE_DIRS) {
    const file = path.join(dir, base);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
};

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

async function uploadMedia(config, file, cache) {
  const size = fs.statSync(file).size;
  if (size > 6 * 1024 * 1024) {
    throw new Error(`file is ${(size / 1024 / 1024).toFixed(1)} MB (WordPress.com free limit is 6 MB)`);
  }
  const buffer = fs.readFileSync(file);
  const name = path.basename(file);
  if (cache.has(name)) return cache.get(name);
  const data = {
    name,
    type: MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    bits: { __base64: buffer.toString('base64') },
    overwrite: true,
  };
  const res = await wpCall(config, 'wp.uploadFile', [data], 180000);
  const link = res && res.link;
  cache.set(name, link);
  await sleep(400);
  return link;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('--yes');
  const slugArg = (args.find((a) => a.startsWith('--slug=')) || '').slice(7);
  const wanted = slugArg ? slugArg.split(',').map((s) => s.trim()).filter(Boolean) : null;

  const config = getWpConfig(ROOT);
  if (!config) {
    console.error('Missing WP_URL / WP_USER / WP_APP_PASSWORD. Copy .env.example to .env and fill them in (see WORDPRESS-BLOG.md).');
    process.exit(1);
  }

  let articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  if (wanted) {
    articles = articles.filter((a) => wanted.includes(a.slug));
    if (!articles.length) {
      console.error(`No articles matched --slug=${slugArg}`);
      process.exit(1);
    }
  }

  await withBlogId(config);
  console.log(`WordPress:  ${config.site} (blog ${config.blogId})`);
  console.log(`Articles:   ${articles.length}${wanted ? ' (filtered)' : ''}`);
  console.log(`Mode:       ${yes ? 'PUSH (creating/updating)' : 'DRY RUN (add --yes to push)'}\n`);

  const mediaCache = new Map();

  // Pre-map existing posts by slug so we update rather than duplicate.
  const existing = await wpCall(config, 'wp.getPosts', [{ number: 500, post_type: 'post' }]);
  const idBySlug = new Map(existing.map((p) => [p.post_name, p.post_id]));

  const summary = { created: 0, updated: 0, failed: 0, media: 0, mediaMissing: 0 };

  for (const article of articles) {
    const label = article.slug;

    // --- featured image -> media library (once per unique filename) ---
    let featuredUrl = '';
    const imageFile = findLocalImage(article.featuredImage);
    if (imageFile) {
      if (yes) {
        try {
          featuredUrl = await uploadMedia(config, imageFile, mediaCache);
          summary.media += 1;
          console.log(`  media    ${path.basename(imageFile)} -> ${featuredUrl}`);
        } catch (err) {
          console.warn(`  ! media upload failed for ${label}: ${err.message}`);
          featuredUrl = article.featuredImage || '';
        }
      } else {
        summary.media += 1;
      }
    } else if (article.featuredImage) {
      summary.mediaMissing += 1;
      console.warn(`  ! local image not found for ${label}: ${article.featuredImage}`);
    }

    // --- content: meta comment carries category, tags and SEO fields ---
    // WordPress.com's XML-RPC ignores the `terms` argument on newPost/editPost,
    // so we do not attempt to assign taxonomy here. Category and tags travel in
    // the pluto-meta comment and are read back by sync-wp.cjs.
    const meta = { ...article };
    delete meta.content;
    if (featuredUrl || article.featuredImage) {
      meta.featuredImage = featuredUrl || article.featuredImage;
    }
    const contentHtml = attachPlutoMeta(article.content || '', meta);

    const customFields = [
      { key: 'pluto_featured_image', value: featuredUrl || article.featuredImage || '' },
      { key: 'pluto_featured_image_alt', value: article.featuredImageAlt || article.title || '' },
      { key: 'pluto_seo_title', value: article.seoTitle || '' },
      { key: 'pluto_seo_desc', value: article.seoDesc || '' },
      { key: 'pluto_meta_keywords', value: article.metaKeywords || '' },
      { key: 'pluto_author_name', value: article.authorName || '' },
      { key: 'pluto_author_initials', value: article.authorInitials || '' },
    ];

    const content = {
      post_title: article.title || '',
      post_content: `<!-- wp:html -->\n${contentHtml}\n<!-- /wp:html -->`,
      post_excerpt: article.excerpt || '',
      post_status: article.status === 'published' ? 'publish' : 'draft',
      post_name: article.slug,
      custom_fields: customFields,
    };
    if (article.date) content.post_date_gmt = `${article.date}T00:00:00`;

    const existingId = idBySlug.get(article.slug);
    try {
      if (!yes) {
        if (existingId) summary.updated += 1;
        else summary.created += 1;
        continue;
      }
      if (existingId) {
        await wpCall(config, 'wp.editPost', [Number(existingId), content]);
        summary.updated += 1;
        console.log(`  updated  ${label}`);
      } else {
        const newId = await wpCall(config, 'wp.newPost', [content]);
        idBySlug.set(article.slug, newId);
        summary.created += 1;
        console.log(`  created  ${label} (#${newId})`);
      }
      await sleep(500);
    } catch (err) {
      summary.failed += 1;
      console.error(`  ! failed ${label}: ${err.message}`);
    }
  }

  console.log(`\nDone: ${summary.created} to create, ${summary.updated} to update, ${summary.failed} failed, ${summary.media} image(s) uploadable${summary.mediaMissing ? `, ${summary.mediaMissing} image(s) missing locally` : ''}.`);
  if (!yes) {
    console.log('This was a DRY RUN. Re-run with --yes to push to WordPress.');
    console.log('After pushing, verify with `npm run wp:sync`, then use `npm run wp:sync:write` only if WordPress should replace local articles.json.');
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message);
    process.exit(1);
  });
}
