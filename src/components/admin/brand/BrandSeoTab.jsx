import { Section, Grid, Field, TextInput, TextArea, Toggle, AssetUpload, Segmented } from './fields';

export default function BrandSeoTab({ d, set, canEdit }) {
  const s = d.brand.seo;
  const title = s.metaTitle || s.title || d.name;
  const desc = s.metaDescription || s.description || d.footerAbout;
  return (
    <div className="flex flex-col gap-5">
      <Section title="Identity" desc="Structured organization details used in JSON-LD schema and search results.">
        <Grid>
          <Field label="Organization name">
            <TextInput value={s.orgName} onChange={(v) => set('seo', 'orgName', v)} placeholder={d.name} disabled={!canEdit} />
          </Field>
          <Field label="Legal name">
            <TextInput value={s.legalName} onChange={(v) => set('seo', 'legalName', v)} disabled={!canEdit} />
          </Field>
          <Field label="Canonical site URL">
            <TextInput value={s.canonicalUrl} onChange={(v) => set('seo', 'canonicalUrl', v)} disabled={!canEdit} />
          </Field>
          <Field label="Logo (schema.org)">
            <TextInput value={s.logoForSchema} onChange={(v) => set('seo', 'logoForSchema', v)} placeholder="https://…/logo.png" disabled={!canEdit} />
          </Field>
        </Grid>
      </Section>

      <Section title="Page metadata" desc="Site-wide title & description defaults. Leave blank to auto-generate from site settings.">
        <Grid>
          <Field label="Meta title template" hint="{page} is replaced per route">
            <TextInput value={s.metaTitle} onChange={(v) => set('seo', 'metaTitle', v)} placeholder={`${d.name} | {page}`} disabled={!canEdit} />
          </Field>
          <Field label="Meta description">
            <TextArea value={s.metaDescription} onChange={(v) => set('seo', 'metaDescription', v)} rows={3} disabled={!canEdit} />
          </Field>
          <Field label="Keywords">
            <TextInput value={s.keywords} onChange={(v) => set('seo', 'keywords', v)} placeholder="law firm, advocates, kathmandu…" disabled={!canEdit} />
          </Field>
          <Field label="Robots">
            <Segmented
              value={s.robots}
              onChange={(v) => set('seo', 'robots', v)}
              disabled={!canEdit}
              options={[
                { label: 'index, follow', value: 'index, follow' },
                { label: 'noindex, follow', value: 'noindex, follow' },
                { label: 'noindex, nofollow', value: 'noindex, nofollow' },
              ]}
            />
          </Field>
        </Grid>
      </Section>

      <Section title="Social sharing" desc="Open Graph & Twitter card controls.">
        <Grid>
          <Field label="Open Graph image" hint="1200×630 recommended">
            <AssetUpload value={s.ogImage || d.brand.assets.ogImage} onChange={(v) => set('seo', 'ogImage', v)} disabled={!canEdit} />
          </Field>
          <Field label="Twitter card type">
            <Segmented
              value={s.twitterCard}
              onChange={(v) => set('seo', 'twitterCard', v)}
              disabled={!canEdit}
              options={[
                { label: 'Summary', value: 'summary' },
                { label: 'Large image', value: 'summary_large_image' },
              ]}
            />
          </Field>
        </Grid>
      </Section>

      <Section title="Verification & analytics" desc="Optional tokens pasted in <head>.">
        <Grid>
          <Field label="Google Search Console">
            <TextInput value={s.googleVerification} onChange={(v) => set('seo', 'googleVerification', v)} placeholder="google-site-verification token" disabled={!canEdit} />
          </Field>
          <Field label="Bing Webmaster">
            <TextInput value={s.bingVerification} onChange={(v) => set('seo', 'bingVerification', v)} placeholder="msvalidate token" disabled={!canEdit} />
          </Field>
          <Field label="Google Analytics ID">
            <TextInput value={s.gaId} onChange={(v) => set('seo', 'gaId', v)} placeholder="G-XXXXXXX" disabled={!canEdit} />
          </Field>
          <Field label="Meta Pixel ID">
            <TextInput value={s.metaPixel} onChange={(v) => set('seo', 'metaPixel', v)} disabled={!canEdit} />
          </Field>
        </Grid>
        <div className="mt-4">
          <Toggle label="Generate JSON-LD schema" hint="Organization + legal service markup" checked={s.schema} onChange={(v) => set('seo', 'schema', v)} disabled={!canEdit} />
        </div>
      </Section>

      <Section title="Live preview" desc="How this metadata will appear in Google search results.">
        <div className="rounded-xl border border-wp-border bg-white p-4 max-w-lg">
          <div className="text-[0.7rem] text-[#4d5156] flex items-center gap-2 mb-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-accent-green inline-block" />
            <span className="truncate">{hostOf(s.canonicalUrl)}</span>
          </div>
          <div className="text-lg text-[#1a0dab] font-medium leading-snug mb-1">{title}</div>
          <div className="text-[0.8rem] text-[#4d5156] leading-snug line-clamp-2">{desc}</div>
        </div>
      </Section>
    </div>
  );
}

function hostOf(url) {
  try {
    return new URL(url || 'https://plutoassociates.com').hostname;
  } catch {
    return 'plutoassociates.com';
  }
}
