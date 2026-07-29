import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup } from '../components/PublicUtils';
import { getArticles } from '../utils/storage';
import hero1 from '../assets/hero-1.jpeg';

export default function PublicationsPage() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setArticles(getArticles().filter((a) => a.status === 'published'));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-anim').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [articles]);

  const categories = useMemo(() => {
    const cats = [...new Set(articles.map((a) => a.category))];
    return ['all', ...cats];
  }, [articles]);

  const filtered = useMemo(() => {
    if (filter === 'all') return articles;
    return articles.filter((a) => a.category === filter);
  }, [articles, filter]);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      general: 'General', fdi: 'FDI & Investment', corporate: 'Corporate Law',
      labor: 'Labor & Employment', energy: 'Energy Law', tax: 'Taxation',
      ip: 'Intellectual Property', litigation: 'Litigation',
    };
    return labels[cat] || cat;
  };

  return (
    <div>
      <PublicNavbar />

      <section className="relative h-[50vh] min-h-[320px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-navy/88 to-navy/65" />
        <div className="relative z-10 pt-[70px]">
          <h1 className="font-serif text-[clamp(2.2rem,5vw,3.5rem)] text-white font-bold mb-3">Publications</h1>
          <p className="text-sm text-white/60">
            <Link to="/" className="text-white/60 hover:text-gold">Home</Link> / Publications
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-[0.75rem] font-semibold tracking-[3px] uppercase text-gold mb-4 text-center justify-center reveal-anim">Our Insights</div>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] text-navy leading-tight mb-5 font-semibold text-center">Legal Updates & Articles</h2>
          <p className="text-base text-text-light max-w-[600px] leading-relaxed mx-auto mb-8 text-center">
            Expert analysis on Nepal's evolving legal landscape
          </p>

          <div className="flex gap-2 flex-wrap justify-center mb-8 reveal-anim">
            {categories.map((cat) => (
              <a
                key={cat}
                className={`px-4 py-2 text-sm border border-light-gray cursor-pointer transition-all duration-200 hover:bg-gold hover:text-navy ${filter === cat ? 'bg-gold text-navy' : 'bg-white text-navy'}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : getCategoryLabel(cat)}
              </a>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 px-8">
              <h3 className="font-serif text-2xl text-navy mb-2">No Publications Yet</h3>
              <p className="text-text-body">Articles published in the admin panel will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => (
                <div key={article.id} className="bg-white border border-light-gray p-6 transition-all duration-400 cursor-pointer hover:shadow-md hover:-translate-y-0.5 reveal-anim" onClick={() => setSelected(article)}>
                  <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">{getCategoryLabel(article.category)}</div>
                  <h3 className="font-serif text-lg text-navy mb-2 leading-snug">{article.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 120) : '')}...</p>
                  <div className="text-[0.72rem] text-text-light mt-3">
                    {formatDate(article.date)} · {article.authorName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 lg:p-10 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-mid-gray border-none text-lg cursor-pointer hover:bg-gold transition-colors duration-200" onClick={() => setSelected(null)}>✕</button>
            <div className="text-xs text-gold font-semibold uppercase tracking-[1px] mb-2">{getCategoryLabel(selected.category)}</div>
            <h1 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] text-navy leading-tight mb-4">{selected.title}</h1>
            <div className="text-xs text-text-light mb-6">
              By {selected.authorName} · {formatDate(selected.date)}
            </div>
            <div
              className="text-sm text-text-body leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selected.content || '' }}
            />
            {selected.tags && selected.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-light-gray">
                {selected.tags.map((tag) => (
                  <span key={tag} className="inline-block text-xs text-text-body bg-off-white px-3 py-1 rounded-full mr-1.5 mb-1.5">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="py-20 lg:py-24 text-center relative overflow-hidden bg-gradient-to-br from-teal to-navy">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-white font-semibold mb-4 reveal-anim">Stay Informed</h2>
          <p className="text-white/70 text-base mb-8 max-w-2xl mx-auto reveal-anim">Get the latest legal insights delivered to your inbox.</p>
          <div className="flex justify-center gap-4 flex-wrap relative z-10 reveal-anim">
            <Link to="/contact" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Subscribe →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
    </div>
  );
}
