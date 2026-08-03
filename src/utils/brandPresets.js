export const BRAND_PRESETS = [
  {
    id: 'classic',
    name: 'Classic Legal',
    tagline: 'Trusted navy & gold',
    colors: { primary: '#0a1628', secondary: '#0d4f4f', accent: '#c9a84c', background: '#ffffff', surface: '#f8f7f4', surfaceAlt: '#f0eeeb', header: '#0a1628', footer: '#0a1628', button: '#c9a84c', buttonHover: '#ffffff' },
    typography: { headingFont: "'Playfair Display', Georgia, serif", bodyFont: "'Inter', -apple-system, sans-serif", navFont: "'Inter', -apple-system, sans-serif", buttonFont: "'Inter', -apple-system, sans-serif" },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    tagline: 'Sharp slate & blue',
    colors: { primary: '#1e293b', secondary: '#0e7490', accent: '#38bdf8', background: '#ffffff', surface: '#f8fafc', surfaceAlt: '#f1f5f9', header: '#1e293b', footer: '#1e293b', button: '#0e7490', buttonHover: '#ffffff' },
    typography: { headingFont: "'Montserrat', sans-serif", bodyFont: "'Inter', -apple-system, sans-serif", navFont: "'Montserrat', sans-serif", buttonFont: "'Inter', -apple-system, sans-serif" },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Light, clean, editorial',
    colors: { primary: '#111827', secondary: '#374151', accent: '#d97706', background: '#ffffff', surface: '#fafafa', surfaceAlt: '#f4f4f5', header: '#ffffff', footer: '#111827', button: '#111827', buttonHover: '#ffffff' },
    typography: { headingFont: "'Lora', Georgia, serif", bodyFont: "'Inter', -apple-system, sans-serif", navFont: "'Lora', Georgia, serif", buttonFont: "'Inter', -apple-system, sans-serif" },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    tagline: 'Deep green & gold',
    colors: { primary: '#123c2e', secondary: '#166534', accent: '#caa53d', background: '#fffdf8', surface: '#f7f4ec', surfaceAlt: '#efeadb', header: '#123c2e', footer: '#123c2e', button: '#caa53d', buttonHover: '#ffffff' },
    typography: { headingFont: "'Crimson Text', Georgia, serif", bodyFont: "'Lato', sans-serif", navFont: "'Crimson Text', Georgia, serif", buttonFont: "'Lato', sans-serif" },
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Violet, vibrant',
    colors: { primary: '#2e1065', secondary: '#7c3aed', accent: '#f59e0b', background: '#ffffff', surface: '#faf5ff', surfaceAlt: '#f3e8ff', header: '#2e1065', footer: '#2e1065', button: '#7c3aed', buttonHover: '#ffffff' },
    typography: { headingFont: "'Poppins', sans-serif", bodyFont: "'DM Sans', sans-serif", navFont: "'Poppins', sans-serif", buttonFont: "'DM Sans', sans-serif" },
  },
  {
    id: 'dark',
    name: 'Dark Luxury',
    tagline: 'Charcoal & gold',
    colors: { primary: '#0b0f19', secondary: '#16213e', accent: '#d4af37', background: '#ffffff', surface: '#f6f7f9', surfaceAlt: '#eef0f4', header: '#0b0f19', footer: '#0b0f19', button: '#d4af37', buttonHover: '#ffffff' },
    typography: { headingFont: "'Libre Baskerville', Georgia, serif", bodyFont: "'Inter', -apple-system, sans-serif", navFont: "'Libre Baskerville', Georgia, serif", buttonFont: "'Inter', -apple-system, sans-serif" },
  },
];

export function applyPreset(brand, preset) {
  const next = { ...brand };
  next.colors = { ...brand.colors, ...preset.colors };
  next.typography = { ...brand.typography, ...preset.typography };
  return next;
}
