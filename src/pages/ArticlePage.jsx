import { Link, useParams } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { findArticleBySlug, getPublishedArticles } from '../seo';
import { readingTime } from '../utils/storage';

const CATEGORY_LABELS = {
  general: 'General', fdi: 'FDI & Investment', corporate: 'Corporate Law',
  labor: 'Labor & Employment', energy: 'Energy Law', tax: 'Taxation',
  ip: 'Intellectual Property', litigation: 'Litigation',
  family: 'Family Law', ngo: 'NGO / INGO', nrn: 'NRN & International',
  property: 'Property & Real Estate', criminal: 'Criminal Law',
};

function getCategoryLabel(cat) {
  return CATEGORY_LABELS[cat] || cat;
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = findArticleBySlug(slug);

  if (!article) {
    return (
      <div>
        <PublicNavbar />
        <section className="min-h-[60vh] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="font-serif text-3xl text-navy mb-3">Article not found</h1>
            <p className="text-text-body mb-6 max-w-md mx-auto">
              This publication may have been moved or is no longer available.
            </p>
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans text-sm font-semibold no-underline hover:bg-navy hover:text-gold transition-colors duration-300"
            >
              ← Back to Publications
            </Link>
          </div>
        </section>
        <PublicFooter />
        <WhatsAppPopup />
      </div>
    );
  }

  const published = getPublishedArticles();
  const sorted = published
    .slice()
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
  const index = sorted.findIndex((a) => a.id === article.id);
  const prevArticle = index > 0 ? sorted[index - 1] : null;
  const nextArticle = index !== -1 && index < sorted.length - 1 ? sorted[index + 1] : null;

  const related = published
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const relatedPool = related.length
    ? related
    : published.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div>
      <PublicNavbar />

      <section className="bg-navy relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="text-[0.75rem] text-white/60 mb-4">
            <Link to="/" className="text-white/60 no-underline hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/publications" className="text-white/60 no-underline hover:text-gold">Publications</Link>
            <span className="mx-2">/</span>
            <span className="text-gold" aria-current="page">{article.title}</span>
          </nav>
          <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-3">
            {getCategoryLabel(article.category)}
          </div>
          <h1 className="font-serif text-[clamp(1.8rem,4.5vw,3rem)] text-white leading-tight mb-5">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">
              {article.authorInitials || 'SN'}
            </span>
            <div className="text-sm">
              <div className="text-white/90 font-medium">{article.authorName}</div>
              <div className="text-white/50 text-xs">
                {formatDate(article.date)} · {readingTime(article.content)} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          {article.featuredImage && (
            <img
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-[260px] lg:h-[420px] object-cover mb-10"
              loading="lazy"
            />
          )}

          {article.excerpt && (
            <p className="font-serif text-xl text-navy leading-relaxed mb-8">{article.excerpt}</p>
          )}

          <div className="article-content text-text-body leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-light-gray">
              <span className="text-xs font-semibold uppercase tracking-[1px] text-text-light mr-3">Tags</span>
              {article.tags.map((tag) => (
                <span key={tag} className="inline-block text-xs text-text-body bg-off-white px-3 py-1 rounded-full mr-1.5 mb-1.5">{tag}</span>
              ))}
            </div>
          )}

          {(prevArticle || nextArticle) && (
            <div className="mt-12 pt-6 border-t border-light-gray grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                {prevArticle && (
                  <Link to={`/publications/${prevArticle.slug}`} className="group no-underline">
                    <div className="text-[0.72rem] text-text-light uppercase tracking-[1px] mb-1 group-hover:text-gold">← Previous Article</div>
                    <div className="font-serif text-navy text-base leading-snug group-hover:text-gold">{prevArticle.title}</div>
                  </Link>
                )}
              </div>
              <div className="sm:text-right">
                {nextArticle && (
                  <Link to={`/publications/${nextArticle.slug}`} className="group no-underline">
                    <div className="text-[0.72rem] text-text-light uppercase tracking-[1px] mb-1 group-hover:text-gold">Next Article →</div>
                    <div className="font-serif text-navy text-base leading-snug group-hover:text-gold">{nextArticle.title}</div>
                  </Link>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center gap-4 bg-off-white p-6">
            <span className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center text-lg font-bold shrink-0">
              {article.authorInitials || 'SN'}
            </span>
            <div>
              <div className="text-xs text-text-light uppercase tracking-[1px] mb-0.5">Written by</div>
              <div className="font-serif text-navy text-lg">{article.authorName}</div>
            </div>
          </div>
        </div>
      </section>

      {relatedPool.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4">Keep Reading</div>
            <h2 className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] text-navy leading-tight mb-8 font-semibold">Related Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPool.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/publications/${rel.slug}`}
                  className="bg-white border border-light-gray p-6 transition-all duration-400 hover:shadow-md hover:-translate-y-0.5 no-underline block"
                >
                  <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">{getCategoryLabel(rel.category)}</div>
                  <h3 className="font-serif text-lg text-navy mb-2 leading-snug">{rel.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">
                    {rel.excerpt || (rel.content ? rel.content.replace(/<[^>]*>/g, '').substring(0, 120) : '')}...
                  </p>
                  <div className="text-[0.72rem] text-text-light mt-3">
                    {formatDate(rel.date)} · {rel.authorName}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4">Need Legal Guidance?</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto">
            Our team provides practical legal advice tailored to your situation in Nepal.
          </p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">
              Request a Consultation →
            </Link>
            <Link to="/publications" className="inline-flex items-center gap-3 px-8 py-3.5 border-2 border-gold text-gold font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-gold hover:text-navy no-underline">
              All Publications
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
