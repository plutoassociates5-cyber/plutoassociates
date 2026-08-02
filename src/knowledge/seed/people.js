const S = (category, question, answer, keywords) => ({
  category, question, answer,
  keywords: keywords.split('|').map((k) => k.trim()).filter(Boolean),
});

export const employmentTaxSeed = [
  S('employment',
    'How do I lawfully terminate an employee in Nepal?',
    'Terminating an employee in Nepal is governed largely by the Labour Act and the terms of the employment contract. An employer cannot simply end a contract without a lawful basis; the appropriate path depends on whether the termination is for misconduct, redundancy or mutual agreement, and each route carries different notice and settlement obligations. Procedure matters as much as reason, since a termination that is wrong on process can leave the employer with a claim instead. Before acting, an employer should confirm the lawful basis, follow warning and documentation where required, and settle entitlements correctly. We help employers see the correct basis and process so the termination stands.',
    'terminate an employee in nepal|lawful termination kathmandu|how to fire an employee legally nepal'),
  S('employment',
    'What must an employment contract in Nepal include?',
    'An employment contract in Nepal sets the working relationship in writing: the role and duties, hours and place of work, leave and public holidays, pay and how it is paid, and the terms on which each side can end the arrangement. The Labour Act sets minimum standards that a contract cannot go below, so the contract must reflect, not ignore, the statutory minimums. A written contract is also the first thing examined in a termination or dispute, so its wording matters. We prepare employment contracts that are compliant with the current legal minimum while matching the way each business actually works, avoiding conflict further down the employment.',
    'employment contract nepal|employment agreement contents|labor contract kathmandu'),
  S('taxation',
    'How do I register for PAN and VAT in Nepal?',
    'PAN (taxpayer) registration is obtained from the Inland Revenue Department (IR), while VAT registration applies once a business crosses the statutory turnover threshold, and is also available voluntarily. PAN registration is effectively required to open a business bank account, issue invoices and be paid by corporate clients; VAT matters for filing returns and reporting input and output tax. Both are rooted in a clean company or business registration. The precise threshold and document list should be confirmed at the time, as they are updated. We guide businesses through PAN and VAT registration so the numbers, accounting and compliance framework over which they begin is correct and future‑tax hassle is avoided.',
    'pan registration nepal|vat registration nepal|ird registration kathmandu'),
  S('taxation',
    'Do startups and small businesses need to worry about tax compliance in Nepal?',
    'Yes, they do, and starting on time is far cheaper than catching up. Even a small or new business may need PAN registration immediately for banking and invoicing, and a VAT registration once its turnover meets the threshold. Monthly VAT returns and annual tax filings have deadlines, and the penalties for late or inaccurate work escalate over time and can surprise a growing business. Many owners only realise after the first audit or a blocked bank transaction. The practical habit is to set up the registration, the records and a filing calendar from the first invoice. We can set this rhythm up for small businesses so that compliance is a background task, not a recurring panic.',
    'small business compliance nepal|do i need vat for small business|business tax basics nepal'),
  S('licensing',
    'What business licences and permits do I need in Nepal?',
    'Depending on the activity, a business in Nepal may need licences and sector permits in addition to the company registration, PAN and possibly VAT. Different sectors (for example, hospitality, health, import‑export, food, construction) have their own licensing authority and renewal cycle. The question is not just which licences apply but which body issues each and when they must be renewed, since trading without a required permit can attract penalties. If you need a licence, an assessor must confirm which applies, because there is no single all‑in‑one licence exists, so the checklist is per‑activity. We can map the licences that apply to your specific business and prepare and support the applications so you start trading properly licensed.',
    'business licences nepal|operating permit nepal|what licences do i need for a business'),
];