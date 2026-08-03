import { Section, Grid, ColorField, Segmented, Slider, Select, Field } from './fields';
import { FONT_OPTIONS } from '../../../utils/brandVars';

const BRAND_PRESETS = ['#0a1628', '#132038', '#1d3557', '#14532d', '#581c87', '#7f1d1d', '#1e293b', '#7c2d12'];
const ACCENT_PRESETS = ['#c9a84c', '#d4b85c', '#0e7490', '#047857', '#b45309', '#c026d3', '#0369a1', '#dc2626'];
const SECONDARY_PRESETS = ['#0d4f4f', '#147272', '#0e7490', '#166534', '#4338ca', '#9d174d'];
const NEUTRAL_PRESETS = ['#ffffff', '#f8f7f4', '#f0eeeb', '#f4f4f5', '#fefce8', '#f8fafc'];

export default function BrandAppearanceTab({ b, set, canEdit, focus }) {
  const showColors = !focus || focus === 'colors';
  const showType = !focus || focus === 'typography';
  return (
    <div className="flex flex-col gap-5">
      {showColors && (
      <Section
        title="Brand colors"
        desc="These drive every Tailwind color on the site (navy/gold/teal/surface/text) in real time. Sitewide tokens are listed on the right."
      >
        <Grid cols={3}>
          <ColorField label="Primary" hint="headers · main dark" value={b.colors.primary} onChange={(v) => set('colors', 'primary', v)} presets={BRAND_PRESETS} disabled={!canEdit} />
          <ColorField label="Secondary" hint="accents / teal" value={b.colors.secondary} onChange={(v) => set('colors', 'secondary', v)} presets={SECONDARY_PRESETS} disabled={!canEdit} />
          <ColorField label="Accent" hint="gold · highlights" value={b.colors.accent} onChange={(v) => set('colors', 'accent', v)} presets={ACCENT_PRESETS} disabled={!canEdit} />
          <ColorField label="Page background" value={b.colors.background} onChange={(v) => set('colors', 'background', v)} presets={NEUTRAL_PRESETS} disabled={!canEdit} />
          <ColorField label="Surface" hint="off-white sections" value={b.colors.surface} onChange={(v) => set('colors', 'surface', v)} presets={NEUTRAL_PRESETS} disabled={!canEdit} />
          <ColorField label="Surface alt" value={b.colors.surfaceAlt} onChange={(v) => set('colors', 'surfaceAlt', v)} presets={NEUTRAL_PRESETS} disabled={!canEdit} />
        </Grid>
        <div className="mt-5 mb-2 text-xs font-semibold text-[#1d2327] pb-1 border-b border-wp-border">Contextual</div>
        <Grid cols={3}>
          <ColorField label="Header bg" value={b.colors.header} onChange={(v) => set('colors', 'header', v)} disabled={!canEdit} />
          <ColorField label="Footer bg" value={b.colors.footer} onChange={(v) => set('colors', 'footer', v)} disabled={!canEdit} />
          <ColorField label="Button" value={b.colors.button} onChange={(v) => set('colors', 'button', v)} disabled={!canEdit} />
          <ColorField label="Button hover" value={b.colors.buttonHover} onChange={(v) => set('colors', 'buttonHover', v)} disabled={!canEdit} />
          <ColorField label="Link" value={b.colors.link} onChange={(v) => set('colors', 'link', v)} disabled={!canEdit} />
          <ColorField label="Link hover" value={b.colors.linkHover} onChange={(v) => set('colors', 'linkHover', v)} disabled={!canEdit} />
        </Grid>
        <div className="mt-5 mb-2 text-xs font-semibold text-[#1d2327] pb-1 border-b border-wp-border">Text & borders</div>
        <Grid cols={3}>
          <ColorField label="Text" value={b.colors.text} onChange={(v) => set('colors', 'text', v)} disabled={!canEdit} />
          <ColorField label="Body text" value={b.colors.textBody} onChange={(v) => set('colors', 'textBody', v)} disabled={!canEdit} />
          <ColorField label="Muted text" value={b.colors.muted} onChange={(v) => set('colors', 'muted', v)} disabled={!canEdit} />
          <ColorField label="Border" value={b.colors.border} onChange={(v) => set('colors', 'border', v)} disabled={!canEdit} />
          <ColorField label="Success" value={b.colors.success} onChange={(v) => set('colors', 'success', v)} disabled={!canEdit} />
          <ColorField label="Warning" value={b.colors.warning} onChange={(v) => set('colors', 'warning', v)} disabled={!canEdit} />
        </Grid>
      </Section>
      )}
      {showType && (
      <Section title="Typography" desc="Heading, body, navigation and button fonts. Custom sizes scale all headings proportionally.">
        <Grid>
          <Field label="Heading font">
            <Select value={b.typography.headingFont} onChange={(v) => set('typography', 'headingFont', v)} options={FONT_OPTIONS} disabled={!canEdit} />
          </Field>
          <Field label="Body font">
            <Select value={b.typography.bodyFont} onChange={(v) => set('typography', 'bodyFont', v)} options={FONT_OPTIONS} disabled={!canEdit} />
          </Field>
          <Field label="Navigation font">
            <Select value={b.typography.navFont} onChange={(v) => set('typography', 'navFont', v)} options={FONT_OPTIONS} disabled={!canEdit} />
          </Field>
          <Field label="Button font">
            <Select value={b.typography.buttonFont} onChange={(v) => set('typography', 'buttonFont', v)} options={FONT_OPTIONS} disabled={!canEdit} />
          </Field>
          <Slider label="Heading weight" value={b.typography.headingWeight} onChange={(v) => set('typography', 'headingWeight', v)} min={400} max={900} step={100} unit="" disabled={!canEdit} />
          <Slider label="Body weight" value={b.typography.bodyWeight} onChange={(v) => set('typography', 'bodyWeight', v)} min={300} max={700} step={100} unit="" disabled={!canEdit} />
          <Slider label="Heading scale" hint="multiplier" value={b.typography.headingSize} onChange={(v) => set('typography', 'headingSize', v)} min={0.75} max={1.5} step={0.05} unit="×" disabled={!canEdit} />
          <Slider label="Paragraph scale" hint="multiplier" value={b.typography.paragraphSize} onChange={(v) => set('typography', 'paragraphSize', v)} min={0.8} max={1.4} step={0.05} unit="×" disabled={!canEdit} />
          <Slider label="Letter spacing" value={b.typography.letterSpacing} onChange={(v) => set('typography', 'letterSpacing', v)} min={-1} max={3} step={0.1} unit="px" disabled={!canEdit} />
          <Slider label="Line height" value={b.typography.lineHeight} onChange={(v) => set('typography', 'lineHeight', v)} min={1.2} max={2} step={0.05} unit="" disabled={!canEdit} />
        </Grid>
      </Section>
      )}
    </div>
  );
}
