const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OUT = path.join(__dirname, '..', 'public', 'images');
const NAVY = '#0a1628';
const NAVY_2 = '#12233d';
const GOLD = '#c9a227';
const GOLD_LIGHT = '#e2c766';
const CREAM = '#f7f5f0';
const BODY = '#334155';
const MUTED = '#64748b';
const BORDER = '#ddd8cc';

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(text, max) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (candidate.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines, x, y, lineHeight) {
  return lines.map((line, i) => `<tspan x="${x}" y="${y + i * lineHeight}">${esc(line)}</tspan>`).join('');
}

function featured({ file, kicker, title, subtitle, tags }) {
  const titleLines = wrap(title, 28).slice(0, 3);
  const titleSize = titleLines.length >= 3 ? 50 : 56;
  const subLines = wrap(subtitle, 62).slice(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.62" stop-color="${NAVY_2}"/>
      <stop offset="1" stop-color="#1a2f4d"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${GOLD}"/>
      <stop offset="1" stop-color="${GOLD_LIGHT}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1090" cy="90" r="250" fill="${GOLD}" opacity="0.07"/>
  <circle cx="1090" cy="90" r="160" fill="none" stroke="${GOLD}" stroke-opacity="0.16" stroke-width="1"/>
  <path d="M0 512 L1200 424" stroke="${GOLD}" stroke-opacity="0.18" stroke-width="1"/>
  <path d="M0 540 L1200 452" stroke="${GOLD}" stroke-opacity="0.09" stroke-width="1"/>
  <rect x="0" y="0" width="10" height="630" fill="${GOLD}"/>
  <text x="84" y="88" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="700" letter-spacing="2.2">${esc(kicker)}</text>
  <text x="1116" y="88" text-anchor="end" fill="#ffffff" fill-opacity="0.56" font-family="Arial, Helvetica, sans-serif" font-size="16" letter-spacing="1.4">2026 GUIDE</text>
  <rect x="84" y="116" width="118" height="4" fill="url(#rule)"/>
  <text fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize}" font-weight="700">${tspans(titleLines, 84, 224, titleSize + 10)}</text>
  <text fill="#ffffff" fill-opacity="0.74" font-family="Arial, Helvetica, sans-serif" font-size="23">${tspans(subLines, 84, 414, 32)}</text>
  <text x="84" y="492" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1.6">${esc(tags)}</text>
  <line x1="84" y1="536" x2="1116" y2="536" stroke="${GOLD}" stroke-opacity="0.42"/>
  <text x="84" y="575" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700">Pluto Associates</text>
  <text x="84" y="601" fill="#ffffff" fill-opacity="0.55" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="0.6">Corporate &amp; FDI Law · Kathmandu, Nepal</text>
  <text x="1116" y="601" text-anchor="end" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="0.6">plutoassociates.com</text>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(OUT, file));
}

function flow({ file, title, subtitle, steps }) {
  const titleLines = wrap(title, 54).slice(0, 2);
  const boxW = 190;
  const gap = 30;
  const total = steps.length * boxW + (steps.length - 1) * gap;
  const start = (1200 - total) / 2;
  const boxes = steps.map((step, i) => {
    const x = start + i * (boxW + gap);
    const labelLines = wrap(step.label, 16).slice(0, 2);
    const noteLines = wrap(step.note, 24).slice(0, 3);
    const chevron = i < steps.length - 1
      ? `<path d="M${x + boxW + 10} 340 L${x + boxW + 20} 348 L${x + boxW + 10} 356" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      : '';
    return `<g>
      <rect x="${x}" y="230" width="${boxW}" height="220" fill="#ffffff" stroke="${BORDER}" stroke-width="1"/>
      <rect x="${x}" y="230" width="${boxW}" height="5" fill="${GOLD}"/>
      <circle cx="${x + 26}" cy="266" r="18" fill="${NAVY}"/>
      <text x="${x + 26}" y="272" text-anchor="middle" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">${i + 1}</text>
      <text fill="${NAVY}" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700">${tspans(labelLines, x + 22, 316, 22)}</text>
      <text fill="${BODY}" font-family="Arial, Helvetica, sans-serif" font-size="13">${tspans(noteLines, x + 22, 374, 19)}</text>
      ${chevron}
    </g>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="${CREAM}"/>
  <rect width="1200" height="150" fill="${NAVY}"/>
  <rect x="0" y="0" width="9" height="675" fill="${GOLD}"/>
  <text x="80" y="64" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">PLUTO ASSOCIATES · NEPAL</text>
  <text fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="32" font-weight="700">${tspans(titleLines, 80, 100, 36)}</text>
  <text x="80" y="142" fill="#ffffff" fill-opacity="0.62" font-family="Arial, Helvetica, sans-serif" font-size="16">${esc(subtitle)}</text>
  <text x="80" y="500" fill="${MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="13">Indicative sequence. Sector rules and approval authorities vary by project.</text>
  ${boxes}
  <line x1="80" y1="604" x2="1120" y2="604" stroke="${BORDER}"/>
  <text x="80" y="638" fill="${MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="13">Corporate &amp; FDI Law · Kathmandu, Nepal</text>
  <text x="1120" y="638" text-anchor="end" fill="${NAVY}" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700">plutoassociates.com</text>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(OUT, file));
}

function comparison({ file, title, subtitle, columns }) {
  const colW = 320;
  const gap = 30;
  const start = (1200 - (columns.length * colW + (columns.length - 1) * gap)) / 2;
  const cards = columns.map((col, i) => {
    const x = start + i * (colW + gap);
    const bulletLines = col.points.map((point, j) => {
      const lines = wrap(point, 31).slice(0, 2);
      return `<text fill="${BODY}" font-family="Arial, Helvetica, sans-serif" font-size="14">${tspans(lines, x + 28, 360 + j * 66, 20)}</text>
      <circle cx="${x + 18}" cy="${356 + j * 66}" r="3" fill="${GOLD}"/>`;
    }).join('');
    return `<g>
      <rect x="${x}" y="214" width="${colW}" height="352" fill="#ffffff" stroke="${BORDER}"/>
      <rect x="${x}" y="214" width="${colW}" height="76" fill="${NAVY}"/>
      <rect x="${x}" y="214" width="${colW}" height="5" fill="${i === 2 ? GOLD : '#94a3b8'}"/>
      <text x="${x + 28}" y="260" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="700">${esc(col.heading)}</text>
      ${bulletLines}
    </g>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="${CREAM}"/>
  <rect width="1200" height="160" fill="${NAVY}"/>
  <rect x="0" y="0" width="9" height="675" fill="${GOLD}"/>
  <text x="80" y="62" fill="${GOLD_LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="2">MARKET ENTRY · NEPAL</text>
  <text x="80" y="110" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700">${esc(title)}</text>
  <text x="80" y="146" fill="#ffffff" fill-opacity="0.62" font-family="Arial, Helvetica, sans-serif" font-size="16">${esc(subtitle)}</text>
  ${cards}
  <line x1="80" y1="612" x2="1120" y2="612" stroke="${BORDER}"/>
  <text x="80" y="645" fill="${MUTED}" font-family="Arial, Helvetica, sans-serif" font-size="13">Corporate &amp; FDI Law · Kathmandu, Nepal</text>
  <text x="1120" y="645" text-anchor="end" fill="${NAVY}" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700">plutoassociates.com</text>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(path.join(OUT, file));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await Promise.all([
    featured({
      file: 'company-registration-nepal-2026.jpg',
      kicker: 'CORPORATE & FDI LAW · NEPAL',
      title: 'Company Registration in Nepal',
      subtitle: 'Costs, documents, OCR process and timeline for 2026',
      tags: 'OCR · PAN/VAT · COMPLIANCE',
    }),
    featured({
      file: 'foreign-company-setup-nepal-2026.jpg',
      kicker: 'FOREIGN INVESTMENT · NEPAL',
      title: 'Setting Up a Company in Nepal',
      subtitle: "A foreign investor's guide to FITTA approval and NRB recording",
      tags: 'FITTA 2019 · DOI · NRB',
    }),
    featured({
      file: 'fdi-registration-nepal-2026.jpg',
      kicker: 'FDI REGISTRATION · NEPAL',
      title: 'FDI Registration in Nepal',
      subtitle: 'DOI approval, incorporation, capital injection and compliance',
      tags: 'DOI · OCR · NRB',
    }),
    featured({
      file: 'branch-liaison-subsidiary-nepal-2026.jpg',
      kicker: 'MARKET ENTRY · NEPAL',
      title: 'Branch, Liaison or Subsidiary?',
      subtitle: "Choosing the right Nepal presence for your foreign company",
      tags: 'DOI · OCR · LIABILITY',
    }),
    featured({
      file: 'repatriation-profits-nepal-2026.jpg',
      kicker: 'REPATRIATION · NEPAL',
      title: 'Repatriating Profits from Nepal',
      subtitle: 'Dividends, capital, tax clearance and NRB approval',
      tags: 'NRB · DTAA · TAX CLEARANCE',
    }),
    featured({
      file: 'minimum-foreign-investment-nepal-2026.jpg',
      kicker: 'FDI THRESHOLDS · NEPAL',
      title: 'Minimum Foreign Investment in Nepal',
      subtitle: 'The NPR 20 million rule, what it covers and how to comply',
      tags: 'FITTA 2019 · NPR 20M · NRB',
    }),
    flow({
      file: 'company-registration-steps-nepal.jpg',
      title: 'Company registration in Nepal: the sequence',
      subtitle: 'A domestic private limited company at the OCR',
      steps: [
        { label: 'Name clearance', note: 'Reserve the name at the OCR' },
        { label: 'MoA and AoA', note: 'Draft and sign the charter' },
        { label: 'OCR filing', note: 'Certificate of incorporation' },
        { label: 'PAN and VAT', note: 'Register with the IRD' },
        { label: 'Bank account', note: 'Open and fund the company' },
      ],
    }),
    flow({
      file: 'fdi-registration-steps-nepal.jpg',
      title: 'FDI registration in Nepal: five core stages',
      subtitle: 'Approval comes before incorporation and capital injection',
      steps: [
        { label: 'Sector check', note: 'Negative list and eligibility' },
        { label: 'DOI or IBN', note: 'Foreign investment approval' },
        { label: 'OCR', note: 'Incorporate the company' },
        { label: 'NRB', note: 'Record the capital inflow' },
        { label: 'Compliance', note: 'Tax, filings and renewals' },
      ],
    }),
    flow({
      file: 'repatriation-process-nepal.jpg',
      title: 'Repatriating profits: the approval chain',
      subtitle: 'Tax clearance comes before DOI or IBN and NRB approval',
      steps: [
        { label: 'Tax clearance', note: 'Settle all tax liabilities' },
        { label: 'Board resolution', note: 'Declare the distribution' },
        { label: 'DOI or IBN', note: 'Obtain investment clearance' },
        { label: 'NRB', note: 'Approve the remittance' },
        { label: 'Bank transfer', note: 'Funds leave Nepal' },
      ],
    }),
    flow({
      file: 'minimum-investment-check-nepal.jpg',
      title: "Does your investment meet Nepal's FDI minimum?",
      subtitle: 'General rule: NPR 20 million per foreign investor',
      steps: [
        { label: 'Sector', note: 'Check the negative list' },
        { label: 'Route', note: 'Equity, loan or technology' },
        { label: 'Threshold', note: 'NPR 20 million general rule' },
        { label: 'NRB record', note: 'Bring capital through banking' },
        { label: 'Compliance', note: 'Tax and annual filings' },
      ],
    }),
    comparison({
      file: 'branch-liaison-subsidiary-comparison.jpg',
      title: 'Branch vs liaison vs subsidiary',
      subtitle: 'Three ways for a foreign company to operate in Nepal',
      columns: [
        { heading: 'Branch', points: ['Trades and invoices', 'Parent remains liable', 'PAN and VAT', 'Repatriates after tax'] },
        { heading: 'Liaison', points: ['No trading activity', 'Funded by the parent', 'Limited tax duties', 'No profit repatriation'] },
        { heading: 'Subsidiary', points: ['Separate Nepali company', 'Limited liability', 'Full tax compliance', 'Dividends after tax'] },
      ],
    }),
  ]);
  console.log('generated article images in', OUT);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
