/**
 * Static prerenderer for Pluto Associates (Vite + React SPA on Cloudflare Pages).
 *
 * Runs AFTER `vite build`. For each public route it:
 *  1. Renders the page to static HTML with react-dom/server + StaticRouter
 *  2. Bakes per-route metadata (title, description, canonical, OG, Twitter,
 *     robots) and JSON-LD directly into <head>, so crawlers see the correct
 *     markup without executing JavaScript
 *  3. Writes dist/<route>/index.html (and dist/404.html)
 *
 * The result: every URL serves crawlable, pre-rendered HTML while the SPA
 * hydrates normally in the browser.
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { build } = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS_DIR = path.join(DIST, 'assets');

const FONT_LINKS =
  '<link rel="preconnect" href="https://fonts.googleapis.com" />\n    ' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    ' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />';

const JS_ENABLE =
  '<script>document.documentElement.classList.add(\'js\');</script>';

const STATIC_LINKS =
  '<link rel="icon" href="/favicon.ico" sizes="32x32" />\n    ' +
  '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />\n    ' +
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />\n    ' +
  '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />\n    ' +
  '<link rel="manifest" href="/site.webmanifest" />';

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------------ */
/* 1. Map source asset names to Vite's hashed output paths             */
/* ------------------------------------------------------------------ */
function stripHash(name) {
  // Vite asset hashes can contain letters, digits, underscores and dashes
  // (e.g. "pa-banking-9Zs6W_oq" or "pa-corporate-DPrpr-Is"), so match the
  // full 8-char hash alphabet to avoid leaving unhashed (404) asset paths.
  return name.replace(/-[A-Za-z0-9_-]{8}$/, '');
}

function buildAssetMap() {
  const map = {};
  if (fs.existsSync(ASSETS_DIR)) {
    for (const file of fs.readdirSync(ASSETS_DIR)) {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpeg', '.jpg', '.png', '.webp', '.avif', '.gif'].includes(ext)) continue;
      const key = stripHash(path.basename(file, ext));
      if (!map[key]) map[key] = `/assets/${file}`;
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* 2. Bundle the SSR entry (esbuild) so Node can import JSX/React      */
/* ------------------------------------------------------------------ */
async function bundleSsr() {
  const assetMap = buildAssetMap();
  const outfile = path.join(os.tmpdir(), 'pa-ssr-entry.cjs');

  const assetPlugin = {
    name: 'static-assets',
    setup(build) {
      const filter = /\.(jpe?g|png|webp|avif|gif)$/i;
      build.onResolve({ filter }, (args) => ({
        path: path.resolve(args.resolveDir, args.path),
        namespace: 'asset',
      }));
      build.onLoad({ filter: /.*/, namespace: 'asset' }, (args) => {
        const base = path.basename(args.path).replace(/\.(jpe?g|png|webp|avif|gif)$/i, '');
        const url = assetMap[stripHash(base)] || `/assets/${path.basename(args.path)}`;
        return { contents: `export default ${JSON.stringify(url)};`, loader: 'js' };
      });
    },
  };

  await build({
    entryPoints: [path.join(ROOT, 'scripts', 'ssr-entry.jsx')],
    outfile,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    jsx: 'automatic',
    logLevel: 'silent',
    plugins: [assetPlugin],
  });

  return require(outfile);
}

/* ------------------------------------------------------------------ */
/* 3. Assemble a full HTML document per route                          */
/* ------------------------------------------------------------------ */
function assembleHtml(entry, route) {
  const { title, description, keywords, robots, canonical, ogType, jsonLd, preloadImage, ogImage } = route;
  const pageUrl = canonical ? `${entry.SITE.url}${canonical}` : entry.SITE.url;
  const desc = description || entry.SITE.description;
  const pageOgImage = ogImage || entry.SITE.ogImage;

  const parts = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `    <title>${esc(title)}</title>`,
    `    <meta name="description" content="${esc(desc)}" />`,
    keywords ? `    <meta name="keywords" content="${esc(keywords)}" />` : '',
    `    <meta name="robots" content="${robots}" />`,
    '    <meta name="theme-color" content="#0a1628" />',
    canonical ? `    <link rel="canonical" href="${pageUrl}" />` : '',
    '    ' + STATIC_LINKS,
    `    <meta property="og:type" content="${ogType}" />`,
    '    <meta property="og:site_name" content="Pluto Associates" />',
    `    <meta property="og:title" content="${esc(title)}" />`,
    `    <meta property="og:description" content="${esc(desc)}" />`,
    `    <meta property="og:url" content="${pageUrl}" />`,
    `    <meta property="og:image" content="${pageOgImage}" />`,
    '    <meta property="og:image:width" content="1200" />',
    '    <meta property="og:image:height" content="630" />',
    '    <meta property="og:locale" content="en_NP" />',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:title" content="${esc(title)}" />`,
    `    <meta name="twitter:description" content="${esc(desc)}" />`,
    `    <meta name="twitter:image" content="${pageOgImage}" />`,
    '    ' + FONT_LINKS,
    preloadImage ? `    <link rel="preload" as="image" href="${preloadImage}" />` : '',
    '    ' + JS_ENABLE,
  ];

  // Vite-built CSS / modulepreload / entry script from the SPA shell
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const cssLinks = (template.match(/<link rel="stylesheet"[^>]*>/g) || []).map((m) => '    ' + m);
  const preloads = (template.match(/<link rel="modulepreload"[^>]*>/g) || []).map((m) => '    ' + m);
  const scripts = (template.match(/<script type="module"[^>]*><\/script>/g) || []).map((m) => '    ' + m);

  parts.push(...cssLinks);
  if (jsonLd) parts.push(`    <script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(jsonLd)}</script>`);
  parts.push('  </head>', '  <body>', `    <div id="root">${route.body}</div>`, ...preloads, ...scripts, '  </body>', '</html>');
  return parts.filter(Boolean).join('\n');
}

/* ------------------------------------------------------------------ */
/* 4. Main                                                             */
/* ------------------------------------------------------------------ */
function buildSitemap(entry, published) {
  const today = new Date().toISOString().split('T')[0];
  const staticRoutes = [
    { loc: '/', lastmod: today, freq: 'weekly', priority: '1.0' },
    { loc: '/about', lastmod: today, freq: 'monthly', priority: '0.8' },
    { loc: '/practice-areas', lastmod: today, freq: 'monthly', priority: '0.9' },
    { loc: '/services', lastmod: today, freq: 'weekly', priority: '0.9' },
    { loc: '/teams', lastmod: today, freq: 'monthly', priority: '0.8' },
    { loc: '/faq', lastmod: today, freq: 'weekly', priority: '0.7' },
    { loc: '/publications', lastmod: today, freq: 'weekly', priority: '0.7' },
    { loc: '/contact', lastmod: today, freq: 'monthly', priority: '0.7' },
  ];
  const staticCount = staticRoutes.length;
  const practiceAreas = entry.getPracticeAreas();
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const r of staticRoutes) {
    lines.push(
      '  <url>',
      `    <loc>${entry.SITE.url}${r.loc}</loc>`,
      `    <lastmod>${r.lastmod}</lastmod>`,
      `    <changefreq>${r.freq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      '  </url>'
    );
  }
  for (const area of practiceAreas) {
    lines.push(
      '  <url>',
      `    <loc>${entry.SITE.url}/practice-areas/${area.id}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    );
  }
  const serviceRoutes = entry.getPublishedServices();
  for (const s of serviceRoutes) {
    lines.push(
      '  <url>',
      `    <loc>${entry.SITE.url}/services/${s.slug}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.8</priority>',
      '  </url>'
    );
  }
  for (const a of published) {
    const lastmod = (a.modifiedAt || a.date || today).substring(0, 10);
    lines.push(
      '  <url>',
      `    <loc>${entry.SITE.url}/publications/${a.slug}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>'
    );
  }
  lines.push('</urlset>', '');
  return { xml: lines.join('\n'), count: staticCount + practiceAreas.length + serviceRoutes.length + published.length };
}

(async () => {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  const entry = await bundleSsr();
  const assetMap = buildAssetMap();

  const routeConfigs = [
    { path: '/', dir: DIST, preload: assetMap['hero-1'] },
    { path: '/about', dir: path.join(DIST, 'about') },
    { path: '/practice-areas', dir: path.join(DIST, 'practice-areas') },
    { path: '/services', dir: path.join(DIST, 'services') },
    { path: '/teams', dir: path.join(DIST, 'teams') },
    { path: '/faq', dir: path.join(DIST, 'faq') },
    { path: '/publications', dir: path.join(DIST, 'publications') },
    { path: '/contact', dir: path.join(DIST, 'contact') },
  ];

  for (const cfg of routeConfigs) {
    const body = entry.renderApp(cfg.path);
    const meta = entry.ROUTES[cfg.path] || entry.ROUTES['/404'];
    const html = assembleHtml(
      entry,
      {
        ...meta,
        body,
        jsonLd: entry.buildJsonLd(cfg.path),
        preloadImage: cfg.preload,
      }
    );
    fs.mkdirSync(cfg.dir, { recursive: true });
    const outFile = cfg.path === '/' ? path.join(cfg.dir, 'index.html') : path.join(cfg.dir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`prerendered ${cfg.path} -> ${path.relative(ROOT, outFile)} (${Math.round(html.length / 1024)} KB)`);
  }

  // 404 page (noindex) so unknown URLs return a branded soft-404 with correct status.
  const notFoundBody = entry.renderApp('/this-page-does-not-exist');
  const notFoundHtml = assembleHtml(entry, { ...entry.ROUTES['/404'], body: notFoundBody, jsonLd: null });
  fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml, 'utf8');
  console.log('prerendered /404 -> dist/404.html');

  // Admin SPA entry -> dist/admin/index.html. A real directory (like every
  // public route) means Cloudflare Pages serves it directly: /admin is
  // auto-redirected to /admin/ (308) which serves this file with 200. No
  // _redirects rewrite is involved, so Cloudflare's automatic HTML handling
  // (which 308s rewrites that resolve to index.html or other .html files)
  // cannot hijack the admin URL.
  const adminMeta = entry.resolveRouteMeta('/admin');
  const adminHtml = assembleHtml(entry, { ...adminMeta, body: entry.renderApp('/admin'), jsonLd: null });
  const adminDir = path.join(DIST, 'admin');
  fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml, 'utf8');
  console.log('prerendered /admin -> dist/admin/index.html (SPA entry, noindex)');

  // Published articles -> /publications/<slug> (unique title/desc/OG + Article JSON-LD)
  const published = entry.getPublishedArticles();
  for (const art of published) {
    const routePath = `/publications/${art.slug}`;
    const dir = path.join(DIST, 'publications', art.slug);
    const meta = entry.resolveRouteMeta(routePath);
    const html = assembleHtml(entry, {
      ...meta,
      body: entry.renderApp(routePath),
      jsonLd: entry.buildJsonLd(routePath),
      preloadImage: art.featuredImage,
    });
    fs.mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`prerendered ${routePath} -> ${path.relative(ROOT, outFile)} (${Math.round(html.length / 1024)} KB)`);
  }

  // Practice areas -> /practice-areas/<id> (unique title/desc/OG + Service JSON-LD)
  const practiceAreas = entry.getPracticeAreas();
  for (const area of practiceAreas) {
    const routePath = `/practice-areas/${area.id}`;
    const dir = path.join(DIST, 'practice-areas', area.id);
    const meta = entry.resolveRouteMeta(routePath);
    const html = assembleHtml(entry, {
      ...meta,
      body: entry.renderApp(routePath),
      jsonLd: entry.buildJsonLd(routePath),
      preloadImage: area.img,
    });
    fs.mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`prerendered ${routePath} -> ${path.relative(ROOT, outFile)} (${Math.round(html.length / 1024)} KB)`);
  }

  // Services -> /services/<slug> (unique title/desc/OG + Service/FAQ JSON-LD)
  const services = entry.getPublishedServices();
  for (const svc of services) {
    const routePath = `/services/${svc.slug}`;
    const dir = path.join(DIST, 'services', svc.slug);
    const meta = entry.resolveRouteMeta(routePath);
    const html = assembleHtml(entry, {
      ...meta,
      body: entry.renderApp(routePath),
      jsonLd: entry.buildJsonLd(routePath),
      preloadImage: svc.featuredImage,
    });
    fs.mkdirSync(dir, { recursive: true });
    const outFile = path.join(dir, 'index.html');
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`prerendered ${routePath} -> ${path.relative(ROOT, outFile)} (${Math.round(html.length / 1024)} KB)`);
  }

  // Dynamic sitemap (overwrites the static public/sitemap.xml copy) incl. article + area URLs
  const sitemap = buildSitemap(entry, published);
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap.xml, 'utf8');
  console.log(`wrote dist/sitemap.xml (${sitemap.count} URLs)`);

  console.log('Prerendering complete.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
