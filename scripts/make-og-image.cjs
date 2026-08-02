const sharp = require('sharp');
const path = require('path');

const OUT = process.argv[2];

(async () => {
  try {
    const logo = await sharp(path.join('src', 'assets', 'logo.png')).resize(200, 200, { fit: 'contain' }).toBuffer();

    const svgText = Buffer.from(`
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0a1628"/>
        <rect x="0" y="520" width="1200" height="12" fill="#c9a84c"/>
        <text x="600" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="#ffffff" text-anchor="middle">Pluto Associates</text>
        <text x="600" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#c9a84c" text-anchor="middle" letter-spacing="6">ADVOCATES &amp; LEGAL CONSULTANTS</text>
        <text x="600" y="480" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#8fa3bd" text-anchor="middle">Corporate Law  ·  FDI  ·  Litigation  ·  Intellectual Property  ·  Nepal</text>
      </svg>
    `);

    await sharp({
      create: { width: 1200, height: 630, channels: 4, background: { r: 10, g: 22, b: 40, alpha: 1 } }
    })
      .composite([
        { input: logo, top: 60, left: 500 },
        { input: svgText, top: 0, left: 0 }
      ])
      .png({ quality: 90 })
      .toFile(OUT);
    console.log('OG image written:', OUT);
  } catch (err) {
    console.error('OG image generation failed:', err.message);
    process.exit(1);
  }
})();
