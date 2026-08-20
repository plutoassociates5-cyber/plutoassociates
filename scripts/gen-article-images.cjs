/**
 * Generate on-brand branded feature images for new Pluto Associates articles.
 * Palette matches the site (navy #0a1628, teal #0d4f4f, gold #c9a84c).
 * Each image renders a category icon + soft legal motif at 1200x630 (OG ratio).
 * Run: node scripts/gen-article-images.cjs
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve('public/images');
const NAVY = '#0a1628';
const TEAL = '#0d4f4f';
const GOLD = '#c9a84c';
const CREAM = '#f5f2ea';

const ICONS = {
  // simple line icons drawn as SVG paths (24x24 grid, scaled up)
  family: 'M12 21s-7-4.6-9.5-8C.6 10.2 2.4 6.8 5.6 6.8c1.9 0 3.1.9 4 2.2.3.5.6.5.9 0 .9-1.3 2.1-2.2 4-2.2 3.2 0 5 3.4 3.1 6.2C19 16.4 12 21 12 21z',
  ngo: 'M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm8 2c-2.6 0-5 1.3-5 3v2h10v-2c0-1.7-2.4-3-5-3zM8 13C5.4 13 3 14.3 3 16v2h5.5v-2c0-1.1.5-2.1 1.4-2.9C9 13 8.5 13 8 13z',
  nrn: 'M12 2a10 10 0 1010 10A10 10 0 0012 2zm7.4 6h-3.1A15.9 15.9 0 0014 3.6 8 8 0 0119.4 8zM12 4c.6.9 1.7 2.6 2.3 4H9.7c.6-1.4 1.7-3.1 2.3-4zM8 6.7a15.9 15.9 0 00-2.3 4.3h-3.1A8 8 0 018 6.7zM4.1 12h3.1A13.7 13.7 0 008 14.9 13 13 0 007.2 16H4.6A8 8 0 014.1 12zM12 20c-.6-.9-1.6-2.6-2.3-4h4.6c-.7 1.4-1.7 3.1-2.3 4zm3.9-4A13.7 13.7 0 0012.8 12h3.2a13.7 13.7 0 001.9 3H20a8 8 0 01-4.1 5zm-4-6h4.2a14 14 0 010 2H12zM12 8h4.3a13.7 13.7 0 01-2.3 4H9.7a13.7 13.7 0 01-2.3-4H12z',
  property: 'M3 12l9-9 9 9h-3v8h-4v-5H10v5H6v-8H3z',
  tax: 'M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h10V5H7zm1 3h8v2H8V8zm0 4h4v2H8v-2zm0 4h8v2H8v-2z',
  criminal: 'M12 2a7 7 0 014.9 12-6.9 6.9 0 01-2.9-.6V20a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a6.9 6.9 0 01-2.9.6A7 7 0 0112 2zm0 4a3 3 0 100 6 3 3 0 000-6z',
  corporate: 'M4 21V11h3v10H4zm6.5 0V5h3v16h-3zM17 21V14h3v7h-3z',
  dispute: 'M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm3 3v2h4V6h-4zm0 4v2h4v-2h-4zm0 4v2h4v-2h-4zm-3 1v2h2v-2H7zm8 0v2h2v-2h-2z',
};

function svgFor(key, title) {
  const icon = ICONS[key] || ICONS.corporate;
  const t = (title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.55" stop-color="#0d2740"/>
      <stop offset="1" stop-color="${TEAL}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.2" r="0.9">
      <stop offset="0" stop-color="#c9a84c" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#c9a84c" stop-opacity="0"/>
    </radialGradient>
    <style>
      .title { font-family: Georgia, 'Times New Roman', serif; font-size: 42px; font-weight: 600; fill: ${CREAM}; letter-spacing: 1px; }
      .sub { font-family: Arial, sans-serif; font-size: 19px; letter-spacing: 4px; fill: ${GOLD}; text-transform: uppercase; }
      .icon { stroke: ${GOLD}; stroke-width: 1.6; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g stroke="${GOLD}" stroke-opacity="0.18">
    <line x1="0" y1="180" x2="1200" y2="180"/>
    <line x1="0" y1="360" x2="1200" y2="360"/>
    <line x1="0" y1="520" x2="1200" y2="520"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="700" y1="0" x2="700" y2="630"/>
    <line x1="1100" y1="0" x2="1100" y2="630"/>
  </g>
  <circle cx="1010" cy="150" r="120" stroke="${GOLD}" stroke-opacity="0.25" fill="none"/>
  <circle cx="1010" cy="150" r="70" stroke="${GOLD}" stroke-opacity="0.25" fill="none"/>
  <text x="86" y="150" class="sub">Pluto Associates</text>
  <text x="82" y="218" class="title" xml:space="preserve">${t}</text>
  <g transform="translate(78,300)">
    <path class="icon" transform="scale(9) translate(-5.5,-5)" d="${icon}"/>
  </g>
  <line x1="86" y1="470" x2="356" y2="470" stroke="${GOLD}" stroke-width="2"/>
  <text x="86" y="520" class="sub">Advocates &amp; Legal Consultants · Kathmandu, Nepal</text>
</svg>`;
}

const SPECS = [
  { key: 'family', file: 'divorce-family-law-nepal.jpg', title: 'Divorce & Family Law in Nepal' },
  { key: 'ngo', file: 'ngo-registration-nepal.jpg', title: 'Registering an NGO in Nepal' },
  { key: 'nrn', file: 'nrn-investment-nepal.jpg', title: 'NRN Investment in Nepal' },
  { key: 'property', file: 'property-ownership-nepal.jpg', title: 'Property Ownership in Nepal' },
  { key: 'tax', file: 'pan-vat-tax-nepal.jpg', title: 'PAN, VAT & Tax in Nepal' },
  { key: 'criminal', file: 'bail-criminal-law-nepal.jpg', title: 'Bail & Criminal Law in Nepal' },
  { key: 'corporate', file: 'company-registration-nepal.jpg', title: 'Registering a Company in Nepal' },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const s of SPECS) {
    const svg = Buffer.from(svgFor(s.key, s.title));
    await sharp(svg, { density: 120 }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, s.file));
    const kb = Math.round((fs.statSync(path.join(OUT, s.file)).size / 1024) * 10) / 10;
    console.log(`${s.file} -> ${kb} KB`);
  }
  console.log('done');
})();