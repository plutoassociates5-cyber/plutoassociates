/**
 * One-time image optimizer for Pluto Associates.
 * Re-encodes the large in-use source images in place with sharp:
 *  - Downscales to a sensible max width (they are displayed well below that)
 *  - Recompresses to JPEG quality ~68-75 (visually near-identical)
 * Run: node scripts/optimize-images.cjs
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// [file, maxWidth, quality]
const TARGETS = [
  ['src/assets/hero-1.jpeg', 1920, 68],
  ['src/assets/hero-2.jpeg', 1920, 68],
  ['src/assets/hero-3.jpeg', 1920, 68],
  ['src/assets/office-photo.jpeg', 1600, 68],
  ['src/assets/teams-background.jpg', 1920, 68],
  ['src/assets/about1.jpg', 1200, 70],
  ['src/assets/team-sudeep.jpg', 900, 72],
  ['src/assets/team-sujan.jpeg', 320, 75],
  ['src/assets/team-nikesh.jpeg', 320, 75],
  ['src/assets/team-motey.jpeg', 320, 75],
];

(async () => {
  for (const [file, maxWidth, quality] of TARGETS) {
    const abs = path.resolve(file);
    const tmp = abs + '.tmp.jpg';
    const { width } = await sharp(abs).metadata();
    if (width > maxWidth) {
      await sharp(abs).resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(tmp);
    } else {
      await sharp(abs).jpeg({ quality, mozjpeg: true }).toFile(tmp);
    }
    fs.renameSync(tmp, abs);
    const { width: w2 } = await sharp(abs).metadata();
    const kb = Math.round((fs.statSync(abs).size / 1024) * 10) / 10;
    console.log(`${file} -> ${w2}px, ${kb} KB`);
  }
  console.log('Done.');
})();
