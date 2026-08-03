/**
 * Services taxonomy — the 9 practice groups (A–I) used by the "Our Services"
 * mega menu, the /services index and the public grouping.
 *
 * Each service row = [name, groupId, categoryId]. Groups mirror an
 * international firm's structure so the menu reads clearly for businesses,
 * investors, families and institutions.
 */

export const SERVICE_GROUPS = [
  {
    id: 'business', name: 'Corporate & Business', icon: '🏢',
    intro: 'Everything a company needs — from incorporation to governance, M&A, contracts and tax.',
    services: [
      ['Company Registration & Incorporation', 'corporate'],
      ['Foreign Direct Investment (FDI)', 'fdi'],
      ['Corporate Governance', 'governance'],
      ['Corporate Compliance', 'compliance'],
      ['Corporate Secretarial Services', 'governance'],
      ['Business Licensing', 'licensing'],
      ['Annual Compliance', 'compliance'],
      ['Legal Due Diligence', 'due-diligence'],
      ['Mergers & Acquisitions', 'mna'],
      ['Business Restructuring', 'mna'],
      ['Investment Advisory', 'securities'],
      ['Commercial Transactions', 'commercial'],
      ['Joint Ventures', 'joint-venture'],
      ['Shareholder Agreements', 'joint-venture'],
      ['Founders Agreements', 'joint-venture'],
      ['Commercial Contracts', 'commercial'],
      ['Contract Drafting & Review', 'commercial'],
      ['Business Legal Advisory', 'advisory'],
      ['Tax & Regulatory Compliance', 'tax'],
      ['VAT & PAN Registration', 'tax'],
    ],
  },
  {
    id: 'commercial', name: 'Commercial & Civil', icon: '⚖️',
    intro: 'Civil and commercial disputes, property and documents — handled with precision.',
    services: [
      ['Civil Litigation', 'litigation'],
      ['Commercial Litigation', 'litigation'],
      ['Debt Recovery', 'debt-recovery'],
      ['Property & Real Estate Law', 'real-estate'],
      ['Land Verification', 'real-estate'],
      ['Property Due Diligence', 'real-estate'],
      ['Property Transfer', 'real-estate'],
      ['Construction Agreements', 'real-estate'],
      ['Consumer Protection', 'litigation'],
      ['Contract Enforcement', 'litigation'],
      ['Compensation Claims', 'litigation'],
      ['Injunction Matters', 'litigation'],
      ['Specific Performance', 'commercial'],
      ['Recovery of Money', 'debt-recovery'],
      ['Legal Notices', 'documentation'],
      ['Documentation', 'documentation'],
      ['Legal Opinions', 'advisory'],
      ['Affidavits', 'documentation'],
      ['Power of Attorney', 'documentation'],
      ['Notarization', 'notarization'],
    ],
  },
  {
    id: 'family', name: 'Family & Personal', icon: '❤️',
    intro: 'Marriage, divorce, custody and succession — with care for what matters most.',
    services: [
      ['Marriage Registration', 'family'],
      ['Court Marriage', 'family'],
      ['Marriage Verification', 'family'],
      ['Divorce Proceedings', 'family'],
      ['Mutual Divorce', 'family'],
      ['Contested Divorce', 'family'],
      ['Child Custody', 'family'],
      ['Child Support', 'family'],
      ['Adoption', 'family'],
      ['Domestic Violence Matters', 'family'],
      ['Partition of Property', 'family'],
      ['Inheritance', 'estate'],
      ['Succession Certificates', 'estate'],
      ['Probate', 'estate'],
      ['Will Drafting', 'estate'],
      ['Gift Deeds', 'estate'],
      ['Personal Agreements', 'estate'],
      ['Family Settlements', 'family'],
    ],
  },
  {
    id: 'employment', name: 'Employment & Labour', icon: '👥',
    intro: 'Workforce, contracts and workplace disputes handled lawfully.',
    services: [
      ['Employment Agreements', 'employment'],
      ['Executive Contracts', 'employment'],
      ['HR Policies', 'employment'],
      ['Labour Law Compliance', 'employment'],
      ['Wrongful Termination', 'employment'],
      ['Employee Disciplinary Matters', 'employment'],
      ['Employment Disputes', 'employment'],
      ['Collective Bargaining', 'employment'],
      ['Workplace Investigations', 'employment'],
      ['Employer Advisory', 'employment'],
    ],
  },
  {
    id: 'ip', name: 'Intellectual Property & Technology', icon: '💡',
    intro: 'Protect the brands, ideas and software that build your value.',
    services: [
      ['Trademark Registration', 'ip'],
      ['Trademark Renewal', 'ip'],
      ['Trademark Opposition', 'ip'],
      ['Copyright', 'ip'],
      ['Technology Agreements', 'technology'],
      ['Software Agreements', 'technology'],
      ['Licensing', 'ip'],
      ['Confidentiality Agreements', 'commercial'],
      ['Non-Disclosure Agreements', 'commercial'],
      ['Cyber Law', 'technology'],
      ['Data Privacy', 'technology'],
      ['Digital Compliance', 'technology'],
    ],
  },
  {
    id: 'dispute', name: 'Dispute Resolution', icon: '🤝',
    intro: 'Resolve disputes commercially, outside the courtroom where possible.',
    services: [
      ['Arbitration', 'arbitration'],
      ['Mediation', 'arbitration'],
      ['Commercial Arbitration', 'arbitration'],
      ['Alternative Dispute Resolution', 'arbitration'],
      ['Negotiation', 'arbitration'],
      ['Settlement Advisory', 'arbitration'],
      ['Court Representation', 'litigation'],
      ['Regulatory Proceedings', 'litigation'],
    ],
  },
  {
    id: 'criminal', name: 'Criminal Law', icon: '🛡️',
    intro: 'Defence and application of the law where the stakes are personal.',
    services: [
      ['Criminal Defence', 'criminal'],
      ['Bail Applications', 'criminal'],
      ['White Collar Crime', 'criminal'],
      ['Fraud', 'criminal'],
      ['Cyber Crime', 'criminal'],
      ['Financial Crime', 'criminal'],
      ['Regulatory Offences', 'criminal'],
      ['Corporate Criminal Liability', 'criminal'],
    ],
  },
  {
    id: 'ngo', name: 'NGO / INGO', icon: '🏛️',
    intro: 'Set up, run and report a compliant not-for-profit organisation.',
    services: [
      ['NGO Registration', 'ngo'],
      ['INGO Compliance', 'ngo'],
      ['Project Agreements', 'ngo'],
      ['Governance Advisory', 'ngo'],
      ['Regulatory Reporting', 'ngo'],
    ],
  },
  {
    id: 'international', name: 'International Client', icon: '🌍',
    intro: 'Cross-border advisory for foreign investors and the diaspora.',
    services: [
      ['NRN Legal Services', 'fdi'],
      ['Foreign Investment Support', 'fdi'],
      ['International Business Advisory', 'fdi'],
      ['Cross-border Documentation', 'documentation'],
      ['Remote Consultation', 'advisory'],
      ['Investment Structuring', 'securities'],
    ],
  },
];

/* Flatten into [name, groupId, categoryId] rows for the seed factory. */
export const SERVICE_CATALOG = SERVICE_GROUPS.flatMap((g) =>
  g.services.map(([name, cat]) => [name, g.id, cat]),
);

export function getGroupById(id) {
  return SERVICE_GROUPS.find((g) => g.id === id);
}