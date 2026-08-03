import { Section, Grid, Field, TextInput, TextArea } from './fields';

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/…' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/…' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/…' },
  { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@…' },
  { key: 'gbp', label: 'Google Business Profile', placeholder: 'https://maps.google.com/…' },
];

export default function BrandInfoTab({ d, set, setRoot, setSocial, canEdit, focus }) {
  const showContact = !focus || focus === 'contact';
  const showOffice = !focus || focus === 'office';
  const showSocial = !focus || focus === 'social';
  return (
    <div className="flex flex-col gap-5">
      {showContact && (
      <Section title="Contact information" desc="Drives the header contact bar, footer and contact page.">
        <Grid>
          <Field label="Display name">
            <TextInput value={d.name} onChange={(v) => setRoot('name', v)} disabled={!canEdit} />
          </Field>
          <Field label="Tagline">
            <TextInput value={d.tagline} onChange={(v) => setRoot('tagline', v)} disabled={!canEdit} />
          </Field>
          <Field label="Phone">
            <TextInput value={d.phone} onChange={(v) => setRoot('phone', v)} disabled={!canEdit} />
          </Field>
          <Field label="WhatsApp number" hint="digits only">
            <TextInput value={d.whatsapp} onChange={(v) => setRoot('whatsapp', v)} disabled={!canEdit} />
          </Field>
          <Field label="Email">
            <TextInput value={d.email} onChange={(v) => setRoot('email', v)} disabled={!canEdit} />
          </Field>
          <Field label="Short address line">
            <TextInput value={d.address} onChange={(v) => setRoot('address', v)} disabled={!canEdit} />
          </Field>
          <Field label="Weekday hours">
            <TextInput value={d.hours} onChange={(v) => setRoot('hours', v)} disabled={!canEdit} />
          </Field>
          <Field label="Saturday / weekend hours">
            <TextInput value={d.hoursSat} onChange={(v) => setRoot('hoursSat', v)} disabled={!canEdit} />
          </Field>
        </Grid>
      </Section>
      )}
      {showOffice && (
      <Section title="Office information" desc="Structured address used for schema markup, maps and the contact page.">
        <Grid>
          <Field label="Office name">
            <TextInput value={d.brand.office.officeName} onChange={(v) => set('office', 'officeName', v)} disabled={!canEdit} />
          </Field>
          <Field label="Street address">
            <TextInput value={d.brand.office.street} onChange={(v) => set('office', 'street', v)} disabled={!canEdit} />
          </Field>
          <Field label="City">
            <TextInput value={d.brand.office.city} onChange={(v) => set('office', 'city', v)} disabled={!canEdit} />
          </Field>
          <Field label="Province / state">
            <TextInput value={d.brand.office.province} onChange={(v) => set('office', 'province', v)} disabled={!canEdit} />
          </Field>
          <Field label="Postal code">
            <TextInput value={d.brand.office.postalCode} onChange={(v) => set('office', 'postalCode', v)} disabled={!canEdit} />
          </Field>
          <Field label="Country">
            <TextInput value={d.brand.office.country} onChange={(v) => set('office', 'country', v)} disabled={!canEdit} />
          </Field>
          <Field label="Maps link" hint="Google Maps share URL">
            <TextInput value={d.brand.office.mapsLink} onChange={(v) => set('office', 'mapsLink', v)} disabled={!canEdit} />
          </Field>
          <Field label="Latitude">
            <TextInput type="number" value={d.brand.office.latitude} onChange={(v) => set('office', 'latitude', Number(v) || 0)} disabled={!canEdit} />
          </Field>
          <Field label="Longitude">
            <TextInput type="number" value={d.brand.office.longitude} onChange={(v) => set('office', 'longitude', Number(v) || 0)} disabled={!canEdit} />
          </Field>
          <Field label="Holiday hours">
            <TextInput value={d.brand.office.holidayHours} onChange={(v) => set('office', 'holidayHours', v)} disabled={!canEdit} />
          </Field>
        </Grid>
        <div className="mt-4">
          <Field label="Office photos" hint="shown on contact page / Google listing">
            <div className="flex gap-2 flex-wrap">
              {(d.brand.office.officeImages || []).map((img, i) => (
                <span key={i} className="w-16 h-16 rounded border border-wp-border overflow-hidden relative">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {canEdit && (
                    <button
                      type="button"
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-accent-red text-white text-[0.6rem] leading-none cursor-pointer border-0"
                      onClick={() => set('office', 'officeImages', d.brand.office.officeImages.filter((_, j) => j !== i))}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              <label className="w-16 h-16 rounded border border-wp-border border-dashed text-text-light flex items-center justify-center text-[0.65rem] cursor-pointer hover:bg-wp-gray">
                +
                <input type="file" accept="image/*" hidden disabled={!canEdit} onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  e.target.value = '';
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => set('office', 'officeImages', [...(d.brand.office.officeImages || []), r.result]);
                  r.readAsDataURL(f);
                }} />
              </label>
            </div>
          </Field>
        </div>
      </Section>
      )}
      {showSocial && (
        <Section title="Social media profiles" desc="Links rendered in header, footer and contact page. Blank links are hidden.">
          <Grid>
            {SOCIAL_FIELDS.map((s) => (
              <Field key={s.key} label={s.label}>
                <TextInput value={d.social[s.key] || ''} placeholder={s.placeholder} onChange={(v) => setSocial(s.key, v)} disabled={!canEdit} />
              </Field>
            ))}
          </Grid>
        </Section>
      )}
      {showSocial && (
        <Section title="Map embed" desc="Google Maps iframe embed used on the contact page.">
          <Field label="Embed code / URL">
            <TextArea value={d.mapsEmbed} onChange={(v) => setRoot('mapsEmbed', v)} rows={3} disabled={!canEdit} />
          </Field>
        </Section>
      )}
    </div>
  );
}
