import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCreds } from '../utils/storage';

const SESS_KEY = 'mlp_session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESS_KEY) === '1') {
      const c = getCreds();
      setUser({ name: c.n || 'Admin', role: c.role || 'super' });
    }
  }, []);

  const login = useCallback((username, password) => {
    const c = getCreds();
    if (username === c.u && password === c.p) {
      sessionStorage.setItem(SESS_KEY, '1');
      setUser({ name: c.n || 'Admin', role: c.role || 'super' });
      return true;
    }
    return false;
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