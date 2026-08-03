import { Section, Grid, AssetUpload, Field, TextInput } from './fields';

const ASSET_ROWS = [
  { key: 'logo', label: 'Primary logo', hint: 'Header (nav) — falls back to flat logo setting' },
  { key: 'logoDark', label: 'Header variant', hint: 'Shown when header background is light' },
  { key: 'logoLight', label: 'On-dark variant', hint: 'Shown on dark header / hero' },
  { key: 'logoSticky', label: 'Sticky header variant', hint: 'Shown when header collapses to sticky bar' },
  { key: 'logoFooter', label: 'Footer variant', hint: 'Shown in the site footer' },
  { key: 'logoPrint', label: 'Print variant', hint: 'Used on printed documents / invoices' },
  { key: 'logoEmail', label: 'Email variant', hint: 'Used in email footers / signatures' },
];

export default function BrandAssetsTab({ b, set, canEdit }) {
  return (
    <div className="flex flex-col gap-5">
      <Section
        title="Logo assets"
        desc="Provide the same brand mark in each context it appears. Any blank slot falls back to the primary logo."
      >
        <div className="flex flex-col gap-4">
          {ASSET_ROWS.map((r) => (
            <div key={r.key} className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-2 items-center border-b border-wp-border pb-3 last:border-0 last:pb-0">
              <Field label={r.label} hint={r.hint} />
              <AssetUpload value={b.assets[r.key]} onChange={(v) => set('assets', r.key, v)} disabled={!canEdit} aspect="logo" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Browser & share icons" desc="Favicon, mobile home-screen icon and Open Graph image used by social media previews.">
        <Grid>
          <Field label="Favicon" hint="browser tab · .ico/.png 32px">
            <AssetUpload value={b.assets.favicon} onChange={(v) => set('assets', 'favicon', v)} disabled={!canEdit} />
          </Field>
          <Field label="Apple touch icon" hint="iOS home screen · 180px">
            <AssetUpload value={b.assets.appleTouchIcon} onChange={(v) => set('assets', 'appleTouchIcon', v)} disabled={!canEdit} />
          </Field>
          <Field label="Android icon" hint="Android home screen">
            <AssetUpload value={b.assets.androidIcon} onChange={(v) => set('assets', 'androidIcon', v)} disabled={!canEdit} />
          </Field>
          <Field label="Open Graph image" hint="1200×630 social share">
            <AssetUpload value={b.assets.ogImage} onChange={(v) => set('assets', 'ogImage', v)} disabled={!canEdit} />
          </Field>
          <Field label="Twitter card image">
            <AssetUpload value={b.assets.twitterCardImage} onChange={(v) => set('assets', 'twitterCardImage', v)} disabled={!canEdit} />
          </Field>
          <Field label="Hero / cover image">
            <AssetUpload value={b.assets.heroImage} onChange={(v) => set('assets', 'heroImage', v)} disabled={!canEdit} />
          </Field>
          <Field label="Placeholder image">
            <AssetUpload value={b.assets.placeholderImage} onChange={(v) => set('assets', 'placeholderImage', v)} disabled={!canEdit} />
          </Field>
          <Field label="404 illustration">
            <AssetUpload value={b.assets.notFoundImage} onChange={(v) => set('assets', 'notFoundImage', v)} disabled={!canEdit} />
          </Field>
        </Grid>
      </Section>
    </div>
  );
}
