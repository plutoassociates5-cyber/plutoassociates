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
    long: [
      'Nepal has opened its economy to foreign investment across a wide range of sectors, but the regulatory path remains nuanced. Our FDI practice helps foreign investors understand exactly where they can invest, at what participation threshold, and through which structure — before any commitment is made.',
      'We lead the entire authorisation workflow, including the Foreign Investment and Technology Transfer Act (FITTA 2075) approvals, sector eligibility screening, and registration with the Department of Industry. For larger or strategic projects, we liaise directly with the Investment Board Nepal and coordinate the permits, tax registrations, and banking steps that follow.',
      'Our team also structures joint ventures, drafts shareholder and investment agreements, and advises on repatriation, incentives, and ongoing compliance so that your entry into the Nepali market is not just legal, but commercially sound.'
    ]
  },
  {
    id: 'corporate', img: paCorporate, icon: '🏢', title: 'Corporate & Commercial Law',
    desc: 'End-to-end corporate services covering company registration, corporate governance, mergers & acquisitions, due diligence, and commercial contracts. We help businesses structure, grow, and transact with confidence at every stage.',
    highlights: ['Company registration & formation', 'Corporate governance & compliance', 'Mergers, acquisitions & due diligence', 'Commercial contract drafting & negotiation'],
    long: [
      'From incorporating your first private limited company to structuring complex group transactions, our corporate practice supports businesses at every stage of their lifecycle. We prepare all founding documents, navigate Office of the Company Registrar filings, and ensure your entity is properly capitalised and governed.',
      'For established companies, we provide continuous corporate governance support — shareholder and board resolutions, annual compliance filings, regulatory returns, and shareholder agreements, keeping your records audit-ready and your directors properly protected under the Companies Act.',
      'We also act on mergers, amalgamations, acquisitions, and group restructurings, conducting legal due diligence, negotiating transaction documents, and obtaining the necessary regulatory consents so that your deals close, and your post-closing structure is clean.'
    ]
  },
  {
    id: 'energy', img: paEnergy, icon: '⚡', title: 'Energy, Infrastructure & Project Finance',
    desc: 'Strategic legal advisory for energy and infrastructure — from hydropower to solar. Our team negotiates power purchase agreements, secures regulatory approvals, structures project financing, and resolves disputes to keep projects on track.',
    highlights: ['Power purchase agreements (PPAs)', 'Regulatory approvals & licensing', 'Project finance & structuring', 'Infrastructure dispute resolution'],
    long: [
      'Nepal\'s energy sector is among the most active in the region, and the legal framework around it is fast-moving. Our energy practice supports developers, lenders, and investors across hydropower, solar, and related infrastructure from the very first survey application through energisation.',
      'We negotiate and draft power purchase agreements with utilities, secure survey licences, generation licences, and environmental approvals, and advise on the regulatory conditions governing independent power producers. We also structure project finance — offtake, financing documents, security packages — to be bankable.',
      'When issues arise, our team provides a full dispute-resolution capability for energy and infrastructure, including settlement of construction and EPC disputes and enforcement of investment protection. Our goal is to keep your project generating value, on schedule and on budget.'
    ]
  },
  {
    id: 'banking', img: paBanking, icon: '🏦', title: 'Legal Finance Advisory',
    desc: 'Regulatory compliance, lending documentation, financial restructuring, and secured financing advice. We advise and represent banks, financial institutions, and borrowers to protect every transaction and recover the value owed.',
    highlights: ['Loan & facility documentation', 'Regulatory compliance advisory', 'Repayment & restructuring', 'Default & recovery representation'],
    long: [
      'Our banking and finance practice advises lenders and borrowers across facilities, security structures, and day-to-day lending operations. We document loans efficiently, structure security, and prepare the standard conditions that govern each facility.',
      'When difficulties arise, we guide clients through restructuring and negotiated settlements, and represent them in recovery proceedings where the courts or regulators become involved. We understand how interest, security ranking, and enforcement interact, to protect the creditor or the borrower position effectively.',
      'We also provide recurring regulatory compliance support to banks and financial institutions — covering documentation standards, consumer protections, and the regulations of the central bank — so that lending activity stays on the right side of the law.'
    ]
  },
  {
    id: 'litigation', img: paLitigation, icon: '⚖️', title: 'Litigation & Dispute Resolution',
    desc: 'Trial-tested representation across all levels of the Nepali judiciary, together with arbitration, mediation, and alternative resolution. We pursue outcomes that protect your rights and your business.',
    highlights: ['Civil & commercial litigation', 'Arbitration & mediation', 'Appellate representation', 'Strategic dispute resolution'],
    long: [
      'When a dispute escalates to the courts, you need representation that is thorough, strategic, and persuasive in the Nepali judicial system. Our litigation team appears before all levels of the judiciary — from district courts to the Supreme Court and specialist tribunals — with a reputation for preparation at every hearing.',
      'We begin every case with a candid assessment: whether litigation is the right path, what the realistic outcomes are, and what it will cost. Where a better route exists, we recommend mediation, settlement negotiations, or arbitration for commercial disputes.',
      'We manage each case in full: drafting pleadings and written submissions, advancing and meeting filing deadlines, leading evidence, arguing motions, and pursuing appeals. Our goal is to resolve the matter in the most effective way possible — and to defend your interests if you choose to go to trial.'
    ]
  },
  {
    id: 'ip', img: paIp, icon: '💡', title: 'Intellectual Property',
    desc: 'From trademark registration and patent filing to copyright protection and enforcement, we build and secure your IP portfolio so the value you create stays yours — including renewals and oppositions.',
    highlights: ['Trademark registration & renewal', 'Patent & design filings', 'Copyright protection', 'IP enforcement & litigation'],
    long: [
      'Your brand, inventions, designs and original works are valuable business assets — and we help you own, and defend them. Our IP practice covers end-to-end protection for trademarks, patents, designs, and copyright under Nepal\'s framework and international conventions.',
      'We conduct searches to confirm availability, prepare and file applications with the Department of Industry, and manage examination, registration, renewals and oppositions. We also run watching programs so that you can act quickly when a similar mark or design appears in the market.',
      'Where rights are infringed, we enforce them — issuing takedowns and cease notices, negotiating and, where necessary, litigating IP disputes. We also advise on licensing and commercial exploitation so your intangible assets carry real monetary value.'
    ]
  },
  {
    id: 'labor', img: paLabor, icon: '👥', title: 'Labor & Employment Law',
    desc: 'Practical employment advice spanning contracts, workplace compliance, dispute resolution, collective bargaining, and HR policy — keeping your workforce and your business aligned.',
    highlights: ['Employment contracts & policies', 'Labour compliance (Labor Act 2074)', 'Collective bargaining', 'Workplace dispute resolution'],
    long: [
      'A well-managed workforce begins with clear, lawful contracts and policies. We draft employment agreements that comply with the Labor Act, set out rights, and clearly define expectations in rolling provisions and intellectual property protection.',
      'Our practice keeps employers aligned with mandatory requirements — from leaves, allowances and grievance procedures to social security enrolment under the Social Security Fund. We review HR handbooks and ensure termination, and severance are handled correctly.',
      'When workplace issues arise, we step in regardless of whether it is a disciplinary matter, a dispute, or collective bargaining with a union. Our cases regularly help employers resolve issues fairly, while protecting the business.'
    ]
  },
  {
    id: 'realestate', img: paRealestate, icon: '🏠', title: 'Real Estate & Property',
    desc: 'Property due diligence, title verification, land acquisition, lease arrangements, and real-estate disputes handled with practical advice — so you transact with certainty and minimum risk.',
    highlights: ['Title & due diligence', 'Land acquisition & transfers', 'Lease & property agreements', 'Real-estate dispute resolution'],
    long: [
      'Every land or property deal in Nepal carries title, and boundary, and town-planning considerations. We run robust due diligence on land titles, so that you really buy what you intend to buy — with full verification of records, and planning compliance.',
      'We prepare and complete the transfer documentation and registration, coordinate with land revenue offices and municipalities, and structure the transaction, including lease structures for commercial property and developments.',
      'When conflicts over boundaries, ownership, or tenancy arise, we resolve them through negotiation and, if needed, litigation. Our property practice gives both private and business clients the confidence to transact with certainty.'
    ]
  },
  {
    id: 'tax', img: paTax, icon: '📊', title: 'Taxation',
    desc: 'Strategic tax planning, tax compliance, VAT advisory, international tax structuring, and representation in tax disputes. We help you stay compliant while optimising what you keep.',
    highlights: ['Tax planning & compliance', 'VAT advisory & filing', 'International tax structuring', 'Tax dispute representation'],
    long: [
      'Efficient, compliant taxation begins with correct planning from the outset. Our tax practitioner helps individuals and companies with advance planning, structuring transactions, and ongoing compliance with the Income Tax Act and VAT regime in Nepal.',
      'We support your filings, deductions and documentation, VAT registration and returns, and the disclosure that is required across corporate and international structures — including withholding and permanent establishment considerations for cross-border activity.',
      'Where disputes arise — an assessment, denial of a deduction, or an audit adjustment — we represent you in internal revenue proceedings and drive for the most efficient resolution. We combine technical tax advice with practical business strategy.'
    ]
  },
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

const FAQS_SEED = [
  { id: 'f1', area: 'fdi', question: 'How can foreign investors set up a business in Nepal?', answer: 'We guide foreign investors through the full process — sector eligibility, FITTA compliance, company registration, and required approvals from the Department of Industry and Investment Board Nepal.', order: 1 },
  { id: 'f2', area: 'corporate', question: 'What services are included in corporate compliance?', answer: 'Company registration, board and shareholder resolutions, annual filings with the Office of the Company Registrar, and drafting of commercial agreements.', order: 2 },
  { id: 'f3', area: 'energy', question: 'What does a power purchase agreement (PPA) involve?', answer: 'Negotiation of tariffs, terms, conditions, and dispute mechanisms between an independent power producer and the electricity buyer, ensuring bankable and enforceable terms.', order: 3 },
  { id: 'f4', area: 'ip', question: 'How do I register a trademark in Nepal?', answer: 'We handle the entire trademark filing process — search, application with the Department of Industry, examination, and registration, including renewals and oppositions.', order: 4 },
  { id: 'f5', area: 'labor', question: 'Which labor regulations apply to my company in Nepal?', answer: 'The Labor Act, 2074 and the Social Security Act, 2074 govern employment contracts, working hours, severance, and mandatory social security contributions.', order: 5 },
];

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