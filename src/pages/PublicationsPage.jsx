import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { WhatsAppPopup, BackToTop } from '../components/PublicUtils';
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
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
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
    <div className="public-page">
      <PublicNavbar />

      <section className="page-hero" style={{ backgroundImage: `url(${hero1})` }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <h1>Publications</h1>
          <p className="breadcrumb">
            <Link to="/">Home</Link> / Publications
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="section-label center reveal">Our Insights</div>
          <h2 className="section-title center" style={{ textAlign: 'center' }}>Legal Updates & Articles</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto 2rem' }}>
            Expert analysis on Nepal's evolving legal landscape
          </p>

          <div className="pub-filters reveal" style={{ justifyContent: 'center' }}>
            {categories.map((cat) => (
              <a
                key={cat}
                className={filter === cat ? 'active' : ''}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : getCategoryLabel(cat)}
              </a>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3>No Publications Yet</h3>
              <p>Articles published in the admin panel will appear here.</p>
            </div>
          ) : (
            <div className="pub-grid">
              {filtered.map((article) => (
                <div key={article.id} className="pub-card reveal" onClick={() => setSelected(article)}>
                  <div className="pub-cat">{getCategoryLabel(article.category)}</div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 120) : '')}...</p>
                  <div style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: '.75rem' }}>
                    {formatDate(article.date)} · {article.authorName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div className="article-overlay" onClick={() => setSelected(null)}>
          <div className="article-modal" onClick={(e) => e.stopPropagation()}>
            <button className="am-close" onClick={() => setSelected(null)}>✕</button>
            <div className="am-cat">{getCategoryLabel(selected.category)}</div>
            <h1>{selected.title}</h1>
            <div className="am-meta">
              By {selected.authorName} · {formatDate(selected.date)}
            </div>
            <div
              className="am-content"
              dangerouslySetInnerHTML={{ __html: selected.content || '' }}
            />
            {selected.tags && selected.tags.length > 0 && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--light-gray)' }}>
                {selected.tags.map((tag) => (
                  <span key={tag} className="tag-chip" style={{ display: 'inline-block', marginRight: '.35rem', marginBottom: '.35rem' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="section-padding cta-banner">
        <div className="container-wide">
          <h2 className="reveal">Stay Informed</h2>
          <p className="reveal">Get the latest legal insights delivered to your inbox.</p>
          <div className="cta-btns reveal">
            <Link to="/contact" className="btn-primary">Subscribe →</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
      <WhatsAppPopup />
      <BackToTop />
    </div>
  );
}