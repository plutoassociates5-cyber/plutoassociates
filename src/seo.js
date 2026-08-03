import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getArticles, getSeedArticles } from './utils/storage';
import { getPracticeAreas, getFaqs } from './utils/contentStore';
import { getServiceBySlug, getServiceGroups } from './services/store.js';

/**
 * Central SEO configuration for Pluto Associates (Vite + React SPA).
 * The <RouteSEO /> component applies per-route metadata (title, description,
 * canonical, Open Graph, Twitter, robots) and JSON-LD structured data to the
 * document head. Routes that are not prerendered still receive correct
 * metadata once the client renders, and prerendered pages carry the same
 * markup in the static HTML.
 */

export const SITE = {
  name: 'Pluto Associates',
  legalName: 'Pluto Associates',
  url: 'https://plutoassociates.com',
  description:
    'Pluto Associates — Advocates and Legal Consultants. Expert legal solutions in Corporate Law, FDI, Litigation, IP, and more across Nepal.',
  ogImage: 'https://plutoassociates.com/og-image.png',
  logo: 'https://plutoassociates.com/apple-touch-icon.png',
  telephone: '+977-9802356987',
  email: 'info@plutoassociates.com',
  address: { streetAddress: '', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  openingHours: 'Su,Mo,Tu,We,Th,Fr 10:00-18:00',
  geo: { latitude: 27.7172, longitude: 85.324 },
};

/* ------------------------------------------------------------------ */
/* Route metadata                                                      */
/* ------------------------------------------------------------------ */

const DEFAULT_DESC = SITE.description;

export const ROUTES = {
  '/': {
    title: 'Pluto Associates — Advocates and Legal Consultants | Nepal',
    description: DEFAULT_DESC,
    keywords: 'law firm Nepal, advocates Nepal, legal consultants Kathmandu, corporate lawyer Nepal, FDI Nepal legal, litigation lawyer Nepal, intellectual property Nepal',
    canonical: '/',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/about': {
    title: 'About Us — Pluto Associates | Advocates & Legal Consultants Nepal',
    description:
      'Learn about Pluto Associates, a trusted Kathmandu law firm founded in 2019 by Adv. Sudeep Nepal, delivering corporate, FDI, litigation and IP legal services across Nepal.',
    keywords: 'about Pluto Associates, law firm Kathmandu, legal consultants Nepal, Adv. Sudeep Nepal, law firm history Nepal',
    canonical: '/about',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/practice-areas': {
    title: 'Practice Areas — Pluto Associates | Corporate, FDI, Energy, Litigation & IP',
    description:
      'Explore Pluto Associates\' practice areas: FDI & investment, corporate & commercial law, energy & project finance, banking, litigation, intellectual property, labor, real estate and taxation in Nepal.',
    keywords: 'practice areas law firm Nepal, FDI Nepal, corporate law Nepal, energy law Nepal, banking law Nepal, litigation Nepal, intellectual property Nepal, tax law Nepal',
    canonical: '/practice-areas',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/teams': {
    title: 'Our Team — Pluto Associates | Advocates & Legal Consultants Nepal',
    description:
      'Meet the legal team at Pluto Associates: Adv. Sudeep Nepal (Founder & Senior Partner) and our associates specialising in corporate law, litigation, compliance and more.',
    keywords: 'advocates Nepal, lawyers Kathmandu, legal team Nepal, Adv. Sudeep Nepal, law firm team',
    canonical: '/teams',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/publications': {
    title: 'Publications — Legal Insights | Pluto Associates Nepal',
    description:
      'Read legal updates, articles and insights from Pluto Associates on Nepal\'s evolving corporate, FDI, litigation and regulatory landscape.',
    keywords: 'legal articles Nepal, law blog Nepal, corporate law insights Nepal, FDI analysis Nepal, legal updates Nepal',
    canonical: '/publications',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/contact': {
    title: 'Contact Us — Pluto Associates | Advocates & Legal Consultants Nepal',
    description:
      'Contact Pluto Associates in Kathmandu, Nepal. Call +977-9802356987, email info@plutoassociates.com or request a legal consultation within 24 hours.',
    keywords: 'contact law firm Nepal, lawyer consultation Kathmandu, law firm phone Nepal, legal advice Nepal contact',
    canonical: '/contact',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/faq': {
    title: 'FAQs — Pluto Associates | Advocates & Legal Consultants Nepal',
    description:
      'Frequently asked questions about Pluto Associates\' services: FDI, corporate law, energy, litigation, intellectual property and legal consultations in Nepal.',
    keywords: 'law firm FAQ Nepal, legal questions Nepal, Pluto Associates FAQs, legal consultation questions, corporate law FAQ Nepal',
    canonical: '/faq',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/services': {
    title: 'Our Services — Pluto Associates | Corporate, Family, IP, Disputes & More',
    description:
      'Explore Pluto Associates\' full range of legal services across nine practice groups: corporate & business, commercial & civil, family, employment, intellectual property & technology, disputes, criminal law, NGO/INGO and international clients in Nepal.',
    keywords: 'legal services Nepal, corporate law Nepal, family law Nepal, employment law Nepal, intellectual property Nepal, dispute resolution Nepal, NGO compliance Nepal, law firm Kathmandu',
    canonical: '/services',
    ogType: 'website',
    robots: 'index, follow',
  },
  '/404': {
    title: 'Page Not Found — Pluto Associates',
    description: 'The page you are looking for could not be found. Explore Pluto Associates legal services in Nepal.',
    keywords: '',
    canonical: null,
    ogType: 'website',
    robots: 'noindex, follow',
  },
};

const ADMIN_ROUTE = {
  title: 'Admin — Pluto Associates',
  description: '',
  keywords: '',
  canonical: null,
  ogType: 'website',
  robots: 'noindex, nofollow',
};

/* ------------------------------------------------------------------ */
/* Article lookup (published articles, seed + admin overrides)         */
/* ------------------------------------------------------------------ */

function articleSource() {
  const merged = getArticles();
  return merged && merged.length ? merged : getSeedArticles();
}

export function getPublishedArticles() {
  return articleSource().filter((a) => a.status === 'published');
}

export function findArticleBySlug(slug) {
  return getPublishedArticles().find((a) => a.slug === slug);
}

export function findPracticeAreaBySlug(slug) {
  return getPracticeAreas().find((a) => a.id === slug);
}

function plainText(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function articleMeta(article) {
  const plain = plainText(article.content);
  return {
    title: article.seoTitle || `${article.title} | Pluto Associates Nepal`,
    description: article.seoDesc || article.excerpt || plain.substring(0, 155),
    keywords: article.metaKeywords || '',
    canonical: article.canonical || `/publications/${article.slug}`,
    ogType: 'article',
    robots: 'index, follow',
    ogImage: article.featuredImage ? `${SITE.url}${article.featuredImage}` : SITE.ogImage,
    article,
  };
}

/**
 * Resolve the metadata object for any pathname (static routes + article URLs).
 * Used by both the client <RouteSEO /> and the build-time prerenderer so the
 * prerendered <head> matches what the SPA renders.
 */
export function resolveRouteMeta(path) {
  const p = normalizePath(path);
  if (p.startsWith('/admin')) return ADMIN_ROUTE;
  if (p.startsWith('/publications/')) {
    const m = p.match(/^\/publications\/([^/]+)\/?$/);
    const article = m ? findArticleBySlug(decodeURIComponent(m[1])) : undefined;
    return article ? articleMeta(article) : ROUTES['/404'];
  }
  if (p.startsWith('/practice-areas/')) {
    const m = p.match(/^\/practice-areas\/([^/]+)\/?$/);
    const area = m ? findPracticeAreaBySlug(decodeURIComponent(m[1])) : undefined;
    return area ? practiceAreaMeta(area) : ROUTES['/404'];
  }
  if (p.startsWith('/services/')) {
    const m = p.match(/^\/services\/([^/]+)\/?$/);
    const service = m ? getServiceBySlug(decodeURIComponent(m[1])) : undefined;
    return service ? serviceMeta(service) : ROUTES['/404'];
  }
  return ROUTES[p] || ROUTES['/404'];
}

function practiceAreaMeta(area) {
  const desc = area.desc || area.heading || area.title;
  return {
    title: `${area.heading || area.title} | Pluto Associates Nepal`,
    description: desc,
    keywords: `${area.title}, legal services Nepal, ${area.title} lawyer, Pluto Associates law firm Nepal`,
    canonical: `/practice-areas/${area.id}`,
    ogType: 'website',
    robots: 'index, follow',
    ogImage: area.img ? `${SITE.url}${area.img}` : SITE.ogImage,
    area,
  };
}

function serviceMeta(service) {
  return {
    title: service.seoTitle || `${service.name} | Pluto Associates Nepal`,
    description: service.seoDescription || service.shortDescription || plainText(service.content).substring(0, 155),
    keywords: service.keywords || `${service.name}, legal services Nepal, Pluto Associates law firm Kathmandu`,
    canonical: `/services/${service.slug}`,
    ogType: 'website',
    robots: 'index, follow',
    ogImage: service.ogImage || (service.featuredImage ? `${SITE.url}${service.featuredImage}` : SITE.ogImage),
    service,
  };
}

function normalizePath(path) {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '');
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data builders                                    */
/* ------------------------------------------------------------------ */

const legalServiceLd = {
  '@type': ['LegalService', 'LocalBusiness'],
  name: SITE.legalName,
  url: SITE.url,
  image: SITE.ogImage,
  logo: SITE.logo,
  telephone: SITE.telephone,
  email: SITE.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.address.addressLocality,
    addressCountry: SITE.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.geo.latitude,
    longitude: SITE.geo.longitude,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00',
    },
  ],
  areaServed: { '@type': 'Country', name: 'Nepal' },
  knowsAbout: [
    'Corporate Law',
    'Foreign Direct Investment',
    'Litigation & Dispute Resolution',
    'Intellectual Property',
    'Energy & Infrastructure',
    'Banking & Finance',
    'Taxation',
    'Labor & Employment Law',
    'Real Estate',
  ],
};

const organizationLd = {
  '@type': 'Organization',
  name: SITE.legalName,
  url: SITE.url,
  logo: SITE.logo,
  image: SITE.ogImage,
  email: SITE.email,
  telephone: SITE.telephone,
};

const websiteLd = {
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
};

const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE.url}${item.path}`,
  })),
});

const webPageLd = (name, path, description) => ({
  '@type': 'WebPage',
  name,
  url: `${SITE.url}${path}`,
  description,
  inLanguage: 'en',
  isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
  breadcrumb: breadcrumbLd([
    { name: 'Home', path: '/' },
    { name, path },
  ]),
});

const PERSONAS = [
  { name: 'Adv. Sudeep Nepal', jobTitle: 'Founder & Senior Partner', email: 'sudeep@plutoassociates.com' },
  { name: 'Nikesh Nepal', jobTitle: 'Legal Associate', email: '' },
  { name: 'Sujan Subedi', jobTitle: 'Legal Associate', email: 'sujan@plutoassociates.com' },
  { name: 'Neehal Pokharel', jobTitle: 'Legal Associate', email: '' },
];

const PRACTICE_SERVICES = [
  { name: 'Foreign Direct Investment (FDI)', urlPath: '/practice-areas#fdi' },
  { name: 'Corporate & Commercial Law', urlPath: '/practice-areas#corporate' },
  { name: 'Energy, Infrastructure & Project Finance', urlPath: '/practice-areas#energy' },
  { name: 'Banking & Finance', urlPath: '/practice-areas#banking' },
  { name: 'Litigation & Dispute Resolution', urlPath: '/practice-areas#litigation' },
  { name: 'Intellectual Property', urlPath: '/practice-areas#ip' },
  { name: 'Labor & Employment Law', urlPath: '/practice-areas#labor' },
  { name: 'Real Estate & Property', urlPath: '/practice-areas#realestate' },
  { name: 'Taxation', urlPath: '/practice-areas#tax' },
];

const practiceAreasLd = {
  '@type': 'ItemList',
  name: 'Pluto Associates Practice Areas',
  itemListElement: PRACTICE_SERVICES.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.name,
    url: `${SITE.url}${s.urlPath}`,
  })),
};

/**
 * Build the JSON-LD @graph for a given route path.
 * @param {string} path — route pathname
 * @returns {Object} schema.org @graph
 */
export function buildJsonLd(path) {
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'LegalService', ...legalServiceLd },
        { '@type': 'Organization', ...organizationLd },
        { '@type': 'WebSite', ...websiteLd },
        {
          '@type': 'WebPage',
          name: ROUTES['/'].title,
          url: `${SITE.url}/`,
          description: ROUTES['/'].description,
          isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
        },
        breadcrumbLd([{ name: 'Home', path: '/' }]),
      ],
    };
  }

  if (path === '/practice-areas') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        webPageLd('Practice Areas', '/practice-areas', ROUTES['/practice-areas'].description),
        practiceAreasLd,
      ],
    };
  }

  if (path === '/teams') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        webPageLd('Our Team', '/teams', ROUTES['/teams'].description),
        ...PERSONAS.map((p) => ({
          '@type': 'Person',
          name: p.name,
          jobTitle: p.jobTitle,
          worksFor: { '@type': 'LegalService', name: SITE.legalName, url: SITE.url },
          ...(p.email ? { email: `mailto:${p.email}` } : {}),
        })),
      ],
    };
  }

  if (path === '/faq') {
    const faqs = getFaqs();
    return {
      '@context': 'https://schema.org',
      '@graph': [
        webPageLd('FAQs', '/faq', ROUTES['/faq'].description),
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    };
  }

  const practiceAreaMatch = path.match(/^\/practice-areas\/([^/]+)\/?$/);
  if (practiceAreaMatch) {
    const area = findPracticeAreaBySlug(decodeURIComponent(practiceAreaMatch[1]));
    if (!area) return null;
    const areaUrl = `${SITE.url}/practice-areas/${area.id}`;
    const image = area.img ? `${SITE.url}${area.img}` : SITE.ogImage;
    const graph = [
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Practice Areas', path: '/practice-areas' },
        { name: area.title, path: `/practice-areas/${area.id}` },
      ]),
      {
        '@type': 'Service',
        name: area.heading || area.title,
        url: areaUrl,
        image,
        description: area.desc || area.heading || area.title,
        provider: {
          '@type': 'LegalService',
          name: SITE.legalName,
          url: SITE.url,
          telephone: SITE.telephone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: SITE.address.addressLocality,
            addressCountry: SITE.address.addressCountry,
          },
        },
        areaServed: { '@type': 'Country', name: 'Nepal' },
        serviceType: area.title,
      },
    ];
    if (area.services && area.services.length) {
      graph.push({
        '@type': 'ItemList',
        name: 'Services',
        itemListElement: area.services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s,
        })),
      });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }

  const articleMatch = path.match(/^\/publications\/([^/]+)\/?$/);
  if (articleMatch) {
    const article = findArticleBySlug(decodeURIComponent(articleMatch[1]));
    if (!article) return null;
    const plain = plainText(article.content);
    const desc = article.seoDesc || article.excerpt || plain.substring(0, 155);
    const datePublished = article.date || (article.createdAt ? article.createdAt.split('T')[0] : undefined);
    const dateModified = article.modifiedAt || article.date || datePublished;
    const articleUrl = `${SITE.url}/publications/${article.slug}`;
    const image = article.featuredImage ? `${SITE.url}${article.featuredImage}` : SITE.ogImage;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Publications', path: '/publications' },
          { name: article.title, path: `/publications/${article.slug}` },
        ]),
        {
          '@type': 'Article',
          headline: article.title,
          description: desc,
          image,
          author: { '@type': 'Person', name: article.authorName || SITE.legalName },
          publisher: {
            '@type': 'Organization',
            name: SITE.legalName,
            url: SITE.url,
            logo: { '@type': 'ImageObject', url: SITE.logo },
          },
          mainEntityOfPage: articleUrl,
          datePublished,
          dateModified,
          inLanguage: 'en',
          isPartOf: { '@type': 'WebPage', name: 'Publications', url: `${SITE.url}/publications` },
        },
      ],
    };
  }

  if (path === '/services') {
    const groups = getServiceGroups();
    return {
      '@context': 'https://schema.org',
      '@graph': [
        webPageLd('Our Services', '/services', ROUTES['/services'].description),
        ...groups.map((g, gi) => ({
          '@type': 'ItemList',
          name: g.name,
          itemListElement: g.services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.name,
            url: `${SITE.url}/services/${s.slug}`,
          })),
          itemListOrder: 'Ascending',
          ...(gi === 0 ? {} : {}),
        })),
      ],
    };
  }

  const serviceMatch = path.match(/^\/services\/([^/]+)\/?$/);
  if (serviceMatch) {
    const service = getServiceBySlug(decodeURIComponent(serviceMatch[1]));
    if (!service) return null;
    const svcUrl = `${SITE.url}/services/${service.slug}`;
    const desc = service.seoDescription || service.shortDescription || plainText(service.content).substring(0, 155);
    const image = service.featuredImage ? `${SITE.url}${service.featuredImage}` : SITE.ogImage;
    const graph = [
      breadcrumbLd([
        { name: 'Home', path: '/' },
        { name: 'Our Services', path: '/services' },
        { name: service.name, path: `/services/${service.slug}` },
      ]),
      {
        '@type': 'Service',
        name: service.name,
        url: svcUrl,
        image,
        description: desc,
        serviceType: service.name,
        provider: {
          '@type': 'LegalService',
          name: SITE.legalName,
          url: SITE.url,
          telephone: SITE.telephone,
          email: SITE.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: SITE.address.addressLocality,
            addressCountry: SITE.address.addressCountry,
          },
        },
        areaServed: { '@type': 'Country', name: 'Nepal' },
        hasOfferCatalog: service.pricing
          ? {
              '@type': 'OfferCatalog',
              name: `${service.name} — Engagement`,
              itemListElement: [{ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name }, description: service.pricing }],
            }
          : undefined,
      },
    ];
    const faqs = (service.faqs || []).filter((f) => f.q && f.a);
    if (faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }

  const map = {
    '/about': 'About Us',
    '/publications': 'Publications',
    '/contact': 'Contact Us',
  };
  if (map[path]) {
    return {
      '@context': 'https://schema.org',
      '@graph': [webPageLd(map[path], path, ROUTES[path].description)],
    };
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* DOM metadata helpers                                                */
/* ------------------------------------------------------------------ */

function upsertMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!href) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(jsonLd) {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
  if (!jsonLd) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-jsonld', 'true');
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}

function applyRoute(route) {
  const canonical = route.canonical
    ? route.canonical.startsWith('http')
      ? route.canonical
      : `${SITE.url}${route.canonical}`
    : null;
  const ogImage = route.ogImage || SITE.ogImage;

  document.title = route.title;
  upsertMeta('name', 'description', route.description);
  upsertMeta('name', 'keywords', route.keywords);
  upsertMeta('name', 'robots', route.robots);
  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:title', route.title);
  upsertMeta('property', 'og:description', route.description || SITE.description);
  upsertMeta('property', 'og:url', canonical || SITE.url);
  upsertMeta('property', 'og:type', route.ogType || 'website');
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:title', route.title);
  upsertMeta('name', 'twitter:description', route.description || SITE.description);
  upsertMeta('name', 'twitter:image', ogImage);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
}

/**
 * <RouteSEO /> — apply per-route metadata + JSON-LD whenever the URL changes.
 */
export default function RouteSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalized = normalizePath(pathname);
    const route = resolveRouteMeta(normalized);
    applyRoute(route);
    upsertJsonLd(normalized.startsWith('/admin') ? null : buildJsonLd(normalized));
  }, [pathname]);

  return null;
}
