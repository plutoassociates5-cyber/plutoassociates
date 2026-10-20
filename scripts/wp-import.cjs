/**
 * Push src/content/articles.json into WordPress (one-time migration, and
 * re-runnable any time to reconcile).
 *
 *   npm run wp:import            # dry run — prints what would happen
 *   npm run wp:import -- --yes   # actually create/update posts in WordPress
 *   npm run wp:import -- --yes --slug=divorce-in-nepal-process-cost-and-timeline
 *
 * Environment: WP_URL, WP_USER, WP_APP_PASSWORD (see .env.example).
 *
 * For each article it:
 *   1. Ensures the WP category (slug = the site's category id) and tags exist
 *   2. Uploads the featured image to the WP media library (once)
 *   3. Creates or updates the post, wrapping content in a Custom HTML block
 *      with the pluto-meta comment so SEO fields, author and original id
 *      survive the round trip back through sync-wp.cjs
 */
const fs = require('fs');
const path = require('path');
const {
  getWpConfig, api, apiAll, sleep, attachPlutoMeta, categoryLabel, basenameFromUrl,
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

async function uploadMedia(config, file) {
  const buffer = fs.readFileSync(file);
  const name = path.basename(file);
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const form = new FormData();
  form.append('file', new Blob([buffer], { type }), name);
  const media = await api(config, '/media', { method: 'POST', formData: form });
  return media.id;
}

async function ensureCategories(config, articles) {
  const existing = await apiAll(config, '/categories?hide_empty=0');
  const bySlug = new Map(existing.map((c) => [c.slug, c.id]));
  const ids = {};
  for (const c of existing) ids[c.id] = c.slug;

  const needed = [...new Set(articles.map((a) => a.category || 'general'))];
  for (const slug of needed) {
    if (bySlug.has(slug)) continue;
    const created = await api(config, '/categories', {
      method: 'POST',
      json: { name: categoryLabel(slug), slug },
    });
    bySlug.set(slug, created.id);
    ids[created.id] = created.slug;
    console.log(`  created category "${categoryLabel(slug)}" (${slug})`);
    await sleep(250);
  }
  return { bySlug, ids };
}

async function ensureTags(config, articles) {
  const existing = await apiAll(config, '/tags?hide_empty=0');
  const byName = new Map(existing.map((t) => [t.name.toLowerCase(), t.id]));
  const ids = {};
  for (const t of existing) ids[t.id] = t.name;

  const needed = [...new Set(articles.flatMap((a) => a.tags || []))];
  for (const name of needed) {
    if (!name || byName.has(name.toLowerCase())) continue;
    const created = await api(config, '/tags', { method: 'POST', json: { name } });
    byName.set(name.toLowerCase(), created.id);
    ids[created.id] = created.name;
    await sleep(250);
  }
  return { byName, ids };
}

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

  console.log(`WordPress: ${config.site}`);
  console.log(`Articles:  ${articles.length}${wanted ? ' (filtered)' : ''}`);
  console.log(yes ? 'Mode:      PUSH (creating/updating)' : 'Mode:      DRY RUN (add --yes to push)\n');

  const { bySlug: catBySlug } = await ensureCategories(config, articles);
  const { byName: tagByName } = await ensureTags(config, articles);

  const summary = { created: 0, updated: 0, skipped: 0, media: 0, mediaMissing: 0 };

  for (const article of articles) {
    const label = article.slug;

    // Featured image -> media library
    let featuredMedia = 0;
    const imageFile = findLocalImage(article.featuredImage);
    if (imageFile) {
      if (yes) {
        try {
          featuredMedia = await uploadMedia(config, imageFile);
          summary.media += 1;
          console.log(`  uploaded media ${path.basename(imageFile)} -> #${featuredMedia}`);
          await sleep(300);
        } catch (err) {
          console.warn(`  ! media upload failed for ${label}: ${err.message}`);
        }
      } else {
        summary.media += 1;
      }
    } else if (article.featuredImage) {
      summary.mediaMissing += 1;
      console.warn(`  ! local image not found for ${label}: ${article.featuredImage}`);
    }

    // Meta comment: whole article except the (large) content body
    const meta = { ...article };
    delete meta.content;
    const contentHtml = attachPlutoMeta(article.content || '', meta);
    const payload = {
      title: article.title,
      slug: article.slug,
      content: `<!-- wp:html -->\n${contentHtml}\n<!-- /wp:html -->`,
      excerpt: article.excerpt || '',
      status: article.status === 'published' ? 'publish' : 'draft',
      categories: [catBySlug.get(article.category || 'general')].filter(Boolean),
      tags: (article.tags || []).map((t) => tagByName.get(String(t).toLowerCase())).filter(Boolean),
    };
    if (featuredMedia) payload.featured_media = featuredMedia;

    try {
      const existing = await api(config, `/posts?slug=${encodeURIComponent(article.slug)}&_fields=id`);
      if (existing.length) {
        if (yes) {
          await api(config, `/posts/${existing[0].id}`, { method: 'POST', json: payload });
          summary.updated += 1;
          console.log(`  updated  ${label}`);
          await sleep(300);
        } else {
          summary.updated += 1;
        }
      } else {
        if (yes) {
          await api(config, '/posts', { method: 'POST', json: payload });
          summary.created += 1;
          console.log(`  created  ${label}`);
          await sleep(300);
        } else {
          summary.created += 1;
        }
      }
    } catch (err) {
      summary.skipped += 1;
      console.error(`  ! failed ${label}: ${err.message}`);
    }
  }

  console.log(`\nDone: ${summary.created} to create, ${summary.updated} to update, ${summary.skipped} failed, ${summary.media} image(s).`);
  if (!yes) {
    console.log('This was a DRY RUN. Re-run with --yes to push to WordPress.');
    console.log('After pushing, run `npm run wp:sync` to pull everything back and verify the round trip.');
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || err.message);
    process.exit(1);
  });
}
