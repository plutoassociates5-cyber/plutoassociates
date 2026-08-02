/**
 * Local (browser localStorage) storage adapter for the Services module.
 *
 * The Services store only ever talks to a "key/value" adapter ({ getItem,
 * setItem, removeItem }). Swapping to Cloudflare KV, D1 or any backend later
 * only requires replacing this adapter — the service UI and business logic in
 * `services/store.js` stay untouched.
 */

const BACKING = typeof localStorage !== 'undefined' ? localStorage : undefined;

const shim = {
  _d: {},
  getItem(k) { return this._d[k] ?? null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

export const localAdapter = {
  name: 'localStorage',
  getItem(key) {
    const store = BACKING || shim;
    try {
      const v = store.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    const store = BACKING || shim;
    store.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    const store = BACKING || shim;
    store.removeItem(key);
  },
};