/**
 * Evergreen, query-targeted guides for foreign investors and property buyers.
 *
 * Each guide is a standalone landing page, prerendered at build time and listed
 * in the sitemap. Content is written to answer the search query directly in the
 * opening lines, then cover the routes, process, documents, timing, cost and
 * common mistakes. Legal copy should be reviewed by a qualified Nepali lawyer
 * before publication.
 */
import paRealestate from '../assets/pa-realestate.jpg';
import paFdi from '../assets/pa-fdi.jpg';

export const PROPERTY_GUIDES = [
  {
    slug: 'can-foreigners-buy-property-in-nepal',
    title: 'Can Foreigners Buy Property in Nepal? Legal Routes (2026)',
    h1: 'Can Foreigners Buy Property in Nepal?',
    category: 'Property & Real Estate',
    publishedAt: '2026-10-30',
    lastUpdated: '2026-10-30',
    readingTime: 10,
    description:
      'Foreign nationals generally cannot own land in Nepal in their own name. Limited routes exist: a registered long-term lease, apartment ownership where permitted, and property held through a Nepal-registered company for a permitted business purpose.',
    keywords:
      'can foreigners buy property in Nepal, foreign property ownership Nepal, buy apartment in Nepal as a foreigner, lease property in Nepal, foreign investment property Nepal, property due diligence Nepal',
    heroImage: paRealestate,
    heroImageAlt: 'Real estate and property in Kathmandu, Nepal',
    tags: ['Property Law', 'Foreign Investment', 'Real Estate', 'Nepal'],
    quickAnswer:
      'Generally, no. A foreign national cannot own land in Nepal in their own name, and a direct purchase of land will usually fail at registration. There are narrow lawful routes, however: a registered long-term lease, ownership of an apartment unit where the law and building approvals allow it, and property held through a Nepal-registered company for a permitted business purpose. The right route depends on your nationality, the property and what you intend to do with it.',
    keyPoints: [
      'Land ownership in Nepal is restricted for foreign nationals.',
      'A registered lease can give secure use rights without ownership.',
      'Apartment units may be purchasable where the law and approvals permit; the land beneath is not.',
      'A Nepal-registered company can hold property for permitted business purposes, subject to FDI rules.',
      'Title and eligibility checks should always come before payment.',
    ],
    sections: [
      {
        id: 'the-short-answer',
        heading: 'The short answer',
        html: `
<p>Nepal's land laws are not built around open foreign ownership. A foreign individual who tries to buy land directly will usually find that the transaction cannot be registered in their name, however carefully the sale deed is drafted.</p>
<p>What is possible is more nuanced. Depending on your facts, a foreigner may be able to:</p>
<ul>
<li><strong>Lease</strong> land or premises for a defined term under a registered lease;</li>
<li><strong>Own an apartment unit</strong> where the building and the law permit it, without owning the land underneath;</li>
<li><strong>Invest through a Nepal-registered company</strong> that holds property for a business purpose open to foreign investment; or</li>
<li>Qualify under a <strong>specific category</strong> — for example certain non-resident Nepali or treaty-based cases — where eligibility has to be checked individually.</li>
</ul>
<p>None of these is a workaround for the ownership rules. Each has conditions, and using the wrong structure can leave you with a payment you cannot recover and a property you cannot register.</p>
`,
      },
      {
        id: 'why-land-ownership-is-restricted',
        heading: 'Why land ownership is restricted',
        html: `
<p>Land in Nepal is a constitutionally and politically sensitive asset. Ownership is closely tied to citizenship, and the law places limits on who may hold land and how much. The policy behind the restriction is to protect land for citizens and to prevent speculative or absentee foreign ownership.</p>
<p>In practice, this means that the starting point for any foreign buyer is not "which form do I sign?" but "am I eligible to hold this interest at all?" The answer can differ between land, an apartment, a lease and shares in a company. It can also differ by location and land use.</p>
<p>Because the rules are applied at the land revenue office and by the approving authorities, a structure that looks plausible on paper can still fail at registration. That is why we test eligibility before drafting, not after.</p>
`,
      },
      {
        id: 'the-routes-that-exist',
        heading: 'The routes that do exist',
        html: `
<h3>1. A registered long-term lease</h3>
<p>A lease transfers use rights, not ownership. For many foreign individuals and businesses, a properly drafted and registered lease is the most practical route: it can be long-term, it can cover commercial or residential premises, and it can be secured by registration. The lease deed must be clear on term, rent, renewal, permitted use, maintenance, transfer and exit.</p>
<h3>2. Apartment and condominium ownership</h3>
<p>Nepal's apartment ownership framework allows apartment units to be owned separately from the land, subject to the building's approvals and the applicable rules. Where a foreign buyer is permitted to acquire a unit, what is owned is the unit and a share of the common areas, not the land beneath the building. The developer's approvals, the building's completion status and the apartment ownership documents all matter.</p>
<h3>3. Property through a Nepal-registered company</h3>
<p>A company incorporated in Nepal is a Nepali legal entity, and it may hold property for its business purposes. But this is not a free pass: foreign investment into the company must comply with the Foreign Investment and Technology Transfer Act (FITTA) and the sector rules, and some activities — including parts of the real estate sector — are restricted or require approval. The company must have a genuine business purpose, and the property must be used for that purpose.</p>
<h3>4. Specific categories and treaty-based cases</h3>
<p>Certain non-resident Nepali (NRN) categories and nationals of countries with special arrangements may have rights that others do not. These are fact-specific. We check the current position for the individual, the property and the intended use before advising on a route.</p>
`,
      },
      {
        id: 'what-are-you-buying',
        heading: 'What are you actually buying?',
        html: `
<p>Foreign buyers often use the word "buy" to mean four different things. The legal consequences are very different:</p>
<ul>
<li><strong>Land</strong> — the freehold plot. This is the most restricted category for foreign nationals.</li>
<li><strong>An apartment unit</strong> — a separate unit in a building, with a share of common areas, but not the land.</li>
<li><strong>A lease</strong> — a right to use the property for a term, usually registered, without ownership.</li>
<li><strong>Shares in a company</strong> — indirect exposure to property held by a Nepali company, subject to FDI and corporate law.</li>
</ul>
<p>Before you negotiate price, decide which of these you actually need. A buyer who needs a home, a buyer who needs business premises and a buyer who needs an investment asset may each need a different structure.</p>
`,
      },
      {
        id: 'due-diligence',
        heading: 'Due diligence comes first',
        html: `
<p>Property due diligence in Nepal is not a formality. We check, at minimum:</p>
<ul>
<li>the title deed and the chain of ownership;</li>
<li>whether the seller is the registered owner and has authority to sell;</li>
<li>encumbrances, mortgages, liens and pending litigation;</li>
<li>land classification, zoning and permitted use;</li>
<li>boundaries, access and any encroachment;</li>
<li>building permits, completion certificates and apartment approvals;</li>
<li>land revenue and tax dues; and</li>
<li>any restriction that applies to the buyer's nationality or the intended use.</li>
</ul>
<p>A clean title report is the cheapest protection in any property transaction. It is also the document that tells you whether the deal is possible at all.</p>
`,
      },
      {
        id: 'approvals-and-structure',
        heading: 'Approvals and the structure',
        html: `
<p>Where the route involves foreign investment, the transaction may need approvals before completion. Depending on the structure, this can include foreign investment approval, company registration and post-registration filings, sector-specific clearances, and land revenue office registration. For apartments, the developer's approvals and the apartment ownership documentation are central.</p>
<p>We map the approvals before signing, so that conditions, timing and cost are known in advance. Where an approval is uncertain, we say so early rather than after money has changed hands.</p>
`,
      },
      {
        id: 'repatriation-and-exit',
        heading: 'Repatriation and exit',
        html: `
<p>For an investor, the purchase is only half of the equation. You also need a lawful route to take income, sale proceeds or capital out of Nepal. That depends on how the investment was made and documented. A structure that ignores repatriation can be difficult and expensive to unwind.</p>
<p>We consider exit and repatriation at the structuring stage, not at the end.</p>
`,
      },
    ],
    process: [
      { step: '01', title: 'Eligibility and structure review', desc: 'We review your nationality, residency, the property and your objective, then identify the routes that are actually available.' },
      { step: '02', title: 'Title and due diligence', desc: 'We verify ownership, encumbrances, land use, approvals and any restriction affecting the transaction.' },
      { step: '03', title: 'Approvals', desc: 'Where required, we prepare and pursue foreign investment, corporate and sector approvals before completion.' },
      { step: '04', title: 'Drafting and negotiation', desc: 'We draft or review the sale, lease or investment documents so that term, use, payment and exit are clear.' },
      { step: '05', title: 'Registration and completion', desc: 'We coordinate signing, tax clearance and registration, and confirm the documents you should hold afterwards.' },
    ],
    documents: [
      'Passport and current visa or residency status',
      'Company documents if the property is to be held by a company',
      'Draft sale, lease or investment documents',
      'Title deed and the chain of ownership',
      'Land revenue and tax receipts',
      'Plot map, boundaries and access details',
      'Building permits, completion certificates and apartment plans where relevant',
      'Board resolutions or a power of attorney for corporate buyers',
    ],
    timeline: [
      { phase: 'Eligibility and structure review', duration: '2–5 business days' },
      { phase: 'Title and due diligence', duration: '1–3 weeks' },
      { phase: 'Approvals, where required', duration: 'Several weeks to a few months' },
      { phase: 'Drafting, signing and registration', duration: '1–3 weeks after approvals' },
    ],
    fees: [
      { item: 'Eligibility and structure review', note: 'Fixed fee confirmed after a short review of your facts and documents.' },
      { item: 'Title and due diligence', note: 'Quoted by property and the number of owners and documents involved.' },
      { item: 'Approvals and registrations', note: 'Depends on the structure and the authorities involved; we confirm the scope before starting.' },
      { item: 'Government fees and taxes', note: 'Payable at the applicable rates for the transaction; we confirm the current amounts for your matter.' },
    ],
    mistakes: [
      'Paying a deposit before the title and the buyer\'s eligibility have been checked.',
      'Holding land in the name of a friend, relative or employee. This "benami" arrangement is risky, hard to enforce and can create tax and repatriation problems.',
      'Treating a lease as ownership, or signing an unregistered lease with weak renewal and exit terms.',
      'Buying agricultural or restricted land without checking land use and zoning.',
      'Ignoring the developer\'s approvals, completion status and apartment documentation.',
      'Structuring the purchase without a plan for repatriating income or sale proceeds.',
    ],
    faqs: [
      {
        q: 'Can a foreigner own land in Nepal?',
        a: 'In general, no. A foreign national cannot own land in Nepal in their own name, and a direct land purchase will usually not be registrable. There are limited routes, such as a registered lease, an apartment unit where permitted, or property held through a Nepal-registered company for a permitted business purpose.',
      },
      {
        q: 'Can a foreigner buy an apartment in Nepal?',
        a: 'In some cases, yes. Apartment units can be owned separately from the land where the building\'s approvals and the applicable rules permit it. What you own is the unit and a share of the common areas, not the land. The developer\'s approvals and the apartment documents must be checked first.',
      },
      {
        q: 'Can a foreigner take a long lease instead?',
        a: 'Yes. A properly drafted and registered lease can give secure use rights for a defined term. It is not ownership, and the lease must be clear on term, renewal, permitted use, maintenance and exit.',
      },
      {
        q: 'Can I buy property through a Nepali company?',
        a: 'A Nepal-registered company can hold property for a genuine business purpose, but foreign investment into that company must comply with FITTA and sector rules. Some activities, including parts of real estate, are restricted. A company should not be used simply to get around the ownership rules.',
      },
      {
        q: 'Can non-resident Nepalis buy property?',
        a: 'Some NRN categories may have limited rights that other foreign nationals do not. The position depends on your status, the property and the current law, so it needs to be checked individually.',
      },
      {
        q: 'What should I check before paying anything?',
        a: 'At minimum: the title and ownership chain, the seller\'s authority, encumbrances and litigation, land use, approvals, tax dues and your own eligibility. We recommend a written title report before any deposit.',
      },
      {
        q: 'How long does the process take?',
        a: 'Due diligence usually takes one to three weeks. Approvals, where required, can take several weeks to a few months. Drafting and registration typically follow within one to three weeks after approvals.',
      },
      {
        q: 'Do you handle the whole process?',
        a: 'Yes. We review eligibility, run due diligence, pursue approvals, draft and negotiate the documents, and coordinate registration and completion.',
      },
    ],
    relatedSlugs: ['can-indians-buy-property-in-nepal'],
    practiceAreas: ['realestate', 'fdi'],
    relatedCategories: ['property', 'realestate', 'fdi', 'nrn'],
    ctaLabel: 'Get a property structuring consultation',
  },
  {
    slug: 'can-indians-buy-property-in-nepal',
    title: 'Can Indians Buy Property in Nepal? Rules & Restrictions (2026)',
    h1: 'Can Indians Buy Property in Nepal?',
    category: 'Property & Real Estate',
    publishedAt: '2026-10-30',
    lastUpdated: '2026-10-30',
    readingTime: 8,
    description:
      'Indian nationals are often treated differently from other foreigners under the 1950 Nepal–India Treaty, but there is no unrestricted right to buy land. Eligibility depends on the property, location, use and current law.',
    keywords:
      'can Indians buy property in Nepal, Indian citizens property ownership Nepal, buy land in Nepal Indian, Nepal India property treaty, apartment purchase Nepal Indian',
    heroImage: paFdi,
    heroImageAlt: 'Foreign investment and property advisory in Nepal',
    tags: ['Property Law', 'India–Nepal', 'Real Estate', 'Nepal'],
    quickAnswer:
      'Not automatically. Indian nationals are often described as having a more favourable position than other foreign nationals because of the 1950 Treaty of Peace and Friendship between Nepal and India. But that does not create an unrestricted right to buy any land anywhere in Nepal. Whether you can acquire a particular property depends on its type, location and use, your residency and documentation, and the current law. A title and eligibility review before payment is essential.',
    keyPoints: [
      'The 1950 treaty is often cited, but it does not remove all property restrictions.',
      'Land, apartments, leases and company-held property are treated differently.',
      'Location, land use and the buyer\'s status can change the answer.',
      'Title and eligibility checks must come before any deposit.',
      'Plan for tax, registration and repatriation from the start.',
    ],
    sections: [
      {
        id: 'the-short-answer',
        heading: 'The short answer',
        html: `
<p>Indian nationals are not in the same position as every other foreign national in Nepal, but the difference is often overstated. The starting point is still Nepali law, and the answer to "can I buy this property?" depends on the property, its location and use, the buyer's status and the documents that can be produced.</p>
<p>In practice, Indian buyers most often proceed through one of four routes: a registered long-term lease, an apartment unit where permitted, a Nepal-registered company for a permitted business purpose, or a specific category that applies to their status. Each route has conditions, and a transaction that is possible for one buyer or one property may not be possible for another.</p>
<p>We therefore treat eligibility as a legal question to be checked before price and payment, not as an assumption.</p>
`,
      },
      {
        id: 'the-1950-treaty',
        heading: 'What the 1950 treaty does — and does not do',
        html: `
<p>The 1950 Treaty of Peace and Friendship between Nepal and India is frequently cited in discussions about Indian property ownership in Nepal. It has historically supported a close economic and residential relationship between the two countries, and Indian nationals are often treated more favourably than other foreign nationals in areas such as residence and business.</p>
<p>That does not mean the treaty gives an unlimited right to buy land anywhere in Nepal. Property ownership is governed by Nepali land law and applied by the land revenue offices and approving authorities. The treaty informs the position; it does not replace the statutory rules, the land-use rules or the approval requirements that apply to a particular property.</p>
<p>Any adviser who tells you that being Indian settles the question is skipping the part that matters: the specific property and the specific transaction.</p>
`,
      },
      {
        id: 'the-four-routes',
        heading: 'The four ways to hold property',
        html: `
<p>"Buying property" can mean four different things, and the rules are not the same for each:</p>
<ul>
<li><strong>Land</strong> — a freehold plot. This is the most sensitive category, and it is where the restrictions are strongest.</li>
<li><strong>An apartment unit</strong> — a separate unit with a share of common areas, where the building's approvals and the law permit it. The land beneath is not part of what you own.</li>
<li><strong>A lease</strong> — a registered right to use the property for a term. It can be long-term and secure, but it is not ownership.</li>
<li><strong>Shares in a Nepal-registered company</strong> — indirect exposure to property held by a Nepali entity, subject to foreign investment and corporate rules.</li>
</ul>
<p>Decide which interest you actually need before you negotiate. The right structure for a family home may be different from the right structure for business premises or an investment.</p>
`,
      },
      {
        id: 'where-restrictions-apply',
        heading: 'Where restrictions can still apply',
        html: `
<p>Even where an Indian buyer is eligible in principle, the following can change the answer or add conditions:</p>
<ul>
<li><strong>Location</strong> — some areas are subject to additional restrictions or scrutiny.</li>
<li><strong>Land use</strong> — agricultural, forest or restricted land is treated differently from residential or commercial land.</li>
<li><strong>Purpose</strong> — a property for personal residence, a business or an investment may follow different approval routes.</li>
<li><strong>The seller and the title</strong> — a weak title, a disputed boundary or an unauthorised transfer can defeat an otherwise eligible buyer.</li>
<li><strong>Approvals</strong> — building permits, apartment approvals and foreign investment clearances may be required before completion.</li>
</ul>
<p>These are not technicalities. They are the points on which transactions fail, often after a deposit has been paid.</p>
`,
      },
      {
        id: 'due-diligence',
        heading: 'Due diligence for Indian buyers',
        html: `
<p>Due diligence for an Indian buyer follows the same discipline as for any other property transaction in Nepal:</p>
<ul>
<li>verify the title deed and the full chain of ownership;</li>
<li>confirm the seller's identity and authority;</li>
<li>check mortgages, liens, encumbrances and litigation;</li>
<li>confirm land classification, zoning and permitted use;</li>
<li>check boundaries, access and encroachment;</li>
<li>review building and apartment approvals where relevant;</li>
<li>confirm land revenue and tax dues; and</li>
<li>document the buyer's eligibility and the approval route.</li>
</ul>
<p>We prepare a written title and eligibility report before any commitment, so you know what you are buying and whether you can hold it.</p>
`,
      },
      {
        id: 'approvals-and-documents',
        heading: 'Approvals and documentation',
        html: `
<p>Where approvals are required, they should be mapped before signing. Depending on the structure, the transaction may involve foreign investment approval, company registration and filings, sector clearances, and registration at the land revenue office. For apartments, the developer's approvals and the apartment ownership documents are central.</p>
<p>We coordinate the sequence so that payment, signing and registration happen in the right order, and so that conditions are known before you commit.</p>
`,
      },
      {
        id: 'tax-and-repatriation',
        heading: 'Tax, repatriation and exit',
        html: `
<p>Tax and repatriation should be considered at the start. The way the property is acquired affects the tax position on rental income and sale, and it affects whether and how funds can be taken out of Nepal later. A structure that looks simple at purchase can be costly at exit.</p>
<p>We plan the exit at the same time as the entry.</p>
`,
      },
    ],
    process: [
      { step: '01', title: 'Eligibility and structure review', desc: 'We review your status, the property, the location and your objective, then identify the routes that are actually available.' },
      { step: '02', title: 'Title and due diligence', desc: 'We verify ownership, encumbrances, land use, approvals and any restriction affecting the transaction.' },
      { step: '03', title: 'Approvals', desc: 'Where required, we prepare and pursue foreign investment, corporate and sector approvals before completion.' },
      { step: '04', title: 'Drafting and negotiation', desc: 'We draft or review the sale, lease or investment documents so that term, use, payment and exit are clear.' },
      { step: '05', title: 'Registration and completion', desc: 'We coordinate signing, tax clearance and registration, and confirm the documents you should hold afterwards.' },
    ],
    documents: [
      'Passport and current visa or residency status',
      'Company documents if the property is to be held by a company',
      'Draft sale, lease or investment documents',
      'Title deed and the chain of ownership',
      'Land revenue and tax receipts',
      'Plot map, boundaries and access details',
      'Building permits, completion certificates and apartment plans where relevant',
      'Board resolutions or a power of attorney for corporate buyers',
    ],
    timeline: [
      { phase: 'Eligibility and structure review', duration: '2–5 business days' },
      { phase: 'Title and due diligence', duration: '1–3 weeks' },
      { phase: 'Approvals, where required', duration: 'Several weeks to a few months' },
      { phase: 'Drafting, signing and registration', duration: '1–3 weeks after approvals' },
    ],
    fees: [
      { item: 'Eligibility and structure review', note: 'Fixed fee confirmed after a short review of your facts and documents.' },
      { item: 'Title and due diligence', note: 'Quoted by property and the number of owners and documents involved.' },
      { item: 'Approvals and registrations', note: 'Depends on the structure and the authorities involved; we confirm the scope before starting.' },
      { item: 'Government fees and taxes', note: 'Payable at the applicable rates for the transaction; we confirm the current amounts for your matter.' },
    ],
    mistakes: [
      'Assuming the 1950 treaty makes any purchase possible, without checking the property and the current rules.',
      'Paying a deposit before the title and the buyer\'s eligibility have been checked.',
      'Buying in the name of a relative or friend. This "benami" arrangement is risky, hard to enforce and can create tax and repatriation problems.',
      'Treating a lease as ownership, or signing an unregistered lease with weak renewal and exit terms.',
      'Ignoring land use, location restrictions or the approvals required for the property.',
      'Structuring the purchase without a plan for tax and repatriation on sale.',
    ],
    faqs: [
      {
        q: 'Can Indian citizens buy land in Nepal?',
        a: 'Not as a blanket right. Indian nationals are often treated more favourably than other foreign nationals, but whether a particular purchase is possible depends on the property, its location and use, the buyer\'s status and the current law. A title and eligibility review should come before any payment.',
      },
      {
        q: 'Does the 1950 Nepal–India treaty allow property ownership?',
        a: 'The treaty supports a close economic and residential relationship and is often cited in this context, but it does not create an unrestricted right to buy any land in Nepal. Nepali land law and the approval requirements still apply to the specific transaction.',
      },
      {
        q: 'Can Indians buy an apartment in Nepal?',
        a: 'In some cases, yes, where the building\'s approvals and the applicable rules permit it. What is owned is the unit and a share of common areas, not the land. The developer\'s approvals and apartment documents must be checked.',
      },
      {
        q: 'Can Indians take a long lease instead of buying?',
        a: 'Yes. A registered long-term lease can provide secure use rights. It is not ownership, and the lease should be clear on term, renewal, permitted use and exit.',
      },
      {
        q: 'Are there extra restrictions near the border?',
        a: 'Some locations can attract additional restrictions or scrutiny. We check the specific location and land use as part of due diligence.',
      },
      {
        q: 'What documents should I prepare?',
        a: 'Passport and residency documents, the draft sale or lease deed, title documents, tax receipts, and any corporate documents if you are buying through a company. We confirm the exact list for your transaction.',
      },
      {
        q: 'How long does it take?',
        a: 'Due diligence usually takes one to three weeks. Approvals, where required, can take several weeks to a few months. Drafting and registration typically follow within one to three weeks after approvals.',
      },
      {
        q: 'Can you help from outside Nepal?',
        a: 'Yes. We can start with a document review and a structure opinion remotely, then coordinate signing and registration when you are ready.',
      },
    ],
    relatedSlugs: ['can-foreigners-buy-property-in-nepal'],
    practiceAreas: ['realestate', 'fdi'],
    relatedCategories: ['property', 'realestate', 'fdi', 'nrn'],
    ctaLabel: 'Get a property structuring consultation',
  },
];

export const GUIDE_DISCLAIMER =
  'This guide is general information about Nepali law and is not legal advice. Property rules and approvals depend on the facts of each transaction. Please speak to a licensed Nepali lawyer before acting.';

export function getGuides() {
  return PROPERTY_GUIDES;
}

export function getGuideBySlug(slug) {
  return PROPERTY_GUIDES.find((guide) => guide.slug === slug);
}
