/**
 * Patch existing seed articles: add seoTitle/seoDesc + deepen internal links.
 * Run: node scripts/patch-articles.cjs
 */
const fs = require('fs');
const path = require('path');
const FILE = path.resolve('src/content/articles.json');
const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const PATCH = {
  'seed-fdi-company-setup-2025': {
    seoTitle: 'How Foreign Investors Can Set Up a Company in Nepal | Pluto Associates',
    seoDesc: 'How foreign investors can set up a company in Nepal under FITTA and the Companies Act: structure, approvals, incorporation steps, foreign investment thresholds and compliance.',
  },
  'seed-corporate-law-reforms-2026': {
    seoTitle: 'Corporate Law Reforms in Nepal: What Directors Need to Know | Pluto Associates',
    seoDesc: 'Directors\' duties under Nepal\'s Companies Act 2063: conflicts of interest, insolvency exposure, disclosure, beneficial ownership and practical governance steps for 2026.',
  },
  'seed-trademark-registration-guide': {
    seoTitle: 'Trademark Registration in Nepal: A Practical Guide | Pluto Associates',
    seoDesc: 'How to register a trademark in Nepal under the Patent, Design and Trademark Act: where to file, the process, distinctiveness, renewal every seven years and enforcement.',
  },
  'seed-renewable-energy-overview': {
    seoTitle: 'Renewable Energy Projects in Nepal: Legal Overview | Pluto Associates',
    seoDesc: 'The legal framework for renewable energy and hydropower projects in Nepal: licensing under the Electricity Act, PPAs with NEA, project finance and environmental compliance.',
  },
  'seed-employment-law-guide': {
    seoTitle: 'Employment Law in Nepal: Employee & Employer Rights | Pluto Associates',
    seoDesc: 'Nepal\'s Labor Act 2074 explained: contracts, 48-hour week, leave, termination and severance, Social Security Fund contributions and the practical compliance checklist.',
  },
};

// Contextual internal links appended to specific articles (anchor varies per article)
const LINK_ADD = {
  'seed-fdi-company-setup-2025':
    '\n<p>For a closer look at the cost and sequence of the steps above, read our <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration guide</a>, and for the diaspora perspective see <a href="/publications/nrn-investment-in-nepal-guide">how non-resident Nepalis invest</a>.</p>',
  'seed-corporate-law-reforms-2026':
    '\n<p>New companies facing these duties should also see our <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration guide</a>, and directors running a business with staff can start with our <a href="/publications/employment-law-in-nepal-employee-rights-and-obligations">employment law overview</a>.</p>',
  'seed-trademark-registration-guide':
    '\n<p>Brand protection sits alongside property and business assets: see our guides on <a href="/publications/can-foreigners-buy-property-in-nepal">foreign property ownership</a> and <a href="/publications/pan-and-vat-registration-in-nepal">PAN and VAT registration</a> for the wider compliance picture.</p>',
  'seed-renewable-energy-overview':
    '\n<p>Energy investors entering Nepal should pair this overview with our step-by-step guides on <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration</a> and, for the diaspora, <a href="/publications/nrn-investment-in-nepal-guide">NRN investment</a>.</p>',
  'seed-employment-law-guide':
    '\n<p>Employers setting up in Nepal will find our <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration guide</a> and <a href="/publications/pan-and-vat-registration-in-nepal">PAN and VAT guide</a> useful companions to this overview.</p>',
};

let changed = 0;
const out = raw.map((a) => {
  const p = PATCH[a.id];
  const add = LINK_ADD[a.id];
  let c = a.content;
  if (add && !c.includes(add.trim())) c = c + add;
  if (p || c !== a.content) {
    changed++;
    return { ...a, ...(p || {}), content: c };
  }
  return a;
});

fs.writeFileSync(FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`patched ${changed} articles; total ${out.length}`);