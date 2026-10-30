import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { GUIDE_DISCLAIMER, getGuideBySlug, getGuides } from '../content/propertyGuides';
import { getPracticeAreas } from '../utils/contentStore';
import { getPublishedArticles } from '../seo';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function plainText(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function GuidePage() {
  const { slug } = useParams();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div>
        <PublicNavbar />
        <section className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-3xl text-navy mb-3">Guide not found</h1>
            <p className="text-text-body mb-6 max-w-md mx-auto">This guide may have been moved or renamed.</p>
            <Link to="/guides/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-navy hover:text-gold transition-colors duration-300">
              ← Back to All Guides
            </Link>
          </div>
        </section>
        <PublicFooter />
        <WhatsAppPopup />
      </div>
    );
  }

  const otherGuides = getGuides().filter((g) => g.slug !== guide.slug);
  const areas = getPracticeAreas().filter((a) => guide.practiceAreas.includes(a.id));
  const relatedArticles = getPublishedArticles()
    .filter((a) => guide.relatedCategories.includes(a.category))
    .slice(0, 3);

  return (
    <div>
      <PublicNavbar />

      <section className="bg-navy relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${guide.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.16 }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/70" />
        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-[0.75rem] text-white/60 mb-6">
            <Link to="/" className="text-white/60 no-underline hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/guides/" className="text-white/60 no-underline hover:text-gold">Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-gold" aria-current="page">{guide.h1}</span>
          </nav>
          <div className="text-xs text-gold font-semibold uppercase tracking-[2px] mb-4">{guide.category}</div>
          <h1 className="font-serif text-[clamp(1.9rem,4.6vw,3.2rem)] text-white leading-tight">{guide.h1}</h1>
          <p className="mt-5 text-white/85 text-lg leading-relaxed max-w-[820px]">{guide.quickAnswer}</p>
          <div className="mt-6 flex items-center gap-3 text-white/50 text-xs">
            <span>Updated {formatDate(guide.lastUpdated)}</span>
            <span>·</span>
            <span>{guide.readingTime} min read</span>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            {guide.keyPoints && guide.keyPoints.length > 0 && (
              <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 mb-10">
                <h2 className="font-serif text-xl text-navy mb-4">Key points</h2>
                <ul className="list-none p-0 m-0 space-y-2.5">
                  {guide.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[0.95rem] text-text-body">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-gold text-navy text-[0.6rem] font-bold flex items-center justify-center shrink-0">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {guide.sections.map((section) => (
              <div key={section.id} id={section.id} className="mb-10">
                <h2 className="font-serif text-2xl text-navy mb-4">{section.heading}</h2>
                <div className="article-content text-text-body leading-relaxed" dangerouslySetInnerHTML={{ __html: section.html }} />
              </div>
            ))}

            <div className="mt-12 pt-6 border-t border-light-gray text-sm text-text-light leading-relaxed">
              {GUIDE_DISCLAIMER}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="bg-navy text-white rounded-2xl p-7 lg:sticky lg:top-24">
              <h2 className="font-serif text-lg mb-3">Talk to a property lawyer</h2>
              <p className="text-sm text-white/75 leading-relaxed mb-5">
                Tell us about the property and your plans. We will confirm the routes, the checks and the next step.
              </p>
              <Link to="/contact/" className="block text-center px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300 mb-3">
                {guide.ctaLabel} →
              </Link>
              <a href="tel:+977-9802356987" className="block text-center px-6 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">
                Call +977-9802356987
              </a>
            </div>

            {areas.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-light-gray">
                <h3 className="font-serif text-base text-navy mb-4">Related practice areas</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-1">
                  {areas.map((area) => (
                    <li key={area.id}>
                      <Link to={`/practice-areas/${area.id}/`} className="flex items-center gap-3 px-2 py-2 rounded-lg no-underline hover:bg-gold/10 transition-colors">
                        <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">{area.icon}</span>
                        <span className="text-sm text-navy">{area.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {otherGuides.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-light-gray">
                <h3 className="font-serif text-base text-navy mb-4">More guides</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-3">
                  {otherGuides.map((g) => (
                    <li key={g.slug}>
                      <Link to={`/guides/${g.slug}/`} className="text-sm text-navy no-underline hover:text-gold transition-colors">
                        {g.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-off-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-3">How We Work</div>
          <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.5rem)] text-navy leading-tight mb-8 font-semibold">From eligibility check to registration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {guide.process.map((step) => (
              <div key={step.step} className="bg-white border border-light-gray p-5">
                <span className="font-serif text-3xl text-gold/40 font-bold block mb-2">{step.step}</span>
                <h3 className="font-serif text-base text-navy mb-2">{step.title}</h3>
                <p className="text-sm text-text-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Documents we usually need</h2>
            <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guide.documents.map((doc) => (
                <li key={doc} className="flex items-start gap-2.5 text-sm text-text-body bg-white border border-light-gray rounded-lg p-3">
                  <span className="w-4 h-4 mt-0.5 rounded-full bg-gold/15 text-gold text-[0.6rem] font-bold flex items-center justify-center shrink-0">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-navy mb-4">Typical timeline</h2>
            <div className="border border-light-gray rounded-xl overflow-hidden">
              {guide.timeline.map((row, i) => (
                <div key={row.phase} className={`flex items-start justify-between gap-4 px-4 py-3 ${i % 2 ? 'bg-off-white' : 'bg-white'}`}>
                  <span className="text-sm text-text-body">{row.phase}</span>
                  <span className="text-sm font-semibold text-navy text-right shrink-0">{row.duration}</span>
                </div>
              ))}
            </div>

            <h2 className="font-serif text-2xl text-navy mt-8 mb-4">Fees and costs</h2>
            <div className="space-y-3">
              {guide.fees.map((fee) => (
                <div key={fee.item} className="bg-white border border-light-gray rounded-xl p-4">
                  <div className="text-sm font-semibold text-navy mb-1">{fee.item}</div>
                  <p className="text-sm text-text-body leading-relaxed">{fee.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-off-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-navy mb-2">Common mistakes to avoid</h2>
          <p className="text-text-body mb-6">These are the issues we see most often in foreign property transactions.</p>
          <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.mistakes.map((mistake) => (
              <li key={mistake} className="flex items-start gap-3 bg-white border-l-4 border-gold p-4 text-sm text-text-body leading-relaxed">
                <span className="text-gold font-bold shrink-0">!</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 lg:py-16 bg-white" id="faqs">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-navy mb-2">Frequently asked questions</h2>
          <p className="text-text-body mb-7">Short answers to the questions buyers ask most often.</p>
          <div className="flex flex-col gap-3">
            {guide.faqs.map((faq) => (
              <details key={faq.q} className="group border border-light-gray rounded-xl overflow-hidden bg-[#fbfbfc]">
                <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 py-4 font-serif text-navy text-base leading-snug">
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-base shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5 text-text-body leading-relaxed border-t border-light-gray pt-4">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-off-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-3">Keep Reading</div>
              <h2 className="font-serif text-[clamp(1.8rem,3.4vw,2.5rem)] text-navy leading-tight font-semibold">Related reading</h2>
            </div>
            <Link to="/guides/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy no-underline border-b-2 border-gold hover:gap-3 transition-all self-start md:self-auto">All Guides →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGuides.map((g) => (
              <Link key={g.slug} to={`/guides/${g.slug}/`} className="bg-white border border-light-gray p-6 no-underline block hover:shadow-md transition-shadow">
                <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">{g.category}</div>
                <h3 className="font-serif text-lg text-navy mb-2 leading-snug">{g.h1}</h3>
                <p className="text-sm text-text-body leading-relaxed">{g.description}</p>
              </Link>
            ))}
            {relatedArticles.map((a) => (
              <Link key={a.id} to={`/publications/${a.slug}/`} className="bg-white border border-light-gray p-6 no-underline block hover:shadow-md transition-shadow">
                <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">Publication</div>
                <h3 className="font-serif text-lg text-navy mb-2 leading-snug">{a.title}</h3>
                <p className="text-sm text-text-body leading-relaxed">{plainText(a.excerpt || a.content).substring(0, 140)}…</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4">{guide.ctaLabel}</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto">
            Send us the property details and your objective. We will tell you which routes are available and what to check first.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/contact/" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Schedule a Consultation →</Link>
            <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">Call Us</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
