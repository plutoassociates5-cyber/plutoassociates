export default function SEOPanel({ title, slug, excerpt, content, tags, keywords: kw, onKwChange }) {
  const seoTitle = title ? `${title} | Pluto Associates Nepal` : '';
  const seoDesc = excerpt || (content ? content.replace(/<[^>]*>/g, '').substring(0, 155) : '');
  const titleLen = seoTitle.length;
  const descLen = seoDesc.length;

  let score = 0;
  const kword = (kw || '').toLowerCase().trim();
  const plainContent = (content || '').replace(/<[^>]*>/g, '');
  const lowerContent = plainContent.toLowerCase();
  const lowerTitle = (title || '').toLowerCase();
  const lowerExcerpt = (excerpt || '').toLowerCase();

  if (kword) {
    if (lowerTitle.includes(kword)) score += 15;
    if (lowerExcerpt.includes(kword)) score += 10;
    if (lowerContent.includes(kword)) score += 10;
    const occurrences = lowerContent.split(kword).length - 1;
    const density = (occurrences / (plainContent.split(' ').length || 1)) * 100;
    if (density >= 0.5 && density <= 2.5) score += 10;
  }
  if (plainContent.length > 500) score += 10;
  if (plainContent.length > 1500) score += 10;
  if (/<h2/i.test(content || '')) score += 10;
  if (/<h3/i.test(content || '')) score += 5;
  if (/<img/i.test(content || '')) score += 5;
  if (/<a\s/i.test(content || '')) score += 5;
  if ((excerpt || '').length > 50) score += 5;
  if ((tags || []).length > 0) score += 5;

  score = Math.min(100, score);

  return (
    <div className="side-panel seo-panel">
      <div className="side-panel-head">
        <h3><span className="ph-icon">🎯</span> SEO — RankMath Style</h3>
      </div>
      <div className="side-panel-body">
        <div className="seo-score-row">
          <div className={`seo-score-circle ${score >= 80 ? 'seo-score-good' : score >= 50 ? 'seo-score-ok' : 'seo-score-bad'}`}>
            {score}
          </div>
          <div className="seo-score-info">
            <h4>{score >= 80 ? '🟢 Good' : score >= 50 ? '🟡 Needs Improvement' : '🔴 Poor'}</h4>
            <p>{score >= 80 ? 'Great SEO score!' : 'Add focus keyword to improve score.'}</p>
          </div>
        </div>

        <div className="seo-field">
          <label>Focus Keyword</label>
          <input
            type="text"
            className="seo-focus-kw"
            placeholder="e.g. company registration Nepal"
            value={kw}
            onChange={(e) => onKwChange(e.target.value)}
          />
        </div>

        <div className="seo-preview-box">
          <div className="seo-preview-title">{seoTitle || 'Article Title | Pluto Associates Nepal'}</div>
          <div className="seo-preview-url">plutoassociates.com/{slug || 'article-slug'}</div>
          <div className="seo-preview-desc">{seoDesc.substring(0, 155) || 'Article description...'}</div>
        </div>

        <div className="seo-field">
          <label>SEO Title</label>
          <input type="text" value={seoTitle} readOnly placeholder="Article Title | Pluto Associates Nepal" />
          <div className={`char-count ${titleLen > 60 ? 'char-warn' : titleLen > 0 ? 'char-ok' : 'char-bad'}`}>
            {titleLen}/60 characters
          </div>
        </div>

        <div className="seo-field">
          <label>Meta Description</label>
          <textarea rows="3" value={seoDesc.substring(0, 155)} readOnly placeholder="Describe this article..." />
          <div className={`char-count ${descLen > 155 ? 'char-warn' : descLen > 0 ? 'char-ok' : 'char-bad'}`}>
            {descLen}/155 characters
          </div>
        </div>
      </div>
    </div>
  );
}