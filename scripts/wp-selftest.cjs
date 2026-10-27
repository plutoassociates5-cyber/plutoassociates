/**
 * Offline self-test for the WordPress sync pipeline (no network, no WP account).
 * Run: node scripts/wp-selftest.cjs
 */
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {
  decodeEntities, stripTags, extractPlutoMeta, attachPlutoMeta,
  mapPostToArticle, normalizeRpcPost, categoryLabel, basenameFromUrl,
  decodeResponse, stripWpHtmlWrapper, parseWpDate,
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

// --- XML-RPC response decoding ---------------------------------------
assert.deepStrictEqual(decodeResponse(
  '<methodResponse><params><param><value><array><data>' +
  '<value><string>a</string></value><value><int>2</int></value>' +
  '</data></array></value></param></params></methodResponse>'
), ['a', 2]);
// nested struct-in-array-in-struct (the shape wp.getPosts really returns)
assert.deepStrictEqual(decodeResponse(
  '<methodResponse><params><param><value><array><data><value><struct>' +
  '<member><name>post_id</name><value><string>3</string></value></member>' +
  '<member><name>terms</name><value><array><data><value><struct>' +
  '<member><name>name</name><value><string>Uncategorized</string></value></member>' +
  '<member><name>taxonomy</name><value><string>category</string></value></member>' +
  '</struct></value></data></array></value></member>' +
  '</struct></value></data></array></value></param></params></methodResponse>'
), [{ post_id: '3', terms: [{ name: 'Uncategorized', taxonomy: 'category' }] }]);
// fault decoding throws with the message
assert.throws(() => decodeResponse(
  '<methodResponse><fault><value><struct>' +
  '<member><name>faultCode</name><value><int>401</int></value></member>' +
  '<member><name>faultString</name><value><string>Bad credentials</string></value></member>' +
  '</struct></value></fault></methodResponse>'
), /Bad credentials/);

// --- WordPress date + block-wrapper normalisation --------------------
assert.strictEqual(parseWpDate('20260805T09:00:00'), '2026-08-05T09:00:00Z'); // WP.com compact form
assert.strictEqual(parseWpDate('2026-08-05 09:00:00'), '2026-08-05T09:00:00Z'); // SQL form
assert.strictEqual(parseWpDate('0000-00-00 00:00:00'), '');
assert.strictEqual(parseWpDate(''), '');
assert.strictEqual(stripWpHtmlWrapper('<!-- wp:html -->\n<p>Hi</p>\n<!-- /wp:html -->'), '<p>Hi</p>');
assert.strictEqual(stripWpHtmlWrapper('<p>No wrapper</p>'), '<p>No wrapper</p>');

// --- XML-RPC post -> article mapping ---------------------------------
const rpcPost = {
  post_id: '55',
  post_name: 'divorce-in-nepal',
  post_title: 'Divorce in Nepal&#8211; Guide',
  post_content: '<!-- wp:html -->\n<p>Body</p>\n<!-- pluto-meta:' + encodeURIComponent(JSON.stringify({
    id: 'seed-divorce', seoTitle: 'Divorce Nepal | Pluto', authorName: 'Sujan', authorInitials: 'SS',
    metaKeywords: 'divorce Nepal', _dashesFixed: 3,
    category: 'family', tags: ['Divorce', 'Family Law'],
  })) + ' -->\n<!-- /wp:html -->',
  post_excerpt: '<p>A practical walkthrough &amp; cost guide.</p>',
  post_status: 'publish',
  post_date_gmt: '20260805T09:00:00',
  post_modified_gmt: '20261019T15:00:00',
  // WordPress.com assigns "Uncategorized" and drops our terms — meta must win.
  terms: [
    { term_id: '1', name: 'Uncategorized', slug: 'uncategorized', taxonomy: 'category' },
  ],
  custom_fields: [
    { key: 'pluto_featured_image', value: 'https://x/wp-content/uploads/2026/10/divorce-family-law-nepal.jpg' },
    { key: 'pluto_featured_image_alt', value: 'Divorce in Nepal' },
  ],
};
const normalized = normalizeRpcPost(rpcPost);
const article = mapPostToArticle(normalized);
assert.strictEqual(article.id, 'seed-divorce');
assert.strictEqual(article.title, 'Divorce in Nepal– Guide');
assert.strictEqual(article.slug, 'divorce-in-nepal');
assert.strictEqual(article.content, '<p>Body</p>');
assert.strictEqual(article.excerpt, 'A practical walkthrough & cost guide.');
assert.strictEqual(article.category, 'family'); // meta wins over WP's Uncategorized
assert.deepStrictEqual(article.tags, ['Divorce', 'Family Law']);
assert.strictEqual(article.status, 'published');
assert.strictEqual(article.date, '2026-08-05');
assert.strictEqual(article.modifiedAt, '2026-10-19T15:00:00Z');
assert.strictEqual(article.featuredImage, 'https://x/wp-content/uploads/2026/10/divorce-family-law-nepal.jpg');
assert.strictEqual(article.featuredImageAlt, 'Divorce in Nepal');
assert.strictEqual(article.seoTitle, 'Divorce Nepal | Pluto');
assert.strictEqual(article.authorName, 'Sujan');
assert.strictEqual(article._dashesFixed, 3);

// draft mapping keeps the previous featured image and falls back to wp-<id>
const draftRaw = { ...rpcPost, post_status: 'draft', post_content: '<p>x</p>', custom_fields: [] };
const draft = mapPostToArticle(normalizeRpcPost(draftRaw), {}, { featuredImage: '/images/kept.jpg' });
assert.strictEqual(draft.status, 'draft');
assert.strictEqual(draft.featuredImage, '/images/kept.jpg');
assert.strictEqual(draft.id, 'wp-55'); // no meta comment -> id fallback

// with no meta comment, WP terms are used as the fallback source
const termsOnly = normalizeRpcPost({
  post_id: '77', post_name: 'no-meta', post_title: 'No Meta', post_content: '<p>y</p>',
  post_excerpt: '', post_status: 'publish', post_date_gmt: '2026-01-02 00:00:00',
  terms: [
    { term_id: '4', name: 'Licensing', slug: 'licensing', taxonomy: 'category' },
    { term_id: '9', name: 'Permits', slug: 'permits', taxonomy: 'post_tag' },
  ],
});
const fromTerms = mapPostToArticle(termsOnly);
assert.strictEqual(fromTerms.category, 'licensing');
assert.deepStrictEqual(fromTerms.tags, ['Permits']);

// --- real corpus sanity check ----------------------------------------
const real = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'src', 'content', 'articles.json'), 'utf8'));
assert.ok(real.length >= 33, 'expected at least 33 articles');
for (const a of real) {
  const round = extractPlutoMeta(attachPlutoMeta(a.content, { ...a, content: undefined }));
  assert.strictEqual(round.html, a.content.trim(), `content round-trip failed for ${a.slug}`);
  assert.ok(a.featuredImage, `missing featuredImage on ${a.slug}`);
  assert.ok(fs.existsSync(path.resolve(__dirname, '..', 'public', a.featuredImage.replace(/^\//, ''))), `missing image file for ${a.slug}`);
}

console.log(`OK — all assertions passed (${real.length} real articles checked).`);
