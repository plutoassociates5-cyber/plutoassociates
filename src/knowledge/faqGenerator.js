import { getFaqCategory } from './faqCategories.js';

const LAW = {
  'corporate-law': 'the Companies Act and practice at the Office of the Company Registrar (OCR)',
  'company-registration': 'the Companies Act, administered by the Office of the Company Registrar (OCR)',
  fdi: 'the Foreign Investment and Technology Transfer Act (FITTA) and Nepal FDI policy',
  'corporate-governance': 'the Companies Act and the company own articles',
  compliance: 'the Companies Act and the regulatory registrations of the company',
  'commercial-contracts': 'Nepali contract law and the terms of the agreement',
  'joint-cventures': 'the Companies Act and any shareholders or joint venture agreement',
  mna: 'the Companies Act and the rules around transfer of shares or assets',
  employment: 'the Labour Act and the employment contract',
  taxation: 'the Inland Revenue laws and the VAT regime of Nepal',
  licensing: 'the sector licensing laws that apply to the activity',
  'intellectual-property': 'the laws and practice for IP registration at the concerned authority',
  technology: 'the data protection and cyber security framework applicable in Nepal',
  property: 'the land and property laws of Nepal and the recorded title',
  litigation: 'the procedural rules of the courts of Nepal',
  arbitration: 'the Arbitration Act of Nepal and any agreed procedure',
  'debt-recovery': 'the law of obligations and the available claims procedure',
  banking: 'the banking and financial regulation relevant to the transaction',
  securities: 'the securities market regulation relevant to the issue or transfer',
  nonprofit: 'the legal framework for NGOs and INGOs in Nepal',
  documents: 'the formal execution and documentation requirements',
  advisory: 'the laws relevant to the specific matter',
  nrn: 'the foreign investment rules and the position of credit in Nepal',
  general: 'the applicable law of Nepal',
};

const FRAMES = [
  { id: 'how', q: 'How do I {topic} in Nepal?', body: 'The practical route to {topic} in Nepal begins by confirming that the current position is up to date, because requirements change. In broad terms the matter proceeds under {given} and follows a defined series of steps and filings. The key to speed is confirming the correct step for your facts before you begin, because different circumstances take a different path. A professional can prepare and file the documents so they are accepted correctly the first time.' },
  { id: 'can', q: 'Can I {topic} in Nepal?', body: 'Whether you can {topic} in Nepal depends on the rules that apply under {given}, together with your own situation. In most areas the answer is not absolute; it depends on meeting conditions and completing the correct step. Some matters are available to most individuals or entities, while others are limited to particular classes of person or businesses. The sure way to know the answer for you is to confirm the current rule against your facts, so you do not act on an understanding that no longer fits.' },
  { id: 'time', q: 'How long does {topic} take in Nepal?', body: 'How long {topic} takes in Nepal depends mainly on the completeness of what you provide and the processing time of the authority involved. In practice the biggest time does not come from the authority but from following up on missing documents, because an incomplete file is moved to the back and on completion. For that reason we do not quote a single fixed duration; we explain the steps and prepare the file properly so it is not returned. When handled by a professional, the file is complete from the beginning and tends to move without repeated steps.' },
  { id: 'cost', q: 'How much does {topic} cost in Nepal?', body: 'The cost of {topic} in Nepal varies, because the total depends on the different government and stamp fees that apply and on the professional work needed to do it correctly. There is no single fixed price for every case; the amount depends on the exact facts. What matters more than a number is avoiding the cost of error, since a rejected filing or a missed step usually costs more to fix than the first work. We confirm the applicable fee schedule at the time and give you a clear, fixed quote for a known scope so you know the cost of the road.' },
  { id: 'what', q: 'What is {topic} and why does it matter for my business?', body: '{topic} refers to the matter governed of {given}, and doing it well depends on practical consequences for your position rather than on theory. Most people only meet it when a delay, a refusal or a dispute brings it to mind. Understanding it before you need it matters because the rules are easier to satisfy properly in advance than to repair once a step has been missed. It is a normal part of the responsible, well-run business in Nepal and of managing risk.' },
  { id: 'documents', q: 'What documents are needed for {topic} in Nepal?', body: 'The documents for {topic} in Nepal depend on {given} and specifically on your facts, but they generally include the identification of the people involved, the source or business records that the matter concerns, and the forms or register that the authority is expected. Because the exact list varies, it should be confirmed rather than guessed; providing the wrong set is the most frequent cause of delay. When the correct documents are gathered and in the current format the matter moves in a single pass.' },
  { id: 'risk', q: 'What happens if I get {topic} wrong?', body: 'Getting {topic} wrong rarely appears as an immediate failure; it usually becomes exposure quietly. In practice an error in the paperwork, a missed rule, or acting on guidance intended for someone else shows up later as a fine, a record that is no longer clean, a blocked transaction, or a dispute. The reason the step itself is cheaper is that the problem that follows it usually costs many times more. Most of these things, if caught, are correctable, and the cost is far lower when you catch the risk before it is a dispute.' },
];

const CTAS = [
  'For a clear answer on your own facts, a short consultation will confirm the correct route and step you through it.',
  'We would be happy to discuss your matter and confirm the current requirements so you can proceed with confidence.',
  'A consultation is the quickest way to turn this general position into a concrete plan for your situation.',
];

export function lawAnchor(categoryId) {
  return LAW[categoryId] || 'applicable law in Nepal';
}

export function categoryName(categoryId) {
  const c = getFaqCategory(categoryId) || {};
  return c.name || categoryId;
}

export function generateFaqs(p = {}) {
  const category = p.category || 'general';
  const topic = (p.topic || categoryName(category)).trim() || categoryName(category);
  const count = Math.max(1, Math.min(Number(p.count) || 5, 20));
  const given = lawAnchor(category);
  const out = [];
  for (let i = 0; i < count; i++) {
    const f = FRAMES[(i + (p.offset || 0)) % FRAMES.length];
    const value = f.body
      .split('{topic}').join(topic)
      .split('{given}').join(given)
      .replace(/\s+/g, ' ')
      .trim();
    const question = f.q.replace('{topic}', topic);
    const cta = CTAS[i % CTAS.length];
    out.push({
      category,
      question,
      answer: value + ' ' + cta,
      keywords: [topic.toLowerCase(), f.id].filter(Boolean),
      status: 'draft',
      source: 'ai',
    });
  }
  return out;
}