/**
 * Admin authentication — Cloudflare Pages Function.
 *
 * POST /api/auth  { username, password }
 *
 * Credentials live in Pages environment variables (never in the repo):
 *   ADMIN_USER      — admin username
 *   ADMIN_PASSWORD  — admin password
 *   ADMIN_SECRET    — random string used to sign session tokens
 *   ADMIN_NAME      — (optional) display name for the admin panel
 *
 * Returns { ok: true, token, exp, user } on success; 401 otherwise.
 * The token is an HMAC-SHA256 signature over "<user>.<exp>"; it is stored in
 * sessionStorage by the client and expires after 12 hours.
 */

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function base64Url(bytes) {
  let str = '';
  for (const b of new Uint8Array(bytes)) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64Url(sig);
}

/** Length-independent comparison to avoid trivial timing leaks. */
function safeEqual(a, b) {
  const x = encoder.encode(String(a));
  const y = encoder.encode(String(b));
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_USER || !env.ADMIN_PASSWORD || !env.ADMIN_SECRET) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const username = String(body && body.username ? body.username : '');
  const password = String(body && body.password ? body.password : '');

  const userOk = safeEqual(username, env.ADMIN_USER);
  const passOk = safeEqual(password, env.ADMIN_PASSWORD);
  if (!userOk || !passOk) {
    return json({ ok: false, error: 'invalid_credentials' }, 401);
  }

  const exp = Date.now() + TOKEN_TTL_MS;
  const token = await sign(`${username}.${exp}`, env.ADMIN_SECRET);

  return json({
    ok: true,
    token,
    exp,
    user: { name: env.ADMIN_NAME || username, role: 'super' },
  });
}

export async function onRequestGet() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
