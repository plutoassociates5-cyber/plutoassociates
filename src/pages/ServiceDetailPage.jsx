import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import hero1 from '../assets/hero-1.jpeg';
import { getServiceBySlug, getPublishedServices, getServiceGroups } from '../services/store';
import { getPublishedArticles } from '../seo';
import { getGroupById } from '../services/taxonomy';

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

function groupLetter(id) {
  const idx = getServiceGroups().findIndex((g) => g.id === id);
  return idx >= 0 ? GROUP_LABELS[idx] : '';
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  const [open, setOpen] = useState({});

  const related = useMemo(() => {
    if (!service) return [];
    return getPublishedServices()
      .filter((s) => s.id !== service.id && s.group === service.group)
      .slice(0, 3);
  }, [service]);

  const articles = useMemo(() => {
    if (!service) return [];
    const keywords = [service.name, service.category].filter(Boolean).map((k) => k.toLowerCase());
    const hits = getPublishedArticles().filter((a) =>
      keywords.some((k) => `${a.title || ''} ${a.excerpt || ''} ${a.category || ''}`.toLowerCase().includes(k)),
    );
    return hits.slice(0, 3);
  }, [service]);

  if (!service) {
    return (
      <div>
        <PublicNavbar />
        <section className="min-h-[60vh] flex items-center justify-center bg-[#f6f7f8] pt-24">
          <div className="text-center px-4">
            <h1 className="font-serif text-navy text-3xl mb-3">Service not found</h1>
            <p className="text-text-body mb-6">The service you're looking for may have moved or been unpublished.</p>
            <Link to="/services" className="inline-flex px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline">← Back to Our Services</Link>
          </div>
        </section>
        <PublicFooter />
      </div>
    );
  }

  const group = getGroupById(service.group);
  const toggle = (i) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  const faqs = (service.faqs || []).filter((f) => f.q && f.a);

  return (
    <div>
      <PublicNavbar />

      <section className="relative bg-cover bg-center py-24 min-h-[360px] flex items-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 to-navy/70" />
        <div className="relative z-10 pt-[60px] px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto w-full">
          <nav className="text-[0.72rem] text-white/60 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gold no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/services" className="hover:text-gold no-underline">Our Services</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">{service.name}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[2px] uppercase text-gold px-3 py-1 border border-gold/30 rounded-full bg-gold/5">
              {group?.icon} {group?.name}
            </span>
            <span className="inline-flex items-center text-[0.7rem] font-semibold tracking-[2px] uppercase text-white/50 px-3 py-1 border border-white/15 rounded-full bg-white/5">
              Group {groupLetter(service.group)}
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] text-white font-bold mb-3">{service.name}</h1>
          <p className="text-white/80 max-w-2xl text-sm leading-relaxed">{service.shortDescription}</p>
          <div className="flex flex-wrap gap-4 mt-7">
            <a href="#consult" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300">
              {service.ctaLabel || 'Schedule Consultation'}
            </a>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">
              {service.contactLabel || 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-[#f6f7f8]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="min-w-0">
            {/* Overview */}
            <div className="bg-white border border-light-gray rounded-2xl p-7 sm:p-9 mb-8">
              <h2 className="font-serif text-navy text-xl mb-5 flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">📋</span>
                Overview
              </h2>
              <div className="prose prose-navy max-w-none text-text-body text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: service.content }} />
              {(service.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-light-gray">
                  {(service.tags || []).slice(0, 6).map((t) => (
                    <span key={t} className="text-xs text-navy bg-navy/5 border border-navy/10 px-3 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Why Pluto */}
            {(service.why || []).length > 0 && (
              <div className="bg-navy text-white rounded-2xl p-7 sm:p-9 mb-8">
                <h2 className="font-serif text-white text-xl mb-5 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center text-base shrink-0">🌟</span>
                  Why Pluto for this service
                </h2>
                <ul className="grid sm:grid-cols-2 gap-4 list-none m-0 p-0">
                  {(service.why || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                      <span className="w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Process */}
            {(service.process || []).length > 0 && (
              <div className="bg-white border border-light-gray rounded-2xl p-7 sm:p-9 mb-8">
                <h2 className="font-serif text-navy text-xl mb-6 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">🛠️</span>
                  How we work
                </h2>
                <ol className="grid gap-4 sm:grid-cols-2 list-none m-0 p-0">
                  {(service.process || []).map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-body leading-relaxed">
                      <span className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Documents */}
            {service.documents && (
              <div className="bg-white border border-light-gray rounded-2xl p-7 sm:p-9 mb-8">
                <h2 className="font-serif text-navy text-xl mb-4 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">📄</span>
                  Documents & information
                </h2>
                <p className="text-sm text-text-body leading-relaxed">{service.documents}</p>
              </div>
            )}

            {/* Timeline */}
            {(service.timeline || []).length > 0 && (
              <div className="bg-white border border-light-gray rounded-2xl p-7 sm:p-9 mb-8">
                <h2 className="font-serif text-navy text-xl mb-5 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">⏱️</span>
                  Typical timeline
                </h2>
                <div className="flex flex-col gap-4">
                  {(service.timeline || []).map((t, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <div>
                        {t.duration && <span className="text-gold font-semibold text-xs uppercase tracking-wide">{t.duration}</span>}
                        <p className="text-text-body">{t.step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="bg-white border border-light-gray rounded-2xl p-7 sm:p-9 mb-8">
                <h2 className="font-serif text-navy text-xl mb-5 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-base shrink-0">💬</span>
                  Common questions
                </h2>
                <div className="flex flex-col gap-3">
                  {faqs.map((f, i) => {
                    const isOpen = !!open[i];
                    return (
                      <div key={i} className="border border-light-gray rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggle(i)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 bg-transparent border-none cursor-pointer group"
                        >
                          <span className="font-serif text-navy text-sm leading-snug group-hover:text-gold">{f.q}</span>
                          <span className={`w-7 h-7 rounded-full bg-gold/10 text-gold flex items-center justify-center text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                        </button>
                        <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                          <div className="overflow-hidden">
                            <div className="px-5 pb-5">
                              <p className="text-text-body text-sm leading-relaxed border-t border-light-gray pt-4">{f.a}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related services */}
            {related.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-navy text-xl mb-5">Related {group?.name || 'services'}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {related.map((s) => (
                    <Link key={s.id} to={'/services/' + s.slug} className="group bg-white border border-light-gray rounded-xl p-5 no-underline transition-all duration-300 hover:border-gold hover:shadow-lg hover:shadow-navy/5">
                      <span className="text-lg leading-none">{s.icon}</span>
                      <h3 className="font-serif text-navy text-sm mt-3 mb-1.5 leading-snug group-hover:text-gold transition-colors">{s.name}</h3>
                      <span className="text-xs text-gold">View →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related publications */}
            {articles.length > 0 && (
              <div>
                <h2 className="font-serif text-navy text-xl mb-5">Related insights</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {articles.map((a) => (
                    <Link key={a.slug} to={'/publications/' + a.slug} className="group bg-white border border-light-gray rounded-xl p-5 no-underline transition-all duration-300 hover:border-gold hover:shadow-lg hover:shadow-navy/5">
                      <span className="text-[0.65rem] uppercase tracking-wider text-text-light">{a.category || 'Insight'}</span>
                      <h3 className="font-serif text-navy text-sm mt-2 mb-1.5 leading-snug group-hover:text-gold transition-colors">{a.title}</h3>
                      <span className="text-xs text-gold">Read →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 h-fit flex flex-col gap-6">
            <div id="consult" className="bg-navy text-white rounded-2xl p-6 scroll-mt-28">
              <h3 className="font-serif text-lg mb-3">Start this service</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Share a few details and our team will get back to you within one working day.
              </p>
              <Link to="/contact" className="block text-center px-5 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-white transition-colors duration-300 mb-3">
                Request Consultation
              </Link>
              <a href="tel:+977-9802356987" className="block text-center px-5 py-3 bg-transparent text-white font-sans text-sm font-semibold border border-white/30 no-underline hover:border-gold hover:text-gold transition-colors duration-300">
                Call +977-9802356987
              </a>
              <p className="text-white/50 text-xs mt-4 text-center">Consultations available in English & Nepali</p>
            </div>

            <div className="bg-white border border-light-gray rounded-2xl p-6">
              <h3 className="font-serif text-navy text-base mb-4">Other practice groups</h3>
              <div className="flex flex-col gap-1">
                {getServiceGroups().map((g) => (
                  <Link
                    key={g.id}
                    to={'/services#group-' + g.id}
                    className="flex items-center gap-2.5 text-sm text-text-body no-underline hover:text-gold py-2 border-b border-light-gray last:border-b-0 transition-colors"
                  >
                    <span className="text-base">{g.icon}</span>
                    <span className="flex-1">{g.name}</span>
                    <span className="text-xs text-text-light">{g.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
