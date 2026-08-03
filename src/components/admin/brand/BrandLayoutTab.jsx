import { Section, Grid, Slider, Toggle, Segmented, Field, TextInput, TextArea } from './fields';

export default function BrandLayoutTab({ b, set, canEdit, focus }) {
  const h = b.header;
  const f = b.footer;
  const showHeader = !focus || focus === 'header';
  const showFooter = !focus || focus === 'footer';
  return (
    <div className="flex flex-col gap-5">
      {showHeader && (
      <Section title="Header" desc="Height, logo sizing, navigation behavior and optional announcement bar.">
        <Grid>
          <Slider label="Header height (desktop)" value={h.height} onChange={(v) => set('header', 'height', v)} min={60} max={160} disabled={!canEdit} />
          <Slider label="Sticky header height" value={h.stickyHeight} onChange={(v) => set('header', 'stickyHeight', v)} min={48} max={120} disabled={!canEdit} />
          <Slider label="Mobile header height" value={h.mobileHeight} onChange={(v) => set('header', 'mobileHeight', v)} min={52} max={120} disabled={!canEdit} />
          <Slider label="Logo size (header)" value={h.logoSize} onChange={(v) => set('header', 'logoSize', v)} min={40} max={140} disabled={!canEdit} />
          <Slider label="Logo size (sticky)" value={h.stickyLogoSize} onChange={(v) => set('header', 'stickyLogoSize', v)} min={36} max={110} disabled={!canEdit} />
          <Slider label="Nav link spacing" value={h.navSpacing} onChange={(v) => set('header', 'navSpacing', v)} min={12} max={64} disabled={!canEdit} />
        </Grid>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle label="Transparent over hero" checked={h.transparent} onChange={(v) => set('header', 'transparent', v)} disabled={!canEdit} />
          <Toggle label="Fixed / sticks to top" checked={h.fixed} onChange={(v) => set('header', 'fixed', v)} disabled={!canEdit} />
          <Toggle label="Collapse on scroll (sticky)" checked={h.sticky} onChange={(v) => set('header', 'sticky', v)} disabled={!canEdit} />
          <Toggle label="Show drop shadow" checked={h.shadow} onChange={(v) => set('header', 'shadow', v)} disabled={!canEdit} />
          <Toggle label="Show search icon" checked={h.searchVisible} onChange={(v) => set('header', 'searchVisible', v)} disabled={!canEdit} />
          <Toggle label="Show CTA button" checked={h.ctaVisible} onChange={(v) => set('header', 'ctaVisible', v)} disabled={!canEdit} />
        </div>
        <div className="mt-5 mb-2 text-xs font-semibold text-[#1d2327] pb-1 border-b border-wp-border">Announcement bar</div>
        <div className="flex flex-col gap-4">
          <Toggle label="Show announcement bar" hint="Thin bar above the header" checked={h.announcementBar} onChange={(v) => set('header', 'announcementBar', v)} disabled={!canEdit} />
          {h.announcementBar && (
            <Field label="Announcement text">
              <TextInput value={h.announcementText} onChange={(v) => set('header', 'announcementText', v)} placeholder="New office hours…" disabled={!canEdit} />
            </Field>
          )}
          <Toggle label="Show top contact bar" hint="Phone + email strip above header" checked={h.topContactBar} onChange={(v) => set('header', 'topContactBar', v)} disabled={!canEdit} />
        </div>
      </Section>
      )}
      {showFooter && (
      <Section title="Footer" desc="Footer columns, description and utility links.">
        <Grid>
          <Field label="Layout">
            <Segmented
              value={f.layout}
              onChange={(v) => set('footer', 'layout', v)}
              disabled={!canEdit}
              options={[
                { label: '4 columns', value: '4col' },
                { label: '3 columns', value: '3col' },
                { label: '2 columns', value: '2col' },
                { label: 'Centered', value: 'center' },
              ]}
            />
          </Field>
          <Field label="Footer description" hint="leave blank to reuse footer about text">
            <TextArea value={f.description} onChange={(v) => set('footer', 'description', v)} rows={3} disabled={!canEdit} />
          </Field>
          <Field label="Copyright" hint="leave blank to reuse site copyright; {year} auto-fills">
            <TextInput value={f.copyright} onChange={(v) => set('footer', 'copyright', v)} disabled={!canEdit} />
          </Field>
        </Grid>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle label="Quick links column" checked={f.quickLinks} onChange={(v) => set('footer', 'quickLinks', v)} disabled={!canEdit} />
          <Toggle label="Practice areas column" checked={f.practiceAreas} onChange={(v) => set('footer', 'practiceAreas', v)} disabled={!canEdit} />
          <Toggle label="Services column" checked={f.services} onChange={(v) => set('footer', 'services', v)} disabled={!canEdit} />
          <Toggle label="Show office hours" checked={f.hours} onChange={(v) => set('footer', 'hours', v)} disabled={!canEdit} />
          <Toggle label="Show map embed" checked={f.map} onChange={(v) => set('footer', 'map', v)} disabled={!canEdit} />
          <Toggle label="Newsletter signup" checked={f.newsletter} onChange={(v) => set('footer', 'newsletter', v)} disabled={!canEdit} />
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Privacy policy URL">
            <TextInput value={f.privacyPolicy} onChange={(v) => set('footer', 'privacyPolicy', v)} placeholder="/privacy" disabled={!canEdit} />
          </Field>
          <Field label="Terms URL">
            <TextInput value={f.terms} onChange={(v) => set('footer', 'terms', v)} placeholder="/terms" disabled={!canEdit} />
          </Field>
        </div>
      </Section>
      )}
    </div>
  );
}
