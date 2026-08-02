/**
 * FAQ category registry for the Pluto Associates Legal Knowledge Centre.
 *
 * Every FAQ belongs to exactly one canonical category. Each category also maps
 * to one or more practice areas and services so the engine can build the
 * knowledge graph automatically. Add a category here and every new FAQ will
 * link accordingly — no other change needed.
 */
const CATEGORIES = [
  { id: 'corporate-law', name: 'Corporate Law', icon: '🏢', practiceAreas: ['corporate'], services: ['Corporate Law'], keywords: ['corporate law nepal', 'company law', 'corporate lawyer kathmandu'] },
  { id: 'company-registration', name: 'Company Registration', icon: '🏛', practiceAreas: ['corporate'], services: ['Company Registration & Incorporation'], keywords: ['register company nepal', 'company registration kathmandu', 'how to incorporate in nepal'] },
  { id: 'fdi', name: 'Foreign Direct Investment', icon: '🌐', practiceAreas: ['fdi'], services: ['Foreign Direct Investment (FDI)'], keywords: ['fdi nepal', 'foreign investment nepal', 'foreigners own company nepal'] },
  { id: 'corporate-governance', name: 'Corporate Governance', icon: '🧭', practiceAreas: ['corporate'], services: ['Corporate Compliance', 'Corporate Law'], keywords: ['board of directors nepal', 'shareholder rights', 'corporate governance'] },
  { id: 'compliance', name: 'Corporate Compliance', icon: '✅', practiceAreas: ['corporate'], services: ['Corporate Compliance'], keywords: ['company compliance nepal', 'annual filing nepal', 'business compliance'] },
  { id: 'commercial-contracts', name: 'Commercial Contracts', icon: '📝', practiceAreas: ['corporate'], services: ['Contract Drafting & Review', 'Commercial Transactions'], keywords: ['contract drafting nepal', 'commercial agreement', 'sales contract kathmandu'] },
  { id: 'joint-ventures', name: 'Joint Ventures & Equity', icon: '🤝', practiceAreas: ['corporate'], services: ['Commercial Transactions', 'Corporate Law'], keywords: ['joint venture nepal', 'shareholder agreement', 'founders agreement'] },
  { id: 'mna', name: 'Mergers & Acquisitions', icon: '🔀', practiceAreas: ['corporate'], services: ['Mergers & Acquisitions', 'Due Diligence'], keywords: ['merger nepal', 'acquisition nepal', 'buy a company nepal'] },
  { id: 'employment', name: 'Employment & Labour Law', icon: '👥', practiceAreas: ['labor'], services: ['Employment & Labour Law'], keywords: ['terminate employee nepal', 'employment contract nepal', 'labour law nepal'] },
  { id: 'taxation', name: 'Tax & VAT', icon: '📊', practiceAreas: ['tax'], services: ['Tax & Regulatory Advisory'], keywords: ['vat nepal', 'pan registration nepal', 'tax compliance nepal'] },
  { id: 'licensing', name: 'Licensing & Permits', icon: '🗂', practiceAreas: ['corporate'], services: ['Corporate Compliance'], keywords: ['business license nepal', 'operating permit', 'trade license nepal'] },
  { id: 'intellectual-property', name: 'Intellectual Property', icon: '💡', practiceAreas: ['ip'], services: ['Intellectual Property'], keywords: ['trademark nepal', 'copyright nepal', 'patent nepal'] },
  { id: 'technology', name: 'Technology & Data Privacy', icon: '💻', practiceAreas: [], services: ['Technology & Data Privacy Law'], keywords: ['data privacy nepal', 'cyber law nepal', 'it contract nepal'] },
  { id: 'property', name: 'Property & Real Estate', icon: '🏠', practiceAreas: ['realestate'], services: ['Real Estate & Property Law'], keywords: ['verify land ownership nepal', 'buy property nepal', 'real estate due diligence'] },
  { id: 'litigation', name: 'Litigation & Disputes', icon: '⚖️', practiceAreas: ['litigation'], services: ['Civil Litigation', 'Criminal Defence'], keywords: ['civil case nepal', 'file lawsuit kathmandu', 'court case nepal'] },
  { id: 'arbitration', name: 'Arbitration & Mediation', icon: '🤲', practiceAreas: ['litigation'], services: ['Arbitration & ADR'], keywords: ['arbitration nepal', 'mediation nepal', 'settle dispute without court'] },
  { id: 'debt-recovery', name: 'Debt Recovery', icon: '💳', practiceAreas: ['banking'], services: ['Banking & Finance', 'Litigation'], keywords: ['recover unpaid debts', 'debt recovery nepal', 'money recovery nepal'] },
  { id: 'banking', name: 'Banking & Finance', icon: '🏦', practiceAreas: ['banking'], services: ['Banking & Finance'], keywords: ['banking law nepal', 'loan agreement nepal', 'financial regulation nepal'] },
  { id: 'securities', name: 'Investment & Securities', icon: '📈', practiceAreas: ['corporate'], services: ['Corporate Law', 'Banking & Finance'], keywords: ['investment law nepal', 'securities nepal', 'share issuance nepal'] },
  { id: 'nonprofit', name: 'NGO / INGO', icon: '🏛', practiceAreas: ['corporate'], services: ['NGO/INGO Legal Compliance'], keywords: ['register ngo nepal', 'ingo approval nepal', 'nonprofit registration kathmandu'] },
  { id: 'documents', name: 'Legal Documentation', icon: '📜', practiceAreas: ['corporate'], services: ['Documentation & Notarization', 'Legal Opinions'], keywords: ['power of attorney nepal', 'affidavit nepal', 'legal opinion kathmandu'] },
  { id: 'advisory', name: 'Advisory & Retainership', icon: '🕴', practiceAreas: ['corporate'], services: ['Legal Advisory'], keywords: ['corporate lawyer nepal', 'legal retainer', 'business lawyer kathmandu'] },
  { id: 'nrn', name: 'NRN & International Clients', icon: '🌍', practiceAreas: ['fdi'], services: ['Foreign Direct Investment (FDI)', 'Corporate Law'], keywords: ['nrn invest nepal', 'diaspora investment', 'foreign client nepal lawyer'] },
  { id: 'general', name: 'General Legal', icon: '💬', practiceAreas: [], services: ['Legal Advisory'], keywords: ['lawyer kathmandu', 'legal advice nepal'] },
];

export const FAQ_CATEGORIES = CATEGORIES;

export function getFaqCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getAllFaqCategories() {
  return CATEGORIES;
}