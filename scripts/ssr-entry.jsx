import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../src/App';
import { ROUTES, SITE, buildJsonLd, getPublishedArticles, resolveRouteMeta } from '../src/seo';
import { getPracticeAreas } from '../src/utils/contentStore';
import { getPublishedServices } from '../src/services/store.js';

/**
 * SSR entry used by scripts/prerender.cjs to statically generate HTML for
 * each route at build time. Runs in Node via an esbuild bundle.
 */
export function renderApp(path) {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  );
}

export { ROUTES, SITE, buildJsonLd, getPublishedArticles, resolveRouteMeta, getPracticeAreas, getPublishedServices };
