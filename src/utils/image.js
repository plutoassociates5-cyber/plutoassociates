export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Failed to read file'));
    r.readAsDataURL(file);
  });
}

export function isSvg(src) {
  return /data:image\/svg\+xml|\.svg(\?|$)/i.test(src || '');
}

export function inferMimeType(src, fallback = 'image/jpeg') {
  const m = /data:([^;,]+)/.exec(src || '');
  return m ? m[1] : fallback;
}

export async function resizeDataUrl(src, { maxWidth = 1600, maxHeight = 1600, quality = 0.85, upscale = true } = {}) {
  if (isSvg(src)) return { dataUrl: src, width: null, height: null, skipped: true };

  const img = await loadImage(src);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const scale = Math.min(upscale ? 20 : 1, maxWidth / w, maxHeight / h);
  const dw = Math.max(1, Math.round(w * scale));
  const dh = Math.max(1, Math.round(h * scale));

  if (dw === w && dh === h) return { dataUrl: src, width: dw, height: dh, skipped: true };

  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (/png|webp|gif/i.test(inferMimeType(src))) {
    ctx.clearRect(0, 0, dw, dh);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dw, dh);
  }
  ctx.drawImage(img, 0, 0, dw, dh);

  const mime = /png|webp/i.test(inferMimeType(src)) ? inferMimeType(src) : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mime, mime === 'image/jpeg' ? quality : undefined);
  return { dataUrl, width: dw, height: dh, skipped: false };
}