/**
 * Services taxonomy — the 9 practice groups used by the
 * /services index and the public grouping.
 *
 * Each service row = [name, groupId, categoryId]. Groups mirror an
 * international firm's structure so the menu reads clearly for businesses,
 * investors, families and institutions.
 */

export const SERVICE_GROUPS = [
  {
    id: 'business', name: 'Corporate & Business', icon: '🏢',
    intro: 'Everything a company needs, from incorporation to governance, M&A, contracts and tax.',
    services: [
      ['Company Registration & Incorporation', 'corporate'],
      ['Foreign Direct Investment (FDI)', 'fdi'],
      ['Corporate Compliance & Governance', 'governance'],
      ['Business Licensing', 'licensing'],
      ['Mergers, Acquisitions & Restructuring', 'mna'],
      ['Legal Due Diligence', 'due-diligence'],
      ['Commercial Contracts & Agreements', 'commercial'],
      ['Shareholder & Founders Agreements', 'joint-venture'],
      ['Tax, VAT & PAN Compliance', 'tax'],
    ],
  },
  {
    id: 'commercial', name: 'Commercial & Civil', icon: '⚖️',
    intro: 'Civil and commercial disputes, property and documents, handled with precision.',
    services: [
      ['Civil & Commercial Litigation', 'litigation'],
      ['Debt Recovery & Money Claims', 'debt-recovery'],
      ['Property & Real Estate Law', 'real-estate'],
      ['Land Verification & Due Diligence', 'real-estate'],
      ['Property Transfer & Construction Agreements', 'real-estate'],
      ['Legal Notices & Documentation', 'documentation'],
      ['Affidavits, Power of Attorney & Notarization', 'notarization'],
      ['Legal Opinions', 'advisory'],
    ],
  },
  {
    id: 'family', name: 'Family & Personal', icon: '❤️',
    intro: 'Marriage, divorce, custody and succession, with care for what matters most.',
    services: [
      ['Marriage & Court Marriage Registration', 'family'],
      ['Divorce & Separation', 'family'],
      ['Child Custody & Support', 'family'],
      ['Adoption', 'family'],
      ['Domestic Violence Matters', 'family'],
      ['Partition & Family Settlements', 'family'],
      ['Wills, Probate & Succession', 'estate'],
    ],
  },
  {
    id: 'employment', name: 'Employment & Labour', icon: '👥',
    intro: 'Workforce, contracts and workplace disputes, handled lawfully.',
    services: [
      ['Employment Contracts & Agreements', 'employment'],
      ['HR Policies & Labour Compliance', 'employment'],
      ['Employment Disputes & Wrongful Termination', 'employment'],
      ['Disciplinary & Workplace Matters', 'employment'],
      ['Collective Bargaining', 'employment'],
      ['Employer Advisory', 'employment'],
    ],
  },
  {
    id: 'ip', name: 'Intellectual Property & Technology', icon: '💡',
    intro: 'Protect the brands, ideas and software that build your value.',
    services: [
      ['Trademark Registration & Renewal', 'ip'],
      ['Trademark Opposition', 'ip'],
      ['Copyright', 'ip'],
      ['Technology & Software Agreements', 'technology'],
      ['Licensing & Confidentiality Agreements', 'commercial'],
      ['Cyber Law & Data Privacy', 'technology'],
    ],
  },
  {
    id: 'dispute', name: 'Dispute Resolution', icon: '🤝',
    intro: 'Resolve disputes commercially, outside the courtroom where possible.',
    services: [
      ['Arbitration', 'arbitration'],
      ['Mediation & Negotiation', 'arbitration'],
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
      ['White Collar & Financial Crime', 'criminal'],
      ['Cyber Crime', 'criminal'],
      ['Corporate Liability & Regulatory Offences', 'criminal'],
    ],
  },
  {
    id: 'ngo', name: 'NGO / INGO', icon: '🏛️',
    intro: 'Set up, run and report a compliant not-for-profit organisation.',
    services: [
      ['NGO & INGO Registration', 'ngo'],
      ['INGO Compliance', 'ngo'],
      ['Project Agreements', 'ngo'],
      ['Governance & Regulatory Reporting', 'ngo'],
    ],
  },
  {
    id: 'international', name: 'International Clients', icon: '🌍',
    intro: 'Cross-border advisory for foreign investors and the diaspora.',
    services: [
      ['NRN Legal Services', 'fdi'],
      ['Foreign Investment Advisory', 'fdi'],
      ['International Business Advisory', 'fdi'],
      ['Cross-border Documentation', 'documentation'],
      ['Remote Consultation', 'advisory'],
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
