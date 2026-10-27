const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'content', 'articles.json');
const NOW = '2026-10-27T10:00:00.000Z';

const DESCRIPTIONS = {
  'hotel-registration-in-nepal-through-foreign-investment': 'Register a hotel in Nepal via foreign investment: 100% ownership, classification categories, FDI threshold, DoT process, fees, renewals and tax incentives.',
  'establishing-an-industry-in-nepal-as-a-foreigner': 'How a foreigner establishes an industry in Nepal under FITTA 2019: investment forms, negative list, classification, approval routes and NRB compliance.',
  'education-consultancy-registration-in-nepal': 'Register an education consultancy in Nepal: legal framework, 7-step process, documents, fees, TITI counsellor rules, renewals, penalties and FAQs.',
  'travel-tours-trekking-agency-registration-in-nepal': 'Register a travel, tours or trekking agency in Nepal: categories, foreign-ownership rules, capital and bank guarantee, licensing process, fees and renewal.',
  'business-visa-nepal-for-foreign-investors': 'How to obtain a Business Visa in Nepal: eligibility, governing laws, required documents, government fees, processing time, renewal rules and FAQs.',
  'branch-vs-liaison-office-registration-in-nepal': 'Branch, liaison or subsidiary office in Nepal: permitted activities, DOI approval, OCR registration, tax, liability, timeline and compliance compared.',
  'indian-investors-registering-a-company-in-nepal': 'How Indian investors register a company in Nepal: FITTA approval, ownership rules, the negative list, documents, DTAA tax relief, and repatriation.',
  'hydropower-registration-in-nepal': 'Hydropower registration in Nepal: survey and generation licences, DOED vs IBN approval, real costs, statutory timelines and common pitfalls.',
  'fdi-registration-process-in-nepal': 'FDI registration in Nepal explained: DOI or IBN approval, OCR incorporation, NRB capital injection, documents, costs, timelines and common delays.',
  'how-foreign-investors-can-set-up-a-company-in-nepal': 'How foreign investors set up a company in Nepal: FDI approval, OCR incorporation, capital remittance, NRB recording, costs, timelines and compliance.',
  'key-corporate-law-reforms-in-nepal-what-directors-need-to-know': 'Corporate law reforms in Nepal and what directors must know: fiduciary duties, disclosure, related-party deals, beneficial ownership and insolvency risk.',
  'trademark-registration-in-nepal-a-practical-guide': 'Trademark registration in Nepal: search, filing, examination, opposition, seven-year validity, renewal and enforcement under the 2022 Act.',
  'renewable-energy-projects-in-nepal-legal-overview': 'Renewable energy projects in Nepal: Electricity Act licensing, NEA power purchase agreements, project finance, environmental and land compliance.',
  'employment-law-in-nepal-employee-rights-and-obligations': 'Employment law in Nepal: written contracts, working hours, leave, termination, severance, Social Security Fund contributions and employer compliance.',
  'divorce-in-nepal-process-cost-and-timeline': 'How divorce works in Nepal under the Civil Code 2074: mutual consent and contested routes, grounds, documents, courts, costs and timelines.',
  'how-to-register-an-ngo-in-nepal': 'How to register an NGO in Nepal: the DAO route, Social Welfare Council affiliation, documents, PAN, bank account and annual compliance.',
  'nrn-investment-in-nepal-guide': 'NRN investment in Nepal: how non-resident Nepalis invest, FITTA treatment, thresholds, company registration, repatriation and practical steps.',
  'can-foreigners-buy-property-in-nepal': 'Can foreigners buy property in Nepal? The rules on land ownership, leases, foreign-invested companies, apartments and safe structures for NRNs.',
  'pan-and-vat-registration-in-nepal': 'PAN and VAT registration in Nepal: who needs each, documents, thresholds, branch registration, late penalties and the compliance that follows.',
  'bail-in-nepal-how-to-apply': 'Bail in Nepal: how to apply, what courts consider, bailable versus non-bailable offences, surety, refusal and the first steps after arrest.',
  'company-registration-in-nepal-costs-documents-timeline': 'Company registration in Nepal: company types, OCR process, documents, government fees, timelines and post-incorporation compliance for 2026.',
  'obtaining-business-licences-and-approvals-in-nepal': 'Business licences and approvals in Nepal: how to map your activity to the right ministry, apply correctly and keep sector permits current.',
  'real-estate-licensing-and-project-approvals-in-nepal': 'Real estate licensing in Nepal: land-use and zoning, building permits, developer registration, project approval and title verification.',
  'business-approvals-every-company-in-nepal-should-track': 'Business approvals in Nepal: PAN, VAT, social security, municipal registration, sector permits and the compliance calendar every company needs.',
  'automatic-route-of-fdi-in-nepal': "Nepal's automatic FDI route: who qualifies, minimum thresholds, restricted sectors, the seven-day approval timeline and how to file correctly.",
  'repatriating-profits-from-nepal': 'Repatriating profits from Nepal: dividends, share sale and loan repayments, DOI/IBN and NRB approval, tax clearance, DTAA relief and documents.',
  'work-permits-for-foreign-employees-in-nepal': 'Work permits for foreign employees in Nepal: labour permit, work permit endorsement, non-tourist visa, labour market testing and renewal.',
  'company-renewal-and-annual-compliance-in-nepal': 'Company renewal and annual compliance in Nepal: OCR annual return, audit and financial statements, tax filings, industry renewal and late fees.',
  'types-of-companies-in-nepal': 'Types of companies in Nepal: private and public limited, branch, liaison, partnership and sole proprietorship, with ownership and liability rules.',
  'company-formation-documents-in-nepal': 'Company formation documents in Nepal: what the memorandum and articles of association must contain, the OCR checklist and common filing errors.',
  'double-tax-avoidance-agreements-and-nepal': 'Double tax avoidance agreements and Nepal: treaty countries, reduced withholding on dividends, interest and royalties, and how to claim relief.',
  'mergers-and-acquisitions-in-nepal': 'Mergers and acquisitions in Nepal: Companies Act process, share versus asset purchases, FDI and NRB steps, competition rules and due diligence.',
};

const TARGETS = {
  'company-registration-in-nepal-costs-documents-timeline': {
    title: 'Company Registration in Nepal 2026: Costs, Documents, Timeline',
    seoTitle: 'Company Registration in Nepal 2026: Cost & Timeline',
    seoDesc: DESCRIPTIONS['company-registration-in-nepal-costs-documents-timeline'],
    metaKeywords: 'company registration in Nepal, company registration cost in Nepal, register a company in Nepal, OCR company registration, private limited company Nepal, company registration documents Nepal, company incorporation timeline Nepal',
    featuredImage: '/images/company-registration-nepal-2026.jpg',
    featuredImageAlt: 'Company registration in Nepal: OCR incorporation, documents and costs',
    canonical: '/publications/company-registration-in-nepal-costs-documents-timeline',
    excerpt: 'Company registration in Nepal at the OCR: company types, the step-by-step process, documents, costs, timelines, and the compliance that follows incorporation.',
    tags: ['Company Registration', 'Companies Act 2063', 'OCR Nepal', 'Incorporation', 'FDI'],
  },
  'how-foreign-investors-can-set-up-a-company-in-nepal': {
    title: 'How Foreign Investors Can Set Up a Company in Nepal in 2026',
    seoTitle: 'Set Up a Company in Nepal as a Foreign Investor (2026)',
    seoDesc: DESCRIPTIONS['how-foreign-investors-can-set-up-a-company-in-nepal'],
    metaKeywords: 'set up a company in Nepal, foreign investor company registration Nepal, FDI company setup Nepal, foreign ownership Nepal, FITTA 2075, DOI approval, NRB capital recording',
    featuredImage: '/images/foreign-company-setup-nepal-2026.jpg',
    featuredImageAlt: 'Foreign investor setting up a company in Nepal under FITTA',
    canonical: '/publications/how-foreign-investors-can-set-up-a-company-in-nepal',
    excerpt: 'A practical guide for foreign investors setting up a company in Nepal: FITTA approval, incorporation, capital remittance, NRB recording, costs and compliance.',
    tags: ['FDI', 'Company Registration', 'Nepal Investment', 'FITTA', 'DOI', 'NRB'],
  },
  'fdi-registration-process-in-nepal': {
    title: 'FDI Registration in Nepal: Step-by-Step Guide (2026)',
    seoTitle: 'FDI Registration in Nepal: Step-by-Step Guide (2026)',
    seoDesc: DESCRIPTIONS['fdi-registration-process-in-nepal'],
    metaKeywords: 'FDI registration in Nepal, foreign direct investment Nepal, FDI approval process Nepal, DOI approval, IBN approval, NRB capital injection, FITTA 2075, FDI documents Nepal',
    featuredImage: '/images/fdi-registration-nepal-2026.jpg',
    featuredImageAlt: 'FDI registration process in Nepal: DOI approval to NRB capital recording',
    canonical: '/publications/fdi-registration-process-in-nepal',
    excerpt: 'The full FDI registration sequence in Nepal, from DOI or IBN approval and OCR incorporation to NRB capital recording, documents, costs and timelines.',
    tags: ['FDI', 'FITTA', 'DOI', 'Company Registration', 'Nepal Investment', 'Foreign Investor', 'NRB'],
  },
  'branch-vs-liaison-office-registration-in-nepal': {
    title: 'Branch vs Liaison vs Subsidiary Office in Nepal',
    seoTitle: 'Branch vs Liaison vs Subsidiary Office in Nepal',
    seoDesc: DESCRIPTIONS['branch-vs-liaison-office-registration-in-nepal'],
    metaKeywords: 'branch office registration Nepal, liaison office Nepal, subsidiary company Nepal, foreign company registration Nepal, DOI approval branch office, OCR registration foreign company, branch vs subsidiary Nepal',
    featuredImage: '/images/branch-liaison-subsidiary-nepal-2026.jpg',
    featuredImageAlt: 'Branch vs liaison vs subsidiary office in Nepal compared',
    canonical: '/publications/branch-vs-liaison-office-registration-in-nepal',
    excerpt: 'Branch, liaison or subsidiary? Compare permitted activities, DOI approval, OCR registration, tax, liability, repatriation and timelines before choosing a Nepal presence.',
    tags: ['Foreign Investment', 'Branch Office', 'Liaison Office', 'Subsidiary', 'Companies Act', 'FDI', 'DOI'],
  },
  'repatriating-profits-from-nepal': {
    title: 'Repatriating Profits from Nepal: Dividends, Capital & Tax',
    seoTitle: 'Repatriating Profits from Nepal: Dividends & Tax (2026)',
    seoDesc: DESCRIPTIONS['repatriating-profits-from-nepal'],
    metaKeywords: 'repatriate profits from Nepal, dividend repatriation Nepal, NRB approval repatriation, foreign investment repatriation, DTAA withholding Nepal, tax clearance Nepal, DOI repatriation approval',
    featuredImage: '/images/repatriation-profits-nepal-2026.jpg',
    featuredImageAlt: 'Repatriating profits and dividends from Nepal',
    canonical: '/publications/repatriating-profits-from-nepal',
    excerpt: 'How foreign investors repatriate dividends, share sale proceeds and loan repayments from Nepal, including tax clearance, DOI or IBN approval and NRB remittance.',
    tags: ['FDI', 'Repatriation', 'Dividends', 'Tax', 'NRB', 'DOI', 'DTAA'],
  },
};

function decode(value) {
  return String(value || '')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanFaqs(items) {
  const seen = new Set();
  const out = [];
  for (const item of items || []) {
    const q = decode(item && (item.q || item.name)).trim();
    const a = decode(item && (item.a || item.text)).trim();
    if (!q || !a || q.length < 8 || a.length < 10) continue;
    if (/^sources?:?$/i.test(q)) continue;
    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ q, a });
  }
  return out;
}

function extractFaqs(html) {
  const faqs = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const obj = JSON.parse(m[1]);
      const page = obj['@type'] === 'FAQPage'
        ? obj
        : (obj['@graph'] || []).find((node) => node['@type'] === 'FAQPage');
      if (page) {
        for (const q of page.mainEntity || []) {
          faqs.push({ q: q.name, a: q.acceptedAnswer && q.acceptedAnswer.text });
        }
      }
    } catch {
      // leave malformed JSON-LD out of the migration
    }
  }
  return faqs;
}

function replaceOnce(html, from, to, label) {
  const first = html.indexOf(from);
  if (first === -1) throw new Error(`Anchor not found (${label}): ${from.slice(0, 80)}`);
  if (html.indexOf(from, first + 1) !== -1) throw new Error(`Anchor is not unique (${label}): ${from.slice(0, 80)}`);
  return html.slice(0, first) + to + html.slice(first + from.length);
}

function figure(src, alt, caption) {
  return `<figure>\n<img src="${src}" alt="${alt}" width="1200" height="675" loading="lazy" decoding="async" />\n<figcaption>${caption}</figcaption>\n</figure>`;
}

const related = (items) => `<p><strong>Related guides:</strong> ${items.join(', ')}.</p>`;

const articles = JSON.parse(fs.readFileSync(FILE, 'utf8'));

for (const article of articles) {
  const raw = String(article.content || '');
  const faqs = extractFaqs(raw);
  let html = raw.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/gi, '');
  article.content = html;
  article.faqs = cleanFaqs([...(article.faqs || []), ...faqs]);
  if (DESCRIPTIONS[article.slug]) article.seoDesc = DESCRIPTIONS[article.slug];
  if (!article.excerpt || !/[.!?]$/.test(String(article.excerpt).trim())) article.excerpt = article.seoDesc;
  if (!article.metaKeywords) article.metaKeywords = [...(article.tags || []), article.title].join(', ');
}

const bySlug = new Map(articles.map((a) => [a.slug, a]));

for (const [slug, meta] of Object.entries(TARGETS)) {
  const article = bySlug.get(slug);
  if (!article) throw new Error(`Missing target article: ${slug}`);
  Object.assign(article, meta);
  article.modifiedAt = NOW;
}

{
  const a = bySlug.get('company-registration-in-nepal-costs-documents-timeline');
  a.content = replaceOnce(
    a.content,
    'and we cover that separately in our guide for foreign investors.</p>',
    'and we cover that separately in our <a href="/publications/how-foreign-investors-can-set-up-a-company-in-nepal">guide for foreign investors</a>.</p>\n' + figure(
      '/images/company-registration-steps-nepal.jpg',
      'Company registration process in Nepal: name clearance, MoA and AoA, OCR filing, PAN and VAT, bank account',
      'The sequence for a domestic private limited company. Foreign investment adds a DOI approval before incorporation.'
    ),
    'company registration figure'
  );
  a.content = replaceOnce(
    a.content,
    'See our FDI guide for the full sequence.</p>',
    'See our <a href="/publications/fdi-registration-process-in-nepal">FDI registration guide</a> for the full sequence.</p>',
    'company registration FDI link'
  );
  a.content = replaceOnce(
    a.content,
    'Putting the statutory calendar in place early avoids that.</p>',
    'Putting the statutory calendar in place early avoids that. Our <a href="/publications/company-renewal-and-annual-compliance-in-nepal">annual compliance guide</a> sets out the recurring filings.</p>',
    'company registration compliance link'
  );
  a.content = replaceOnce(
    a.content,
    '<h2>How Pluto Associates can help</h2>',
    related([
      '<a href="/publications/fdi-registration-process-in-nepal">FDI registration process in Nepal</a>',
      '<a href="/publications/minimum-foreign-investment-nepal">minimum foreign investment</a>',
      '<a href="/publications/branch-vs-liaison-office-registration-in-nepal">branch, liaison or subsidiary office</a>',
    ]) + '\n<h2>How Pluto Associates can help</h2>',
    'company registration related'
  );
}

{
  const a = bySlug.get('how-foreign-investors-can-set-up-a-company-in-nepal');
  a.content = replaceOnce(
    a.content,
    'Capital must enter through banking channels and be recorded at Nepal Rastra Bank.</p>',
    'Capital must enter through banking channels and be recorded at Nepal Rastra Bank.</p>\n' + figure(
      '/images/fdi-registration-steps-nepal.jpg',
      'Setting up a company in Nepal as a foreign investor: sector check, DOI approval, OCR incorporation, NRB capital recording and compliance',
      'Foreign investment approval comes before incorporation. Capital is recorded at NRB after the company is formed.'
    ),
    'foreign setup figure'
  );
  a.content = replaceOnce(
    a.content,
    'For most investors, a private limited company remains the simplest and most practical vehicle.</p>',
    'For most investors, a private limited company remains the simplest and most practical vehicle. If you are comparing structures, see our <a href="/publications/branch-vs-liaison-office-registration-in-nepal">branch, liaison and subsidiary guide</a>.</p>',
    'foreign setup structure link'
  );
  a.content = replaceOnce(
    a.content,
    'Confirm the current figure before structuring, as it can vary by sector and over time.',
    'Confirm the current figure before structuring, as it can vary by sector and over time; our guide to the <a href="/publications/minimum-foreign-investment-nepal">minimum foreign investment in Nepal</a> explains the NPR 20 million rule.',
    'foreign setup minimum link'
  );
  a.content = replaceOnce(
    a.content,
    'provided the investment was properly documented.</p>',
    'provided the investment was properly documented. For the approval sequence, see our <a href="/publications/repatriating-profits-from-nepal">guide to repatriating profits from Nepal</a>.</p>',
    'foreign setup repatriation link'
  );
  a.content = replaceOnce(
    a.content,
    '<p>We advise foreign investors at every stage, from entity formation to regulatory approvals and ongoing compliance.',
    related([
      '<a href="/publications/fdi-registration-process-in-nepal">FDI registration process</a>',
      '<a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration in Nepal</a>',
      '<a href="/publications/minimum-foreign-investment-nepal">minimum investment</a>',
      '<a href="/publications/repatriating-profits-from-nepal">repatriation</a>',
    ]) + '\n<h2>How Pluto Associates can help</h2>\n<p>We advise foreign investors at every stage, from entity formation to regulatory approvals and ongoing compliance.',
    'foreign setup CTA heading'
  );
}

{
  const a = bySlug.get('fdi-registration-process-in-nepal');
  a.content = replaceOnce(
    a.content,
    'above NPR 4 billion',
    'above NPR 6 billion',
    'FDI IBN threshold'
  );
  a.content = replaceOnce(
    a.content,
    'the legal minimum investment is NPR 20 million (roughly USD 150,000) under the Foreign Investment and Technology Transfer Act, 2075 (FITTA).',
    'the legal minimum investment is <a href="/publications/minimum-foreign-investment-nepal">NPR 20 million (roughly USD 150,000)</a> under the Foreign Investment and Technology Transfer Act, 2075 (FITTA).',
    'FDI minimum link'
  );
  a.content = replaceOnce(
    a.content,
    '</tbody></table>\n<p>In our practice, most delays come',
    '</tbody></table>\n' + figure(
      '/images/fdi-registration-steps-nepal.jpg',
      'FDI registration process in Nepal: sector check, DOI or IBN approval, OCR incorporation, NRB capital recording and compliance',
      'The five stages of FDI registration. The DOI or IBN approval must come before incorporation.'
    ) + '\n<p>In our practice, most delays come',
    'FDI figure'
  );
  a.content = replaceOnce(
    a.content,
    'With the FDI approval in hand, the company is incorporated under the Companies Act, 2063.',
    'With the FDI approval in hand, the company is incorporated under the Companies Act, 2063; our <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration guide</a> covers the OCR stage in detail.',
    'FDI incorporation link'
  );
  a.content = replaceOnce(
    a.content,
    'it is what allows you to repatriate profits and sale proceeds years later.',
    'it is what allows you to <a href="/publications/repatriating-profits-from-nepal">repatriate profits and sale proceeds</a> years later.',
    'FDI repatriation link'
  );
  a.content = replaceOnce(
    a.content,
    '<h2>Where FDI applications get stuck</h2>',
    `<h2>FDI registration documents checklist</h2>
<p>Prepare these before filing. Missing or inconsistent documents are the most common reason an application is returned.</p>
<ul>
<li>Project report with market, technical and financial sections</li>
<li>Investor passport, bio-data and board resolution</li>
<li>Parent company incorporation documents, apostilled and translated</li>
<li>Bank credibility letter and funding plan</li>
<li>Power of attorney for the Nepal representative</li>
<li>Joint venture agreement, where applicable</li>
<li>Proposed memorandum and articles of association</li>
<li>Sector licence or approval, where the activity requires one</li>
</ul>
<h2>Where FDI applications get stuck</h2>`,
    'FDI document checklist'
  );
  a.content = replaceOnce(
    a.content,
    '<h2>How Pluto Associates can help</h2>',
    related([
      '<a href="/publications/minimum-foreign-investment-nepal">minimum foreign investment</a>',
      '<a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration in Nepal</a>',
      '<a href="/publications/repatriating-profits-from-nepal">repatriating profits</a>',
      '<a href="/publications/branch-vs-liaison-office-registration-in-nepal">branch, liaison or subsidiary</a>',
    ]) + '\n<h2>How Pluto Associates can help</h2>',
    'FDI related'
  );
}

{
  const a = bySlug.get('branch-vs-liaison-office-registration-in-nepal');
  a.content = replaceOnce(
    a.content,
    'Two structures are available, and the choice matters, because the tax and immigration authorities treat them very differently. A branch office can trade, sign contracts and invoice in Nepal. A liaison office cannot. It exists to study the market and coordinate, and it must be funded from abroad.',
    'Three structures are commonly available, and the choice matters, because the tax and immigration authorities treat them very differently. A branch office can trade, sign contracts and invoice in Nepal. A liaison office cannot: it exists to study the market and coordinate, and it must be funded from abroad. A subsidiary is a separate Nepali company, usually a private limited company, with its own legal personality and limited liability.',
    'branch intro'
  );
  a.content = replaceOnce(
    a.content,
    '<p>A foreign company that wants a physical presence in Nepal has two routes. A branch office trades, contracts and invoices. A liaison office is non-trading and limited to market research and coordination. Both require prior approval from the Department of Industry (DOI), after which the office is registered with the Office of the Company Registrar (OCR) under the Companies Act, 2063. A branch office is for doing business in Nepal; a liaison office is for studying it.</p>',
    '<p>A foreign company that wants a physical presence in Nepal has three common routes. A branch office trades, contracts and invoices. A liaison office is non-trading and limited to market research and coordination. A subsidiary is a separate company incorporated in Nepal, usually as a private limited company. A branch or liaison office requires prior approval from the Department of Industry (DOI) and registration with the Office of the Company Registrar (OCR) under the Companies Act, 2063. A branch is for doing business in Nepal, a liaison office is for studying it, and a subsidiary is for a long-term local presence with limited liability.</p>',
    'branch quick answer'
  );
  a.content = replaceOnce(
    a.content,
    '<h2>Eligibility and the negative list</h2>',
    `<h2>Subsidiary company: the third option</h2>
<p>A subsidiary is not a branch. It is a separate company incorporated in Nepal, usually as a private limited company under the Companies Act, 2063. The foreign parent holds shares in the subsidiary, and the subsidiary contracts, employs staff and holds assets in its own name. That separation is the main advantage: the parent's liability is generally limited to its shareholding, and the Nepali business has a local legal identity that banks, landlords and regulators can deal with directly.</p>
<p>A subsidiary is the right choice when you want a long-term presence, local contracting, limited liability, or a vehicle that can bring in foreign investment under FITTA. It is more administratively demanding than a branch or liaison office because it must maintain its own accounts, tax filings and corporate records. For the incorporation sequence, see our <a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration guide</a>; for the investment approval, see our <a href="/publications/fdi-registration-process-in-nepal">FDI registration guide</a>.</p>
<table>
<thead>
<tr>
<th>Feature</th>
<th>Branch office</th>
<th>Liaison office</th>
<th>Subsidiary company</th>
</tr>
</thead>
<tbody>
<tr><td>Legal personality</td><td>No, extension of the parent</td><td>No</td><td>Yes, separate Nepali company</td></tr>
<tr><td>Can trade and invoice</td><td>Yes</td><td>No</td><td>Yes</td></tr>
<tr><td>Liability</td><td>Parent remains liable</td><td>Parent remains liable</td><td>Limited to shareholding</td></tr>
<tr><td>Tax registration</td><td>PAN and VAT as applicable</td><td>Limited</td><td>Full corporate tax and VAT</td></tr>
<tr><td>Profit repatriation</td><td>After tax and NRB approval</td><td>Not applicable</td><td>Dividends after tax and NRB approval</td></tr>
<tr><td>Best for</td><td>Contracts and projects</td><td>Market study</td><td>Long-term local presence</td></tr>
</tbody>
</table>
${figure(
  '/images/branch-liaison-subsidiary-comparison.jpg',
  'Branch vs liaison vs subsidiary office in Nepal: trading, liability, tax and repatriation compared',
  'A branch trades through the parent. A liaison office studies the market. A subsidiary is a separate Nepali company.'
)}
<h2>Eligibility and the negative list</h2>`,
    'branch subsidiary section'
  );
  a.content = replaceOnce(
    a.content,
    '<h2>How Pluto Associates can help</h2>',
    `<p><strong>Should I choose a subsidiary instead of a branch in Nepal?</strong></p>
<p>Choose a subsidiary if you want a separate Nepali company with limited liability, local contracting and a long-term presence. Choose a branch if the parent wants to trade directly and accepts parent-level liability.</p>
<p><strong>What is the difference between a branch and a subsidiary in Nepal?</strong></p>
<p>A branch has no separate legal personality and the foreign parent remains liable. A subsidiary is a separate company incorporated in Nepal, usually private limited, with its own legal personality and limited liability.</p>
${related([
  '<a href="/publications/fdi-registration-process-in-nepal">FDI registration</a>',
  '<a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration</a>',
  '<a href="/publications/minimum-foreign-investment-nepal">minimum investment</a>',
  '<a href="/publications/repatriating-profits-from-nepal">repatriation</a>',
])}
<h2>How Pluto Associates can help</h2>`,
    'branch FAQs and related'
  );
  a.faqs = cleanFaqs([
    ...a.faqs,
    {
      q: 'Should I choose a subsidiary instead of a branch in Nepal?',
      a: 'Choose a subsidiary if you want a separate Nepali company with limited liability, local contracting and a long-term presence. Choose a branch if the parent wants to trade directly and accepts parent-level liability.',
    },
    {
      q: 'What is the difference between a branch and a subsidiary in Nepal?',
      a: 'A branch has no separate legal personality and the foreign parent remains liable. A subsidiary is a separate company incorporated in Nepal, usually private limited, with its own legal personality and limited liability.',
    },
  ]);
}

{
  const a = bySlug.get('repatriating-profits-from-nepal');
  a.content = replaceOnce(
    a.content,
    'The bank will not release funds without both.</p>',
    `The bank will not release funds without both.</p>
<h2>The repatriation process, step by step</h2>
<ol>
<li><strong>Confirm what is being remitted.</strong> Identify whether it is a dividend, share sale proceeds, liquidation distribution, royalty, technology fee or loan repayment.</li>
<li><strong>Clear the tax position.</strong> File outstanding returns, settle corporate income tax and withholding tax, and obtain the tax clearance certificate.</li>
<li><strong>Pass the board resolution.</strong> Document the distribution or transfer and the amount payable to the foreign shareholder.</li>
<li><strong>Apply to the DOI or IBN.</strong> Submit the resolution, audited accounts, tax clearance, shareholding records and evidence of the original investment.</li>
<li><strong>Obtain NRB approval.</strong> Present the DOI or IBN clearance and the remittance request to Nepal Rastra Bank.</li>
<li><strong>Complete the bank transfer.</strong> The commercial bank verifies the approvals and releases the funds abroad.</li>
</ol>
${figure(
  '/images/repatriation-process-nepal.jpg',
  'Repatriating profits from Nepal: tax clearance, board resolution, DOI or IBN approval, NRB approval and bank transfer',
  'Tax clearance comes first. The DOI or IBN and NRB approvals follow before the bank releases the funds.'
)}`,
    'repatriation steps'
  );
  a.content = replaceOnce(
    a.content,
    'send a note through our contact page',
    'send a note through our <a href="/contact">contact page</a>',
    'repatriation contact link'
  );
  a.content = replaceOnce(
    a.content,
    '<p>If you are planning a repatriation and want to check your position before you begin,',
    related([
      '<a href="/publications/fdi-registration-process-in-nepal">FDI registration</a>',
      '<a href="/publications/minimum-foreign-investment-nepal">minimum investment</a>',
      '<a href="/publications/branch-vs-liaison-office-registration-in-nepal">branch, liaison or subsidiary</a>',
    ]) + '\n<h2>How Pluto Associates can help</h2>\n<p>If you are planning a repatriation and want to check your position before you begin,',
    'repatriation CTA heading'
  );
}

const newArticle = {
  id: 'seed-minimum-foreign-investment-nepal-2026',
  title: 'Minimum Foreign Investment in Nepal: NPR 20 Million Rule',
  slug: 'minimum-foreign-investment-nepal',
  content: `<p>Nepal's foreign investment rules are open in principle, but they are not open at any size. The law sets a minimum entry amount, and that figure shapes the structure, the approval route and the amount of capital that must be recorded at Nepal Rastra Bank. For most investors, the number to plan around is NPR 20 million.</p>
<p>This guide explains what the minimum means, what it covers, when it applies, and the mistakes that cause an otherwise viable project to fail at the approval stage.</p>
<h2>Quick answer</h2>
<p>The general minimum foreign investment in Nepal is NPR 20 million per foreign investor under the Foreign Investment and Technology Transfer Act, 2075 (FITTA) and the rules made under it. The threshold was reduced from NPR 50 million in October 2022. It is not a fee, and it is not the same as the company's paid-up capital. It is the minimum amount of foreign investment that must be approved and brought into Nepal through banking channels. Sector-specific exceptions and NRN concessions should be confirmed before you structure the investment.</p>
<table>
<thead>
<tr><th>Item</th><th>Detail</th></tr>
</thead>
<tbody>
<tr><td>General minimum</td><td>NPR 20 million per foreign investor</td></tr>
<tr><td>Legal basis</td><td>FITTA 2075 and the rules made under it</td></tr>
<tr><td>Change</td><td>Reduced from NPR 50 million by gazette in October 2022</td></tr>
<tr><td>Who it applies to</td><td>Foreign investors, including foreign companies and eligible NRNs, subject to sector rules</td></tr>
<tr><td>What it is not</td><td>A government fee, or the same thing as authorised or paid-up capital</td></tr>
<tr><td>Capital route</td><td>Banking channels, recorded with Nepal Rastra Bank</td></tr>
<tr><td>Approval authority</td><td>Department of Industry, or Investment Board Nepal above the statutory threshold</td></tr>
<tr><td>Typical timeline</td><td>Three to five months end to end</td></tr>
<tr><td>If the minimum is not met</td><td>Approval may be refused, or the structure must be revised</td></tr>
</tbody>
</table>
${figure(
  '/images/minimum-investment-check-nepal.jpg',
  "Minimum foreign investment in Nepal: sector check, investment route, NPR 20 million threshold, NRB recording and compliance",
  'The general rule is NPR 20 million per foreign investor. Sector rules and the investment route can change how it applies.'
)}
<h2>What the NPR 20 million minimum actually means</h2>
<p>The minimum is an entry threshold for foreign investment. It is the amount the foreign investor must commit and bring into Nepal under an approved investment. It is not a fee paid to the government, and it does not disappear into a licence. It becomes capital in the Nepali company, or the approved investment vehicle, and it must be documented from the first remittance.</p>
<p>That documentation is what makes the investment usable later. Nepal Rastra Bank records the inflow, and that record is the evidence you rely on when you want to repatriate dividends, sale proceeds or capital on exit. An investment that is approved but not properly recorded can create a repatriation problem years later, even if the business itself is successful.</p>
<h2>Is the minimum per investor or per company?</h2>
<p>The general rule is expressed per foreign investor, not per company. That distinction matters in a joint venture. If two foreign investors each subscribe to shares, the DOI will look at the structure and the proposed shareholding when applying the threshold. Do not assume that a single NPR 20 million investment covers an unlimited number of foreign shareholders, and do not split an investment artificially to avoid the rule. Confirm the treatment with the DOI before you draft the shareholding.</p>
<h2>What counts toward the minimum</h2>
<p>Foreign investment can take several forms: equity in a Nepali company, a shareholder loan, reinvestment of profits, or a technology transfer arrangement. The minimum threshold is generally measured against the foreign equity investment. A shareholder loan or a technology transfer fee is a separate component and should not be assumed to satisfy the equity minimum on its own.</p>
<p>In-kind contributions, such as plant, machinery or equipment, can form part of the investment. They require valuation, customs clearance where applicable, and NRB approval. The value attributed to the goods must be documented and consistent with the approval. An inflated valuation creates problems at the banking and tax stages, and an undervaluation can leave the investor short of the threshold.</p>
<h2>Sector exceptions and the negative list</h2>
<p>The minimum applies alongside sector eligibility rules. Nepal maintains a negative list of activities that are restricted or closed to foreign investment. If your activity is on the list, the question is not how much you plan to invest; the activity cannot be approved in that form. Sector-specific rules can also impose different thresholds or conditions, so confirm the current position for your activity before you commit capital.</p>
<p>Some routes are treated differently. NRNs invest under FITTA and may have access to concessions, and certain sectors are subject to their own approval regimes. These are policy details that change, which is why the threshold should be checked at the time of investment rather than assumed from an older guide.</p>
<h2>The minimum is not the same as paid-up capital</h2>
<p>Paid-up capital is the amount shareholders have actually subscribed and paid for their shares. The FDI minimum is the foreign investment threshold. For a foreign-owned company, the two should be aligned: the approved foreign investment, the issued share capital and the memorandum and articles of association should describe the same structure. A mismatch is one of the most common reasons a filing is returned or a bank delays the capital recording.</p>
<p>Authorised capital is a separate concept again. It is the maximum capital the company may issue, and it drives the OCR registration fee. Setting authorised capital higher than necessary increases the fee without helping the FDI approval. Set it to match the approved investment and the company's actual funding plan.</p>
<h2>How the capital must enter Nepal</h2>
<p>Capital must come in through formal banking channels and be recorded with Nepal Rastra Bank. The remittance should state the correct purpose, such as share investment or loan investment, and the amount should match the approval. The commercial bank handles the NRB reporting, and the investor should keep the remittance advice, the NRB record and the company's share register together.</p>
<p>Informal channels, offset arrangements and under-invoicing are not substitutes. They may move money, but they do not create a recognised investment. The consequence usually appears at the point of repatriation, when the bank and the regulator ask for evidence that the capital entered lawfully. By then, the problem is expensive to fix.</p>
<h2>What happens if you invest less</h2>
<p>If the proposed investment falls below the applicable minimum, the DOI may refuse the application or require the structure to be revised. In some cases, a different route or a different sector may have a lower threshold, but that is a legal question, not a workaround. Splitting an investment between related parties or using a nominee to stay under the threshold creates regulatory and repatriation risk.</p>
<h2>A worked example</h2>
<p>A Dubai-based investor wants to own 100% of an IT services company in Nepal. The general minimum is NPR 20 million, so the project is structured around that figure. The investor files for FDI approval, incorporates the private limited company at the OCR, opens a corporate bank account and remits the capital through banking channels. The bank reports the inflow to Nepal Rastra Bank, and the investor keeps the NRB record with the share register and the approval letter.</p>
<p>If the same investor had remitted only NPR 15 million, the approval and the capital record would not match. The company might still be incorporated and trading, but the shortfall would surface when the investor later applies to repatriate dividends or sale proceeds. Fixing it at that stage requires additional approvals, bank reconciliation and time.</p>
<h2>Timeline and costs</h2>
<p>A straightforward FDI approval usually takes two to six weeks after a complete filing, and the full sequence from approval to recorded capital commonly runs three to five months. Document legalisation, translation and banking delays are often the largest variables. Government fees depend on the company's authorised capital and the applicable schedules, while professional fees depend on the structure, the project report and the sector.</p>
<h2>Common mistakes</h2>
<ul>
<li><strong>Incorporating before FDI approval.</strong> The approval comes first, and the company documents should match it.</li>
<li><strong>Sending capital before approval.</strong> Money that arrives early is difficult to recognise and can stall the file.</li>
<li><strong>Under-invoicing or using informal channels.</strong> The capital may not be recognised for future repatriation.</li>
<li><strong>Assuming the minimum is per company.</strong> The general rule is per foreign investor, so confirm the shareholding structure.</li>
<li><strong>Ignoring sector rules.</strong> A negative-list activity cannot be fixed by increasing the investment.</li>
</ul>
<h2>Frequently asked questions</h2>
<p><strong>Is the minimum NPR 20 million per investor or per company?</strong></p>
<p>The general rule is NPR 20 million per foreign investor, not per company. If more than one foreign investor subscribes, confirm how the DOI will apply the threshold to the proposed shareholding.</p>
<p><strong>Can I invest less than NPR 20 million?</strong></p>
<p>Generally no for a standard foreign investment. Some sectors and NRN routes may be treated differently, so confirm the current position with the DOI before structuring a smaller investment.</p>
<p><strong>Does the minimum apply to loans and technology transfer?</strong></p>
<p>The threshold is generally measured by foreign equity investment. A shareholder loan or technology transfer fee is a separate component and should not be assumed to satisfy the equity minimum.</p>
<p><strong>Can I bring the capital in stages?</strong></p>
<p>Often yes, if the approval and project plan allow it. The total approved investment must still meet the minimum, and every tranche must enter through banking channels and be recorded at NRB.</p>
<p><strong>What if my investment is in machinery or equipment?</strong></p>
<p>In-kind contributions can form part of the investment, but they require valuation, customs clearance and NRB approval. The value attributed must be documented and consistent with the approval.</p>
<p><strong>Is the minimum the same as paid-up capital?</strong></p>
<p>No. The minimum is the foreign investment threshold. Paid-up capital is the amount shareholders have actually subscribed. For a foreign-owned company, the two should be aligned in the approval and the charter.</p>
<p><strong>Do NRNs have a lower minimum?</strong></p>
<p>NRNs invest under FITTA and may have access to concessions or different treatment. The rules change, so confirm the current threshold for your route before relying on a lower amount.</p>
<p><strong>What happens if I use informal channels or under-invoice?</strong></p>
<p>Capital that is not brought in through banking channels and recorded at NRB may not be recognised for repatriation. That can block dividends, sale proceeds and exit payments later, and may create regulatory exposure.</p>
${related([
  '<a href="/publications/fdi-registration-process-in-nepal">FDI registration process</a>',
  '<a href="/publications/company-registration-in-nepal-costs-documents-timeline">company registration in Nepal</a>',
  '<a href="/publications/repatriating-profits-from-nepal">repatriating profits</a>',
  '<a href="/publications/branch-vs-liaison-office-registration-in-nepal">branch, liaison or subsidiary</a>',
])}
<h2>How Pluto Associates can help</h2>
<p>We advise foreign investors on the minimum investment threshold, the approval route and the capital recording sequence. If you would like a clear view of your own project, <a href="/contact">contact our team</a> for a consultation, message us on <a href="https://wa.me/9779802356987">WhatsApp</a>, or call <a href="tel:+9779802356987">+977 9802356987</a>. We will tell you what is possible, what it costs, and how long it takes.</p>
<blockquote><p><strong>Disclaimer:</strong> This article is general information, not legal advice. FITTA thresholds, sector rules and NRB procedures can change. Confirm the current position for your project with the Department of Industry, Investment Board Nepal and Nepal Rastra Bank before committing capital.</p></blockquote>`,
  excerpt: "Nepal's general minimum foreign investment is NPR 20 million per investor. What the threshold covers, how it is recorded at NRB, and the exceptions to confirm.",
  category: 'fdi',
  authorInitials: 'SN',
  authorName: 'Adv. Sudeep Nepal',
  date: '2026-10-27',
  createdAt: '2026-10-27T09:00:00.000Z',
  modifiedAt: NOW,
  status: 'published',
  tags: ['FDI', 'Minimum Investment', 'FITTA', 'NRB', 'Nepal Investment'],
  featuredImage: '/images/minimum-foreign-investment-nepal-2026.jpg',
  featuredImageAlt: 'Minimum foreign investment in Nepal under FITTA 2019',
  metaKeywords: 'minimum foreign investment Nepal, minimum FDI Nepal, NPR 20 million FDI, FITTA minimum investment, foreign investment threshold Nepal, FDI capital requirement Nepal',
  seoTitle: 'Minimum Foreign Investment in Nepal: NPR 20 Million Rule',
  seoDesc: DESCRIPTIONS['minimum-foreign-investment-nepal'] || "Nepal's minimum foreign investment is NPR 20 million per investor under FITTA. What it covers, exceptions, capital rules, NRB recording and timing.",
  canonical: '/publications/minimum-foreign-investment-nepal',
  faqs: [
    { q: 'Is the minimum NPR 20 million per investor or per company?', a: 'The general rule is NPR 20 million per foreign investor, not per company. If more than one foreign investor subscribes, confirm how the DOI will apply the threshold to the proposed shareholding.' },
    { q: 'Can I invest less than NPR 20 million?', a: 'Generally no for a standard foreign investment. Some sectors and NRN routes may be treated differently, so confirm the current position with the DOI before structuring a smaller investment.' },
    { q: 'Does the minimum apply to loans and technology transfer?', a: 'The threshold is generally measured by foreign equity investment. A shareholder loan or technology transfer fee is a separate component and should not be assumed to satisfy the equity minimum.' },
    { q: 'Can I bring the capital in stages?', a: 'Often yes, if the approval and project plan allow it. The total approved investment must still meet the minimum, and every tranche must enter through banking channels and be recorded at NRB.' },
    { q: 'What if my investment is in machinery or equipment?', a: 'In-kind contributions can form part of the investment, but they require valuation, customs clearance and NRB approval. The value attributed must be documented and consistent with the approval.' },
    { q: 'Is the minimum the same as paid-up capital?', a: 'No. The minimum is the foreign investment threshold. Paid-up capital is the amount shareholders have actually subscribed. For a foreign-owned company, the two should be aligned in the approval and the charter.' },
    { q: 'Do NRNs have a lower minimum?', a: 'NRNs invest under FITTA and may have access to concessions or different treatment. The rules change, so confirm the current threshold for your route before relying on a lower amount.' },
    { q: 'What happens if I use informal channels or under-invoice?', a: 'Capital that is not brought in through banking channels and recorded at NRB may not be recognised for repatriation. That can block dividends, sale proceeds and exit payments later, and may create regulatory exposure.' },
  ],
};

DESCRIPTIONS['minimum-foreign-investment-nepal'] = "Nepal's minimum foreign investment is NPR 20 million per investor under FITTA. What it covers, exceptions, capital rules, NRB recording and timing.";

if (!bySlug.has(newArticle.slug)) articles.unshift(newArticle);

for (const article of articles) {
  if (!article.faqs) article.faqs = [];
  if (!article.seoDesc) article.seoDesc = DESCRIPTIONS[article.slug] || article.excerpt;
  if (!article.excerpt) article.excerpt = article.seoDesc;
}

fs.writeFileSync(FILE, JSON.stringify(articles, null, 2) + '\n', 'utf8');
console.log(`updated ${articles.length} articles`);
console.log(`targets: ${Object.keys(TARGETS).join(', ')}`);
