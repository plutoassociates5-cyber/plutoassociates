import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { getGuides } from '../content/propertyGuides';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function GuidesPage() {
  const guides = getGuides();
  const hero = guides[0]?.heroImage;

  return (
    <div>
      <PublicNavbar />

      <section className="bg-navy relative overflow-hidden py-16 lg:py-24">
        {hero && (
          <div className="absolute inset-0" style={{ backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.16 }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/70" />
        <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-[0.75rem] text-white/60 mb-6">
            <Link to="/" className="text-white/60 no-underline hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gold" aria-current="page">Guides</span>
          </nav>
          <div className="text-xs text-gold font-semibold uppercase tracking-[2px] mb-4">Practical Legal Guides</div>
          <h1 className="font-serif text-[clamp(2rem,4.8vw,3.3rem)] text-white leading-tight">Guides for Foreign Investors in Nepal</h1>
          <p className="mt-5 text-white/85 text-lg leading-relaxed max-w-[780px]">
            Direct answers to the questions foreign investors and property buyers ask us most often, written in plain language for readers outside Nepal.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide) => (
              <Link key={guide.slug} to={`/guides/${guide.slug}/`} className="group bg-white border border-light-gray p-7 lg:p-8 no-underline block transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gold">
                <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-3">{guide.category}</div>
                <h2 className="font-serif text-2xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors">{guide.h1}</h2>
                <p className="text-sm text-text-body leading-relaxed mb-5">{guide.description}</p>
                <div className="flex items-center justify-between text-xs text-text-light">
                  <span>Updated {formatDate(guide.lastUpdated)} · {guide.readingTime} min read</span>
                  <span className="text-gold font-semibold">Read guide →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 bg-off-white border border-light-gray rounded-2xl p-8 lg:p-10">
            <h2 className="font-serif text-2xl text-navy mb-3">Need an answer for your specific property?</h2>
            <p className="text-text-body leading-relaxed max-w-[760px] mb-6">
              These guides explain the general position. The right route depends on the property, its location and use, and your own status. We can review the documents and tell you what is possible before you commit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact/" className="inline-flex items-center gap-3 px-7 py-3 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold transition-colors duration-300 hover:bg-navy hover:text-gold no-underline">
                Get a property structuring consultation →
              </Link>
              <a href="tel:+977-9802356987" className="inline-flex items-center gap-3 px-7 py-3 bg-transparent text-navy font-sans text-sm font-semibold border-2 border-navy/20 transition-colors duration-300 hover:border-gold hover:text-gold no-underline">
                Call +977-9802356987
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4">Not sure which route applies?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto">
            Send us the property details and your objective. We will tell you what to check first.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/contact/" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Schedule a Consultation →</Link>
            <Link to="/practice-areas/realestate/" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 transition-all duration-300 hover:border-gold hover:text-gold no-underline">Real Estate Practice</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
