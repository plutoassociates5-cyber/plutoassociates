const ART_KEY = 'pluto_articles';
const CRED_KEY = 'mlp_creds';

export function getArticles() {
  try { return JSON.parse(localStorage.getItem(ART_KEY)) || []; } catch { return []; }
}

export function saveArticles(articles) {
  localStorage.setItem(ART_KEY, JSON.stringify(articles));
}

export function getCreds() {
  try {
    return JSON.parse(localStorage.getItem(CRED_KEY)) || { u: 'pluto', p: 'pluto@2025', n: 'Admin' };
  } catch {
    return { u: 'pluto', p: 'pluto@2025', n: 'Admin' };
  }
}

export function saveCreds(creds) {
  localStorage.setItem(CRED_KEY, JSON.stringify(creds));
}

export function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

export function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}