/**
 * Offline self-test for the WordPress sync pipeline (no network, no WP account).
 * Run: node scripts/wp-selftest.cjs
 */
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {
  decodeEntities, stripTags, extractPlutoMeta, attachPlutoMeta,
  mapPostToArticle, categoryLabel, basenameFromUrl,
} = require('./wp-lib.cjs');

// --- entity decoding -------------------------------------------------
assert.strictEqual(decodeEntities('Nepal&#8217;s &ldquo;FDI&rdquo; &amp; FITTA'), 'Nepal’s “FDI” & FITTA');
assert.strictEqual(decodeEntities('a&nbsp;b'), 'a b');

// --- tags / excerpts -------------------------------------------------
assert.strictEqual(stripTags('<p>Hello <strong>world</strong>&hellip;</p>'), 'Hello world…');

// --- meta comment round trip ----------------------------------------
const src = '<p>Body text.</p>\n<script type="application/ld+json">{"@type":"FAQPage"}</script>';
const meta = { id: 'seed-test', seoTitle: 'Test | Pluto', authorName: 'Adv. Test', _dashesFixed: 82 };
const withMeta = attachPlutoMeta(src, meta);
assert.ok(withMeta.includes('<!-- pluto-meta:'));
const extracted = extractPlutoMeta(withMeta);
assert.deepStrictEqual(extracted.meta, meta);
assert.strictEqual(extracted.html, src);
// idempotent: attaching twice keeps a single comment
const twice = attachPlutoMeta(withMeta, meta);
assert.strictEqual((twice.match(/pluto-meta:/g) || []).length, 1);
// content without meta is untouched
assert.deepStrictEqual(extractPlutoMeta(src), { html: src, meta: {} });

// --- helpers ---------------------------------------------------------
assert.strictEqual(basenameFromUrl('https://x.wordpress.com/wp-content/uploads/2026/10/pan-vat.jpg?ver=1'), 'pan-vat.jpg');
assert.strictEqual(categoryLabel('fdi'), 'FDI & Investment');
assert.strictEqual(categoryLabel('some-new-cat'), 'Some New Cat');

// --- post -> article mapping -----------------------------------------
const post = {
  id: 55,
  slug: 'divorce-in-nepal',
  status: 'publish',
  title: { rendered: 'Divorce in Nepal&#8211; Guide' },
  content: { rendered: '<p>Body</p>\n<!-- pluto-meta:' + encodeURIComponent(JSON.stringify({
    id: 'seed-divorce', seoTitle: 'Divorce Nepal | Pluto', authorName: 'Sujan', authorInitials: 'SS',
    metaKeywords: 'divorce Nepal', _dashesFixed: 3,
  })) + ' -->' },
  excerpt: { rendered: '<p>A practical walkthrough &amp; cost guide.</p>' },
  categories: [7], tags: [11, 12],
  date: '2026-08-05T09:00:00', date_gmt: '2026-08-05T09:00:00',
  modified: '2026-10-19T15:00:00', modified_gmt: '2026-10-19T15:00:00',
  featured_media: 99,
};
const article = mapPostToArticle(post, {
  mediaMap: { 99: { source_url: 'https://x/wp-content/uploads/2026/10/divorce-family-law-nepal.jpg', alt_text: 'Divorce in Nepal' } },
  catMap: { 7: 'family' },
  tagMap: { 11: 'Divorce', 12: 'Family Law' },
});
assert.strictEqual(article.id, 'seed-divorce');
assert.strictEqual(article.title, 'Divorce in Nepal– Guide');
assert.strictEqual(article.slug, 'divorce-in-nepal');
assert.strictEqual(article.content, '<p>Body</p>');
assert.strictEqual(article.excerpt, 'A practical walkthrough & cost guide.');
assert.strictEqual(article.category, 'family');
assert.deepStrictEqual(article.tags, ['Divorce', 'Family Law']);
assert.strictEqual(article.status, 'published');
assert.strictEqual(article.date, '2026-08-05');
assert.strictEqual(article.modifiedAt, '2026-10-19T15:00:00Z');
assert.strictEqual(article.featuredImage, '/images/divorce-family-law-nepal.jpg');
assert.strictEqual(article.featuredImageAlt, 'Divorce in Nepal');
assert.strictEqual(article.seoTitle, 'Divorce Nepal | Pluto');
assert.strictEqual(article.authorName, 'Sujan');
assert.strictEqual(article._dashesFixed, 3);

// draft/future mapping
const draft = mapPostToArticle({ ...post, status: 'draft', featured_media: 0, content: { rendered: '<p>x</p>' }, title: { rendered: 'T' } }, {}, { featuredImage: '/images/kept.jpg' });
assert.strictEqual(draft.status, 'draft');
assert.strictEqual(draft.featuredImage, '/images/kept.jpg');
assert.strictEqual(draft.id, 'wp-55'); // no meta comment -> id fallback
const future = mapPostToArticle({ ...post, status: 'future' }, {});
assert.strictEqual(future.status, 'draft');
assert.strictEqual(future.scheduledAt, '2026-08-05T09:00:00');

// --- real corpus sanity check ----------------------------------------
const real = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src', 'content', 'articles.json'), 'utf8'));
assert.ok(real.length >= 32, 'expected the 32 seed articles');
for (const a of real) {
  const round = extractPlutoMeta(attachPlutoMeta(a.content, { ...a, content: undefined }));
  assert.strictEqual(round.html, a.content, `content round-trip failed for ${a.slug}`);
  assert.ok(a.featuredImage, `missing featuredImage on ${a.slug}`);
  assert.ok(fs.existsSync(path.resolve(__dirname, '..', 'public', a.featuredImage.replace(/^\//, ''))), `missing image file for ${a.slug}`);
}

console.log(`OK — all assertions passed (${real.length} real articles checked).`);
