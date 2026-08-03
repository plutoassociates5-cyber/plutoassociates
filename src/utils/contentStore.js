/**
 * Central content store for the Pluto Associates CMS.
 *
 * Every editable collection lives here and is backed by localStorage, seeded
 * with the same content the public site currently ships so that, on first load
 * with no stored overrides, the site renders exactly as it does today.
 *
 * Public pages consume these getters (via fallbacks) so admin edits persist
 * and reflect immediately on the website without touching code.
 */
import logo from '../assets/logo.png';
import paFdi from '../assets/pa-fdi.jpg';
import paCorporate from '../assets/pa-corporate.jpg';
import paEnergy from '../assets/pa-energy.jpg';
import paBanking from '../assets/pa-banking.jpg';
import paLitigation from '../assets/pa-litigation.jpg';
import paIp from '../assets/pa-ip.jpg';
import paLabor from '../assets/pa-labor.jpg';
import paRealestate from '../assets/pa-realestate.jpg';
import paTax from '../assets/pa-tax.jpg';
import teamSudeep from '../assets/team-sudeep.jpg';
import teamNikesh from '../assets/team-nikesh.jpeg';
import teamSujan from '../assets/team-sujan.jpeg';
import teamNeehal from '../assets/team-motey.jpeg';
import { FAQ_SEED } from '../knowledge/faqSeed.js';

/* ------------------------------------------------------------------ */
/* SSR-safe localStorage shim (used only during Node prerender so the  */
/* seed content renders; the browser gets the real localStorage)       */
/* ------------------------------------------------------------------ */
if (typeof localStorage === 'undefined') {
  globalThis.localStorage = {
    _d: {},
    getItem(k) { return this._d[k] ?? null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; },
  };
}

/* ------------------------------------------------------------------ */
/* Generic localStorage collection with seed fallback + merge          */
/* ------------------------------------------------------------------ */
function makeCollection(key, seed = []) {
  const DEL = `${key}_deleted`;
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };
  const readDeleted = () => {
    try {
      return JSON.parse(localStorage.getItem(DEL)) || [];
    } catch {
      return [];
    }
  };

  const get = () => {
    const stored = read();
    const deleted = readDeleted();
    const storedMap = new Map(stored.map((s) => [s.id, s]));
    const seedIds = new Set(seed.map((s) => s.id));
    const merged = [];
    for (const s of seed) {
      if (deleted.includes(s.id)) continue;
      merged.push(storedMap.get(s.id) || s);
    }
    for (const s of stored) {
      if (!seedIds.has(s.id)) merged.push(s);
    }
    return merged;
  };

  const set = (list) => localStorage.setItem(key, JSON.stringify(list));

  const upsert = (item) => {
    const list = get();
    const idx = list.findIndex((s) => s.id === item.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...item };
    else list.push(item);
    set(list);
    return get();
  };

  const remove = (id) => {
    const deleted = readDeleted();
    if (!deleted.includes(id)) deleted.push(id);
    localStorage.setItem(DEL, JSON.stringify(deleted));
    set(get().filter((s) => s.id !== id));
  };

  const isSeed = (id) => seed.some((s) => s.id === id);

  return { get, set, upsert, remove, isSeed, seed };
}

/* ------------------------------------------------------------------ */
/* Seeds                                                               */
/* ------------------------------------------------------------------ */
const PRACTICE_AREAS_SEED = [
  {
    id: 'fdi', img: paFdi, icon: '🌐', title: 'Foreign Direct Investment (FDI)',
    desc: 'Specialised guidance for foreign investors entering Nepal — from sector eligibility and FITTA compliance to joint ventures and structuring. We walk you through approvals with the Department of Industry and Investment Board Nepal so your entry is transparent, compliant, and ready for the market.',
    highlights: ['Sector eligibility & entry strategy', 'FITTA & regulatory approvals', 'Joint ventures & investment structuring', 'Investment Board Nepal liaison'],
    heading: 'Comprehensive FDI Advisory for Nepal',
    intro: [
      'Nepal has become an increasingly attractive destination for foreign investors, particularly following the enactment of the Foreign Investment and Technology Transfer Act (FITTA) 2019. The Act has streamlined FDI procedures and opened new sectors to foreign participation, creating significant opportunities for international businesses.',
      'At Pluto Associates, our FDI practice provides comprehensive, end-to-end advisory services that guide investors through every stage of the investment lifecycle. From initial feasibility assessment and sector eligibility analysis to Department of Industry (DOI) approval, company registration with the Office of Company Registrar (OCR), PAN/VAT registration, and sector-specific licensing — we handle the entire regulatory process.'
    ],
    quote: 'The minimum foreign investment threshold in Nepal is NPR 20 million (approximately USD 150,000). Our team helps investors structure their investment optimally.',
    servicesHeading: 'Our FDI Services',
    services: [
      'FDI feasibility assessment and sector-specific eligibility analysis',
      'Department of Industry (DOI) approval and registration',
      'Company incorporation with the Office of Company Registrar (OCR)',
      'Investment structuring — equity, debt, JV, or branch office options',
      'FITTA compliance and technology transfer agreement drafting',
      'Repatriation of profits, dividends, and capital advisory',
      'Post-investment compliance monitoring and annual filings',
      'Exit strategy planning and regulatory wind-down procedures'
    ],
    sectorsHeading: 'Sectors We Cover',
    sectors: 'We advise foreign investors across diverse sectors including energy and hydropower, manufacturing, IT and software development, tourism and hospitality, agriculture and food processing, healthcare and pharmaceuticals, education, and financial services.',
    whyHeading: 'Why Choose Pluto Associates?',
    why: 'Our combination of deep regulatory knowledge and a practical, business-oriented approach sets us apart. Senior Partner Sudeep Nepal brings 30+ years of experience working with foreign investors, while our associates provide dedicated, day-to-day support.'
  },
  {
    id: 'corporate', img: paCorporate, icon: '🏢', title: 'Corporate & Commercial Law',
    desc: 'End-to-end corporate services covering company registration, corporate governance, mergers & acquisitions, due diligence, and commercial contracts. We help businesses structure, grow, and transact with confidence.',
    highlights: ['Company registration & formation', 'Corporate governance & compliance', 'Mergers, acquisitions & due diligence', 'Contract drafting & negotiation'],
    heading: 'Corporate & Commercial Advisory for Business',
    intro: [
      'Every business, from a single-founder start-up to an established group, relies on a sound corporate foundation. We support that foundation end-to-end — incorporating entities, structuring shareholdings and boards, and keeping every filing precise and timely under the Companies Act.',
      'Our commercial practice also supports the everyday legal work of doing business: negotiating and drafting supply, service, distribution and joint-venture arrangements, as well as the governance that binds a company together.'
    ],
    quote: 'We make corporate compliance routine rather than an afterthought, with annual filings, board resolutions and records kept continuously audit-ready.',
    servicesHeading: 'Our Corporate & Commercial Services',
    services: [
      'Company registration, formation and capital structuring',
      'Corporate governance, board and shareholder support',
      'Mergers, amalgamations and acquisitions',
      'Legal and financial due diligence',
      'Commercial and technology contract drafting and negotiation',
      'Shareholders\u0027 and joint-venture agreements',
      'Annual filings and record-keeping under the Companies Act',
      'Corporate restructuring and shareholding advisory'
    ],
    sectorsHeading: 'Who We Serve',
    sectors: 'We advise local and international companies across manufacturing, technology, trading and services — including start-ups, private and public companies, family businesses, and established groups at expansion.',
    whyHeading: 'Why Choose Pluto Associates?',
    why: 'We pair commercial sense with clear drafting. We structure companies compliantly and negotiate terms that truly protect yours — from incorporation to exit, we stay with you through every stage.'
  },
  {
    id: 'energy', img: paEnergy, icon: '⚡', title: 'Energy, Infrastructure & Project Finance',
    desc: 'Strategic legal advisory for energy and infrastructure — from hydropower to solar. We negotiate power purchase agreements, secure approvals, and structure project financing to keep projects on track.',
    highlights: ['Power purchase agreements (PPAs)', 'Regulatory approvals & licensing', 'Project finance & structuring', 'Infrastructure dispute resolution'],
    heading: 'Legal Advisory across the Energy Sector',
    intro: [
      'Hydropower and renewables sit at the centre of Nepal\u2019s growth story, and developing and financing an energy project demands a team that understands risk and reward in equal measure. We advise throughout the project life, from a first survey application to energisation.',
      'Developers, lenders and operators rely on us to negotiate power purchase agreements (PPAs), secure generation and environmental approvals, and structure financing that is genuinely bankable.'
    ],
    quote: 'A strong PPA and a clean set of regulatory, environmental and financing documents are what separate a viable project from one that stalls.',
    servicesHeading: 'Our Energy & Infrastructure Services',
    services: [
      'Power purchase agreement (PPA) negotiation',
      'Survey, generation and other regulatory approvals',
      'Project financing and special purpose vehicle structuring',
      'Environmental and statutory compliance',
      'Construction and engineering contract review',
      'Grid, interconnection and offtake advisory',
      'Energy disputes and arbitration',
      'Investment protection and incentive advisory'
    ],
    sectorsHeading: 'Sectors We Cover',
    sectors: 'Hydropower and small-hydro, solar PV and storage, transmission and distribution, and the ancillary infrastructure such as access roads and power evacuation works that bring energy to market.',
    whyHeading: 'Why Choose Pluto Associates?',
    why: 'Years of involvement in hydro and renewable financing means we speak the language of the regulator, the lender and the developer. We keep your project moving — and bankable.'
  },
  {
    id: 'banking', img: paBanking, icon: '🏦', title: 'Banking & Finance',
    desc: 'Regulatory compliance, lending documentation, financial restructuring, and secured financing advice for banks, financial institutions, and borrowers.',
    highlights: ['Loan & facility documentation', 'Regulatory compliance advisory', 'Restructuring & resolution', 'Default & recovery representation'],
    heading: 'Banking & Finance Advisory',
    intro: [
      'Lending is built on documentation that ranks, secures and recovers value, and we help both banks and borrowers get every stage of it right. From facilities and security to regulatory compliance, we make financing that works.',
      'When it is working, our practice conducts restructuring, and when it is not, we represent lenders and borrowers navigate defaults and recoveries.'
    ],
    quote: '“Good due diligence and precise documentation are what protect a facility when it matures in default.”',
    servicesHeading: 'Our Banking & Finance Services',
    services: [
      'Facility and loan documentation',
      'Security creation over movable and immovable property',
      'Regulatory compliance advisory for financial institutions',
      'Loan analysis by way of restructuring and settlement',
      'Recovery proceedings and enforcement advisory',
      'Non-performing asset management and write-offs',
      'Syndicated and project finance documentation',
      'Representation in lender and borrower disputes'
    ],
    sectorsHeading: 'Sectors We Cover',
    sectors: 'We advise commercial banks, development finance institutions, microfinance providers, non-bank financial institutions and borrowers across consumer, retail, corporate, SME and project finance.',
    why: 'We approach every matter the way a bank does — quickly and precisely — while always guarding the position of the lender or the borrower. When money is at play, we protect value and clarity.'
  },
  {
    id: 'litigation', img: paLitigation, icon: '⚖️', title: 'Litigation & Dispute Resolution',
    desc: 'Trial-tested representation across all levels of the Nepali judiciary, together with arbitration, mediation, and alternative dispute resolution.',
    highlights: ['Civil & commercial litigation', 'Arbitration & mediation', 'Appellate representation', 'Strategic dispute resolution'],
    heading: 'Representation across the Courts of Nepal',
    intro: [
      'Dispute resolution calls for representation that is strategic, thorough and persuasive. Our team appears before every level of the Nepali judiciary — district courts, appellate courts, the Supreme Court and specialist tribunals.',
      'We begin with realism: what outcome is achievable, on what timeline and in what cost. That discipline then informs detailed, effective advocacy at every hearing and in every submission.'
    ],
    quote: 'The best time to understand a dispute is before it starts — but we are equally at our best when the case is at its hardest.',
    servicesHeading: 'Our Dispute Resolution Services',
    services: [
      'Civil and commercial litigation',
      'Arbitration and alternative dispute resolution',
      'Mediation and negotiated settlement',
      'Appellate and appellate-level representation',
      'Writ and constitutional remedies before the Supreme Court',
      'Enforcement of judgments and recovery',
      'Corporate and shareholder disputes',
      'Comprehensive pre-litigation and adverse strategy advice'
    ],
    sectorsHeading: 'Areas of Practice',
    sectors: 'We represent companies, directors, and individuals across commercial contracts, shareholding and partner matters, property, intellectual property, employment, regulatory and taxation disputes.',
    whyHeading: 'Why Choose Pluto Associates?',
    why: 'We combine sharp commercial understanding with a strong and credible presence before the courts. We prepare thoroughly, argue precisely, and pursue the most efficient route to your outcome.'
  },
  {
    id: 'ip', img: paIp, icon: '💡', title: 'Intellectual Property',
    desc: 'From trademark registration to patent and design filings and copyright protection, we secure and enforce the IP portfolio so the value you create stays yours.',
    highlights: ['Trademark & renewal', 'Patent & design filings', 'Copyright protection', 'IP enforcement & enforcement'],
    heading: 'Protecting the Ideas That Drive Value',
    intro: [
      'Brands, patents, designs and original works are among a business\u2019s hardest-won assets. We help you obtain rights to them, register them correctly, defend them against misuse, and licence the value they create.',
      'Our IP team guides you through registration and renewals in Nepal and internationally, and supports the agreements — licensing, confidentiality and employment — that keep your rights inside your business.'
    ],
    quote: 'An IP right that is not protected is simply an idea. We help you turn it into property.',
    servicesHeading: 'Our Intellectual Property Services',
    services: [
      'Trademark search, filing and registration',
      'Patent and design filing',
      'Copyright protection and drafting',
      'Trademark and design renewals and oppositions',
      'IP infringement notices and enforcement',
      'Licensing, assignments and confidentiality agreements',
      'Domain name disputes and procedures',
      'IP litigation and ADR'
    ],
    sectorsHeading: 'What We Protect',
    sectors: 'We advise brands and rights across technology, media, publishing, consumer goods, pharmaceuticals and the creative industries — the businesses whose worth sits largely in their intellectual property.',
    why: 'We focus on making IP enforceable, transferable and valuable. From the search report at the start to litigation at the end, we manage the full life of your rights.'
  },
  {
    id: 'labor', img: paLabor, icon: '👥', title: 'Labor & Employment Law',
    desc: 'Practical employment advice spanning contracts, workplace compliance, disputes, collective bargaining, and HR policy — keeping your workforce and your business aligned.',
    highlights: ['Employment contracts & policies', 'Labour compliance', 'Collective bargaining', 'Work redundancy & dispute resolution'],
    heading: 'Labor & Employment Advisory',
    intro: [
      'A well-managed workforce begins with clear, lawful contracts and workplace policies. We draft employment agreements that meet the Labor Act, set out rights and responsibilities, and protect confidential information and developments.',
      'We also keep employers aligned with consistent, recurrent requirements across employees, leaves, working hours, social security and the full annual compliance calendar.'
    ],
    quote: 'Clear and lawful employment documents are the foundation of an engaged, low-conflict workforce.',
    servicesHeading: 'Our Services',
    services: [
      'Employment contract and HR policy drafting',
      'Workplace compliance under the Labor Act',
      'Social security registration and contributions',
      'Disciplinary procedures and grievance handling',
      'Termination, severance and settlement',
      'Collective bargaining and trade unions',
      'Retrenchment and workforce restructuring',
      'Employment and industrial disputes'
    ],
    sectorsHeading: 'Who We Serve',
    sectors: 'We advise employers of all sizes — from start to fully-operating companies — and a wide range of sectors where a fair and compliant workforce is essential to the business.',
    why: 'Our employment team gives practical, timely advice that keeps you compliant without slowing your business. When a dispute arrives, we resolve it fairly and protectively.'
  },
  {
    id: 'realestate', img: paRealestate, icon: '🏠', title: 'Real Estate & Property',
    desc: 'Property due diligence, title verification, land acquisition, lease arrangements, and property dispute resolution — so you transact with certainty and minimum risk.',
    highlights: ['Title & due diligence', 'Land acquisition & transfers', 'Lease & property agreements', 'Real-estate dispute resolution'],
    heading: 'Property and Real Estate Advisory',
    intro: [
      'Every land and property deal in Nepal carries title, boundary and the interaction of all the zoning and approval layers around it. We run thorough and verified title and due-diligence so that you buy exactly what you intend.',
      'We prepare the documentation to transfer, register and complete purchases and leases, coordinating with land revenue offices and planning authorities on both commercial and development projects.'
    ],
    quote: 'A clean title check upfront is the cheapest protection a property transaction can buy.',
    servicesHeading: 'Our Services',
    services: [
      'Title checks, title and due diligence',
      'Land acquisition and transfer',
      'Land use and verification of boundaries',
      'Sale, purchase and construction agreements',
      'Lease and license documentation',
      'Development and co-operation framework',
      'Registration and valuation of transactions',
      'Property litigation and mediation'
    ],
    sectorsHeading: 'Who We Serve',
    sectors: 'We advise developers, investors, businesses and home buyers — on land purchase, commercial property, leasing, and property related to projects and funding.',
    why: 'We combine meticulous title and due diligence with trustworthy documentation and practical closing. When the deal is important, we make it certain and secure.'
  },
  {
    id: 'tax', img: paTax, icon: '📊', title: 'Taxation',
    desc: 'Strategic tax planning, tax compliance, VAT advisory, international tax structuring, and representation in tax disputes. Helping you stay compliant while you optimise what you keep.',
    highlights: ['Tax planning & compliance', 'VAT advisory & filing', 'International tax structuring', 'Tax dispute representation'],
    heading: 'Taxation Advisory & Compliance',
    intro: [
      'Compliance begins with planning. Our tax team supports companies and individuals with advance tax planning, structuring transactions correctly, and ongoing compliance with the Income Tax Act and the VAT regime in Nepal.',
      'We prepare, file and defend tax positions — VAT registration and returns, withholding — and support the international documentation that cross-border and large corporate structures require.'
    ],
    quote: 'Good tax planning starts on day one. We help you pay the correct amount of tax and no more.',
    servicesHeading: 'Our Taxation Services',
    services: [
      'Corporate and personal tax planning',
      'Annual return preparation and review',
      'Tax compliance and registration',
      'VAT advisory, registration and returns',
      'Withholding and payroll tax',
      'Cross-border tax structuring and transfer pricing',
      'Representation before tax authorities',
      'Tax dispute and assessment strategy'
    ],
    sectorsHeading: 'Who We Serve',
    sectors: 'We advise domestic and international companies, investors, professionals and individuals — from start-ups to established corporates — across all sectors.',
    why: 'We help you pay the correct amount of tax and no more. Precisely filing and a clear strategy on disputes means you keep more of what you earn. Territory lab results.'
  }
];
const LAWYERS_SEED = [
  { id: 'nikesh', img: teamNikesh, name: 'Nikesh Nepal', designation: 'Legal Associate', bio: 'Civil Law, Corporate Law, Contract Drafting', email: 'nikesh@plutoassociates.com', phone: '', linkedin: '', focus: 'Corporate Law, Contract Drafting', featured: true },
  { id: 'sujan', img: teamSujan, name: 'Sujan Subedi', designation: 'Legal Associate', bio: 'Corporate Law, Litigation, Compliance', email: 'sujan@plutoassociates.com', phone: '', linkedin: '', focus: 'Corporate Law, Litigation, Compliance', featured: false },
  { id: 'neehal', img: teamNeehal, name: 'Neehal Pokharel', designation: 'Legal Associate', bio: 'Corporate Law, Litigation, Compliance', email: 'neehal@plutoassociates.com', phone: '', linkedin: '', focus: 'Corporate Law, Litigation, Compliance', featured: false },
  {
    id: 'sudeep',
    img: teamSudeep,
    name: 'Adv. Sudeep Nepal',
    designation: 'Founder & Senior Partner',
    bio: 'Adv. Sudeep Nepal is the founding partner of Pluto Associates, bringing years of extensive experience in corporate law, FDI, litigation, and regulatory affairs. He has represented clients before the Supreme Court of Nepal, appellate courts, and various tribunals.',
    email: 'sudeep@plutoassociates.com',
    phone: '+977-9802356987',
    linkedin: '',
    focus: 'Cross-border investments, commercial litigation, strategic legal advisory',
    featured: false,
  },
];

const CATEGORIES_SEED = [
  { id: 'fdi', name: 'FDI & Investment', slug: 'fdi' },
  { id: 'corporate', name: 'Corporate Law', slug: 'corporate' },
  { id: 'energy', name: 'Energy Law', slug: 'energy' },
  { id: 'ip', name: 'Intellectual Property', slug: 'ip' },
  { id: 'labor', name: 'Labor & Employment', slug: 'labor' },
];

const TAGS_SEED = [
  'FDI',
  'Company Registration',
  'Nepal Investment',
  'Corporate Law',
  'Directors Duties',
  'Governance',
  'Trademark',
  'Intellectual Property',
  'Renewable Energy',
  'Hydropower',
  'Employment Law',
  'Labor Act 2074',
].map((t, i) => ({ id: 't' + (i + 1), name: t, slug: t.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));

const FAQS_SEED = FAQ_SEED;

const HOMEPAGE_SEED = {
  hero: {
    badge: 'Est. 2019 · Nepal Bar Association Registered',
    headline: 'Where Legal Excellence Meets Client Trust',
    subheadline: "Pluto Associates delivers strategic, results-driven legal counsel across Nepal — combining deep regulatory insight with unwavering commitment to our clients' success.",
    ctaPrimary: 'Schedule a Consultation',
    ctaSecondary: 'Explore Our Services',
  },
  stats: [
    { label: 'Years Combined Experience', value: '30+' },
    { label: 'Cases Successfully Resolved', value: '500+' },
    { label: 'Practice Areas', value: '15+' },
    { label: 'Client Satisfaction Rate', value: '95%' },
  ],
  servicesSection: {
    visible: true,
    title: 'Our Services',
    subtitle: 'A full suite of legal services across nine practice groups — one trusted team for every matter.',
    ctaLabel: 'View All Services',
  },
};

const SITE_SETTINGS_SEED = {
  name: 'Pluto Associates',
  tagline: 'Advocates & Legal Consultants',
  logo,
  address: 'Kathmandu, Nepal',
  phone: '+977-9802356987',
  whatsapp: '9779802356987',
  email: 'info@plutoassociates.com',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2!2d85.324!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAxLjkiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1',
  hours: 'Sunday – Friday: 10:00 AM – 6:00 PM',
  hoursSat: 'Saturday: Closed',
  social: { facebook: 'https://facebook.com', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com', instagram: 'https://instagram.com', youtube: '' },
  footerAbout: 'Pluto Associates is a full-service law firm based in Kathmandu, Nepal, providing expert legal solutions across corporate law, FDI, litigation, intellectual property, and more.',
  copyright: '© {year} Pluto Associates. All rights reserved.',
  imgMaxWidth: 1600,
  imgQuality: 85,
};

/* ------------------------------------------------------------------ */
/* Media library (uploads stored as data URLs in localStorage)         */
/* ------------------------------------------------------------------ */
const MEDIA_KEY = 'pluto_media';
export function getMedia() {
  try {
    return JSON.parse(localStorage.getItem(MEDIA_KEY)) || [];
  } catch {
    return [];
  }
}
export function getMediaById(id) {
  return getMedia().find((m) => m.id === id) || null;
}
export function saveMedia(list) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(list));
}

/* ------------------------------------------------------------------ */
/* Contact messages (inbox)                                            */
/* ------------------------------------------------------------------ */
const MSG_KEY = 'pluto_messages';
export function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY)) || [];
  } catch {
    return [];
  }
}
export function saveMessages(list) {
  localStorage.setItem(MSG_KEY, JSON.stringify(list));
}
export function addMessage(msg) {
  const list = getMessages();
  list.push(msg);
  saveMessages(list);
  return msg;
}

/* ------------------------------------------------------------------ */
/* Exported collections + helpers                                      */
/* ------------------------------------------------------------------ */
export const collections = {
  practiceAreas: makeCollection('pa_areas', PRACTICE_AREAS_SEED),
  lawyers: makeCollection('pa_lawyers', LAWYERS_SEED),
  categories: makeCollection('pa_categories', CATEGORIES_SEED),
  tags: makeCollection('pa_tags', TAGS_SEED),
  faqs: makeCollection('pa_faqs', FAQS_SEED),
};

export function getPracticeAreas() { return collections.practiceAreas.get(); }
export function savePracticeAreas(list) { collections.practiceAreas.set(list); }

export function getLawyers() { return collections.lawyers.get(); }
export function saveLawyers(list) { collections.lawyers.set(list); }

export function getCategories() { return collections.categories.get(); }
export function saveCategories(list) { collections.categories.set(list); }

export function getTags() { return collections.tags.get(); }
export function saveTags(list) { collections.tags.set(list); }

export function getFaqs() { return collections.faqs.get(); }
export function saveFaqs(list) { collections.faqs.set(list); }

/* ---------------- single-object stores (homepage, site settings) ---------------- */
export function getHomepage() {
  try {
    const s = JSON.parse(localStorage.getItem('pa_homepage'));
    return s ? { ...structuredClone(HOMEPAGE_SEED), ...s } : HOMEPAGE_SEED;
  } catch {
    return HOMEPAGE_SEED;
  }
}

function getSite() {
  try {
    const s = JSON.parse(localStorage.getItem('pa_site'));
    return s ? { ...SITE_SETTINGS_SEED, ...s } : SITE_SETTINGS_SEED;
  } catch {
    return SITE_SETTINGS_SEED;
  }
}
export function getSettings() { return getSite(); }
export function saveSettings(settings) { localStorage.setItem('pa_site', JSON.stringify(settings)); }
export function saveHomepage(homepage) { localStorage.setItem('pa_homepage', JSON.stringify(homepage)); }

/* small helper: stable id */
export function uid(prefix = 'p') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

export function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}