import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSettings, saveSettings, deepMerge, BRAND_SEED } from '../utils/contentStore';
import { applyBrandVars } from '../utils/brandVars';

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [settings, setSettings] = useState(() => getSettings());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    applyBrandVars(settings);
  }, [settings]);

  const updateBrand = useCallback((updater, meta) => {
    setSettings((prev) => {
      const cur = getSettings();
      const next = deepMerge(cur, {});
      if (typeof updater === 'function') {
        updater(next.brand);
      } else {
        next.brand = deepMerge(BRAND_SEED, updater);
      }
      if (meta) next._brandMeta = meta;
      saveSettings(next);
      setTick((t) => t + 1);
      return next;
    });
  }, []);

  const saveWhole = useCallback((nextSettings) => {
    saveSettings(nextSettings);
    setSettings(nextSettings);
    setTick((t) => t + 1);
  }, []);

  const resetBrand = useCallback((meta) => {
    const cur = getSettings();
    const next = deepMerge(cur, {});
    next.brand = deepMerge(BRAND_SEED, {});
    if (meta) next._brandMeta = meta;
    saveSettings(next);
    setSettings(next);
    setTick((t) => t + 1);
  }, []);

  const value = useMemo(
    () => ({ settings, brand: settings.brand || {}, updateBrand, resetBrand, saveWhole, refresh: () => setSettings(getSettings()), tick }),
    [settings, updateBrand, resetBrand, saveWhole, tick],
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
