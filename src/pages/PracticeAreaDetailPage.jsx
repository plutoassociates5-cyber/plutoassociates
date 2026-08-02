import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { getPracticeAreas } from '../utils/contentStore';
import { getFaqs } from '../utils/contentStore';
import { getPublishedArticles } from '../seo';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PracticeAreaDetailPage() {
  const { slug } = useParams();
  const AREAS = getPracticeAreas();
  const area = AREAS.find((a) => a.id === slug);
  const index = AREAS.findIndex((a) => a.id === slug);
  const prev = index > 0 ? AREAS[index - 1] : null;
  const next = index !== -1 && index < AREAS.length - 1 ? AREAS[index + 1] : null;
  const others = AREAS.filter((a) => a.id !== slug).slice(0, 3);
  const areaFaqs = getFaqs().filter((f) => f.area === slug);
  const related = getPublishedArticles()
    .filter((a) => a.status === 'published' && a.category === area?.id)
    .slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-anim, .reveal-left-anim, .reveal-right-anim').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [area]);

  if (!area) {
    return (
      <div>
        <PublicNavbar />
        <section className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-3xl text-navy mb-3">Practice area not found</h1>
            <p className="text-text-body mb-6 max-w-md mx-auto">This practice area may have been moved or renamed.</p>
            <Link to="/practice-areas" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-navy hover:text-gold transition-colors duration-300">
              ← Back to All Practice Areas
            </Link>
          </div>
        </section>
        <PublicFooter />
        <WhatsAppPopup />
      </div>
    );
  }

  const heading = area.heading || area.title;

  return (
    <div>
      <PublicNavbar />

      <section className="bg-navy relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${area.img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.16 }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/70" />
        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-[0.75rem] text-white/60 mb-6">
            <Link to="/" className="text-white/60 no-underline hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/practice-areas" className="text-white/60 no-underline hover:text-gold">Practice Areas</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">{area.title}</span>
          </nav>
          <div className="flex items-center gap-4 mb-5">
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gold text-navy text-2xl shadow-md shrink-0">{area.icon}</span>
            <span className="text-xs text-gold font-semibold uppercase tracking-[2px]">Practice Area {String(index + 1).padStart(2, '0')}</span>
          </div>
          <h1 className="font-serif text-[clamp(1.9rem,4.5vw,3.2rem)] text-white leading-tight">{heading}</h1>
          <p className="mt-5 text-white/85 text-lg leading-relaxed max-w-[780px]">{area.desc}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 reveal-left-anim">
            <div className="rounded-2xl overflow-hidden shadow-sm mb-8">
              <img src={area.img} alt={area.heading || area.title} title={area.title} className="w-full h-[280px] lg:h-[400px] object-cover" />
            </div>

            {area.intro && area.intro.length > 0 && (
              <div className="space-y-6">
                {area.intro.map((p, i) => (
                  <p key={i} className="text-text-body leading-relaxed text-lg">{p}</p>
                ))}
              </div>
            )}

            {area.quote && (
              <blockquote className="my-9 pl-6 border-l-4 border-gold bg-gold/5 p-6 rounded-r-xl">
                <p className="font-serif text-xl text-navy italic leading-relaxed">“{area.quote}”</p>
              </blockquote>
            )}

            {area.services && area.services.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl text-navy mb-5">{area.servicesHeading || 'Our Services'}</h2>
                <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {area.services.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[0.95rem] text-text-body bg-white border border-light-gray rounded-lg p-3.5">
                      <span className="w-4 h-4 mt-0.5 rounded-full bg-gold/15 text-gold text-[0.6rem] font-bold flex items-center justify-center shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {area.sectors && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl text-navy mb-4">{area.sectorsHeading || 'Sectors We Cover'}</h2>
                <p className="text-text-body leading-relaxed">{area.sectors}</p>
              </div>
            )}

            {area.why && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl text-navy mb-4">{area.whyHeading || 'Why Choose Pluto Associates?'}</h2>
                <p className="text-text-body leading-relaxed">{area.why}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6 reveal-right-anim">
            <div className="bg-navy text-white rounded-2xl p-7">
              <h3 className="font-serif text-lg mb-3">Get Advice on This</h3>
              <p className="text-sm text-white/75 leading-relaxed mb-5">Tell us about your {area.title.toLowerCase()} matter and we will get back to you with clear, practical advice.</p>
              <Link to="/contact" className="block text-center px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300 mb-3">
                Schedule a Consultation →
              </Link>
              <a href="tel:+977-9802356987" className="block text-center px-6 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">
                Call Us Now
              </a>
            </div>

            {others.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-light-gray">
                <h3 className="font-serif text-base text-navy mb-4">More practice areas</h3>
                <ul className="list-none p-0 m-0 flex flex-col gap-1">
                  {others.map((o) => (
                    <li key={o.id}>
                      <Link to={`/practice-areas/${o.id}`} className="flex items-center gap-3 px-2 py-2 rounded-lg no-underline hover:bg-gold/10 transition-colors">
                        <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">{o.icon}</span>
                        <span className="text-sm text-navy">{o.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="py-14 border-t border-gray bg-off-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-navy mb-2">Related Publications</h2>
          <p className="text-text-body mb-7">Articles and guides related to this practice area from our team.</p>
          {related.length === 0 ? (
            <p className="text-text-light">No publications yet in this area.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <Link key={a.slug} to={`/publications/${a.slug}`} className="group bg-white border border-gray p-6 no-underline block hover:shadow-md transition-shadow">
                  <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">{a.category}</div>
                  <h3 className="font-serif text-navy text-base leading-snug mb-2 group-hover:text-gold">{a.title}</h3>
                  {a.date && <div className="text-xs text-text-light">{formatDate(a.date)}</div>}
                </Link>
              ))}
            </div>
          )}
          <Link to="/publications" className="inline-flex items-center gap-2 text-sm font-semibold text-navy no-underline border-b-2 border-gold hover:gap-3 transition-all mt-6">View All Publications →</Link>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-navy mb-2">FAQs — {area.title}</h2>
          <p className="text-text-body mb-7">Common questions our clients ask about this practice area.</p>
          {areaFaqs.length === 0 ? (
            <div className="flex items-center justify-between flex-wrap gap-4 bg-off-white border border-light-gray rounded-xl p-6">
              <p className="text-text-light">No FAQs published for this area yet.</p>
              <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-gold no-underline border-b-2 border-gold hover:gap-3 transition-all">See all FAQs →</Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {areaFaqs.map((f) => (
                  <details key={f.id} className="group border border-light-gray rounded-xl overflow-hidden bg-[#fbfbfc]">
                    <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 py-4 font-serif text-navy text-base leading-snug">
                      <span>{f.question}</span>
                      <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-base shrink-0">+</span>
                    </summary>
                    <div className="px-5 pb-5 text-text-body leading-relaxed border-t border-light-gray pt-4">{f.answer}</div>
                  </details>
                ))}
              </div>
              <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-gold no-underline border-b-2 border-gold hover:gap-3 transition-all mt-6">See all FAQs →</Link>
            </>
          )}
        </div>
      </section>

      {(prev || next) && (
        <section className="py-8 border-t border-gray">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              {prev && (
                <Link to={`/practice-areas/${prev.id}`} className="group no-underline">
                  <div className="text-[0.72rem] text-text-light uppercase tracking-[1px] mb-1 group-hover:text-gold">← Previous</div>
                  <div className="font-serif text-navy group-hover:text-gold">{prev.title}</div>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {next && (
                <Link to={`/practice-areas/${next.id}`} className="group no-underline">
                  <div className="text-[0.72rem] text-text-light uppercase tracking-[1px] mb-1 group-hover:text-gold">Next →</div>
                  <div className="font-serif text-navy group-hover:text-gold">{next.title}</div>
                </Link>
              )}
            </div>
          </div>
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6">
            <Link to="/practice-areas" className="inline-flex items-center gap-2 text-sm font-semibold text-navy no-underline border-b-2 border-gold hover:gap-3 transition-all">← Back to All Practice Areas</Link>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Need Legal Assistance?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Our experienced team is ready to help you with {heading}.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Schedule a Consultation →</Link>
            <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">Call Us</a>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}