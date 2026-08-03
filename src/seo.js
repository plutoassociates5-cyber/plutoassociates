import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getArticles, getSeedArticles } from './utils/storage';
import { getPracticeAreas, getFaqs, getSettings } from './utils/contentStore';
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

/**
 * Merge the static SITE defaults with live settings (brand identity) so all
 * SEO metadata, canonical URLs and JSON-LD reflect admin-controlled values.
 * Returns a fresh object each call (cheap: reads settings + merges).
 */
export function identity() {
  const s = getSettings();
  const b = s.brand || {};
  const seo = b.seo || {};
  const office = b.office || {};
  const cc = office.country
    ? office.country.length === 2
      ? office.country.toUpperCase()
      : office.country === 'Nepal' ? 'NP' : office.country
    : SITE.address.addressCountry;
  return {
    ...SITE,
    name: s.name || SITE.name,
    tagline: s.tagline || SITE.tagline,
    legalName: seo.legalName || SITE.legalName,
    orgName: seo.orgName || s.name || SITE.name,
    url: seo.canonicalUrl || SITE.url,
    description: seo.description || SITE.description,
    ogImage: seo.ogImage || (b.assets && b.assets.ogImage) || SITE.ogImage,
    logo: seo.logoForSchema || SITE.logo,
    telephone: s.phone || SITE.telephone,
    email: s.email || SITE.email,
    address: {
      streetAddress: office.street || SITE.address.streetAddress,
      addressLocality: office.city || SITE.address.addressLocality,
      addressCountry: cc,
    },
    openingHours: seo.openingHours || SITE.openingHours,
    geo: {
      latitude: office.latitude || SITE.geo.latitude,
      longitude: office.longitude || SITE.geo.longitude,
    },
    twitterCard: seo.twitterCard || 'summary_large_image',
    robots: seo.robots || 'index, follow',
    metaTitle: seo.metaTitle || '',
    metaDescription: seo.metaDescription || '',
    schemaEnabled: seo.schema !== false,
  };
}

/* ------------------------------------------------------------------ */
/* Route metadata                                                      */
/* ------------------------------------------------------------------ */

const DEFAULT_DESC = identity().description;

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
  const I = identity();
  const plain = plainText(article.content);
  return {
    title: article.seoTitle || `${article.title} | Pluto Associates Nepal`,
    description: article.seoDesc || article.excerpt || plain.substring(0, 155),
    keywords: article.metaKeywords || '',
    canonical: article.canonical || `/publications/${article.slug}`,
    ogType: 'article',
    robots: 'index, follow',
    ogImage: article.featuredImage ? `${I.url}${article.featuredImage}` : I.ogImage,
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
  const route = resolveRawRoute(p);
  return decorateRoute(route);
}

function resolveRawRoute(p) {
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

/**
 * Apply live brand/SEO identity on top of a static route definition: title
 * template, site name, description override, canonical base URL, robots and
 * the Open Graph image fallback.
 */
function decorateRoute(route) {
  if (!route) return route;
  const I = identity();
  let title = route.title || I.name;
  if (I.metaTitle) {
    const page = String(title).split('|')[0].trim();
    title = I.metaTitle.replace('{page}', page);
  } else {
    title = String(title).replace(/Pluto Associates/g, I.name);
  }
  let description = route.description || I.description;
  if (I.metaDescription && route === ROUTES['/']) description = I.metaDescription;
  const ogImage = route.ogImage && !route.ogImage.startsWith('http') ? `${I.url}${route.ogImage}` : route.ogImage || I.ogImage;
  return {
    ...route,
    title,
    description,
    ogImage,
    robots: I.robots || route.robots,
    twitterCard: I.twitterCard,
    baseUrl: I.url,
  };
}

function practiceAreaMeta(area) {
  const I = identity();
  const desc = area.desc || area.heading || area.title;
  return {
    title: `${area.heading || area.title} | Pluto Associates Nepal`,
    description: desc,
    keywords: `${area.title}, legal services Nepal, ${area.title} lawyer, Pluto Associates law firm Nepal`,
    canonical: `/practice-areas/${area.id}`,
    ogType: 'website',
    robots: 'index, follow',
    ogImage: area.img ? `${I.url}${area.img}` : I.ogImage,
    area,
  };
}

function serviceMeta(service) {
  const I = identity();
  return {
    title: service.seoTitle || `${service.name} | Pluto Associates Nepal`,
    description: service.seoDescription || service.shortDescription || plainText(service.content).substring(0, 155),
    keywords: service.keywords || `${service.name}, legal services Nepal, Pluto Associates law firm Kathmandu`,
    canonical: `/services/${service.slug}`,
    ogType: 'website',
    robots: 'index, follow',
    ogImage: service.ogImage || (service.featuredImage ? `${I.url}${service.featuredImage}` : I.ogImage),
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

function legalServiceLd() {
  const I = identity();
  return {
    '@type': ['LegalService', 'LocalBusiness'],
    name: I.legalName,
    url: I.url,
    image: I.ogImage,
    logo: I.logo,
    telephone: I.telephone,
    email: I.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: I.address.streetAddress,
      addressLocality: I.address.addressLocality,
      addressCountry: I.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: I.geo.latitude,
      longitude: I.geo.longitude,
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
}

function organizationLd() {
  const I = identity();
  return {
    '@type': 'Organization',
    name: I.legalName,
    url: I.url,
    logo: I.logo,
    image: I.ogImage,
    email: I.email,
    telephone: I.telephone,
  };
}

function websiteLd() {
  const I = identity();
  return {
    '@type': 'WebSite',
    name: I.orgName,
    url: I.url,
    description: I.description,
    inLanguage: 'en',
    publisher: { '@type': 'Organization', name: I.legalName, url: I.url },
  };
}

const breadcrumbLd = (items) => {
  const I = identity();
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${I.url}${item.path}`,
    })),
  };
};

const webPageLd = (name, path, description) => {
  const I = identity();
  return {
    '@type': 'WebPage',
    name,
    url: `${I.url}${path}`,
    description,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: I.orgName, url: I.url },
    breadcrumb: breadcrumbLd([
      { name: 'Home', path: '/' },
      { name, path },
    ]),
  };
};

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

function practiceAreasLd() {
  const I = identity();
  return {
    '@type': 'ItemList',
    name: `${I.orgName} Practice Areas`,
    itemListElement: PRACTICE_SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `${I.url}${s.urlPath}`,
    })),
  };
}

/**
 * Build the JSON-LD @graph for a given route path.
 * @param {string} path — route pathname
 * @returns {Object} schema.org @graph
 */
export function buildJsonLd(path) {
  const I = identity();
  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'LegalService', ...legalServiceLd() },
        { '@type': 'Organization', ...organizationLd() },
        { '@type': 'WebSite', ...websiteLd() },
        {
          '@type': 'WebPage',
          name: ROUTES['/'].title,
          url: `${I.url}/`,
          description: ROUTES['/'].description,
          isPartOf: { '@type': 'WebSite', name: I.orgName, url: I.url },
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
        practiceAreasLd(),
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
          worksFor: { '@type': 'LegalService', name: I.legalName, url: I.url },
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
    const areaUrl = `${I.url}/practice-areas/${area.id}`;
    const image = area.img ? `${I.url}${area.img}` : I.ogImage;
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
          name: I.legalName,
          url: I.url,
          telephone: I.telephone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: I.address.addressLocality,
            addressCountry: I.address.addressCountry,
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
    const articleUrl = `${I.url}/publications/${article.slug}`;
    const image = article.featuredImage ? `${I.url}${article.featuredImage}` : I.ogImage;
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
          author: { '@type': 'Person', name: article.authorName || I.legalName },
          publisher: {
            '@type': 'Organization',
            name: I.legalName,
            url: I.url,
            logo: { '@type': 'ImageObject', url: I.logo },
          },
          mainEntityOfPage: articleUrl,
          datePublished,
          dateModified,
          inLanguage: 'en',
          isPartOf: { '@type': 'WebPage', name: 'Publications', url: `${I.url}/publications` },
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
            url: `${I.url}/services/${s.slug}`,
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
    const svcUrl = `${I.url}/services/${service.slug}`;
    const desc = service.seoDescription || service.shortDescription || plainText(service.content).substring(0, 155);
    const image = service.featuredImage ? `${I.url}${service.featuredImage}` : I.ogImage;
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
          name: I.legalName,
          url: I.url,
          telephone: I.telephone,
          email: I.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: I.address.addressLocality,
            addressCountry: I.address.addressCountry,
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
  const I = identity();
  const canonical = route.canonical
    ? route.canonical.startsWith('http')
      ? route.canonical
      : `${I.url}${route.canonical}`
    : null;
  const ogImage = route.ogImage || I.ogImage;

  document.title = route.title;
  upsertMeta('name', 'description', route.description);
  upsertMeta('name', 'keywords', route.keywords);
  upsertMeta('name', 'robots', route.robots);
  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:title', route.title);
  upsertMeta('property', 'og:description', route.description || I.description);
  upsertMeta('property', 'og:url', canonical || I.url);
  upsertMeta('property', 'og:type', route.ogType || 'website');
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:title', route.title);
  upsertMeta('name', 'twitter:description', route.description || I.description);
  upsertMeta('name', 'twitter:image', ogImage);
  upsertMeta('name', 'twitter:card', route.twitterCard || I.twitterCard);
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
    const enabled = identity().schemaEnabled;
    upsertJsonLd(normalized.startsWith('/admin') || !enabled ? null : buildJsonLd(normalized));
  }, [pathname]);

  return null;
}
