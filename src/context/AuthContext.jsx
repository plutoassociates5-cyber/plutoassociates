import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SESS_KEY = 'mlp_session';
const AuthContext = createContext(null);

/* Local-development credentials (only active when running `vite` dev server;
   these VITE_ vars are stripped from production builds, unlike the old
   hardcoded password which shipped to every visitor). */
const DEV_USER = import.meta.env.VITE_DEV_ADMIN_USER;
const DEV_PASS = import.meta.env.VITE_DEV_ADMIN_PASSWORD;

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s && s.exp && s.exp > Date.now()) return s;
    sessionStorage.removeItem(SESS_KEY);
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const s = readSession();
    if (s) setUser(s.user);
  }, []);

  const login = useCallback(async (username, password) => {
    if (import.meta.env.DEV && DEV_USER && DEV_PASS) {
      if (username === DEV_USER && password === DEV_PASS) {
        const s = { user: { name: 'Admin (dev)', role: 'super' }, exp: Date.now() + 43200000, token: 'dev' };
        sessionStorage.setItem(SESS_KEY, JSON.stringify(s));
        setUser(s.user);
        return true;
      }
      return false;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data || !data.ok) return false;
      const s = {
        user: data.user || { name: username, role: 'super' },
        exp: data.exp || Date.now() + 43200000,
        token: data.token,
      };
      sessionStorage.setItem(SESS_KEY, JSON.stringify(s));
      setUser(s.user);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESS_KEY);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
