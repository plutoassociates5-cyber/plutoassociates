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
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-t-[3px] border-[#f54e31]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🎯</span> SEO — RankMath Style</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${score >= 80 ? 'bg-[#2db87f]' : score >= 50 ? 'bg-[#e67e22]' : 'bg-[#e74c3c]'}`}>
            {score}
          </div>
          <div className="">
            <h4 className="text-xs font-semibold text-[#1d2327]">{score >= 80 ? '🟢 Good' : score >= 50 ? '🟡 Needs Improvement' : '🔴 Poor'}</h4>
            <p className="text-[0.7rem] text-text-light">{score >= 80 ? 'Great SEO score!' : 'Add focus keyword to improve score.'}</p>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[0.7rem] font-semibold text-[#333] mb-1">Focus Keyword</label>
          <input
            type="text"
            className="w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none mb-3 focus:border-[#f54e31]"
            placeholder="e.g. company registration Nepal"
            value={kw}
            onChange={(e) => onKwChange(e.target.value)}
          />
        </div>

        <div className="border border-wp-border p-4 bg-gray-50 mb-3 rounded">
          <div className="text-[#1a0dab] text-sm font-normal mb-0.5 truncate">{seoTitle || 'Article Title | Pluto Associates Nepal'}</div>
          <div className="text-[#006621] text-[0.72rem] mb-1">plutoassociates.com/{slug || 'article-slug'}</div>
          <div className="text-[#545454] text-xs leading-relaxed">{seoDesc.substring(0, 155) || 'Article description...'}</div>
        </div>

        <div className="mb-3">
          <label className="block text-[0.7rem] font-semibold text-[#333] mb-1">SEO Title</label>
          <input type="text" value={seoTitle} readOnly placeholder="Article Title | Pluto Associates Nepal" className="w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none resize-y focus:border-[#f54e31]" />
          <div className={`text-[0.65rem] text-right mt-1 ${titleLen > 60 ? 'text-accent-orange' : titleLen > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {titleLen}/60 characters
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[0.7rem] font-semibold text-[#333] mb-1">Meta Description</label>
          <textarea rows="3" value={seoDesc.substring(0, 155)} readOnly placeholder="Describe this article..." className="w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none resize-y focus:border-[#f54e31]" />
          <div className={`text-[0.65rem] text-right mt-1 ${descLen > 155 ? 'text-accent-orange' : descLen > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
            {descLen}/155 characters
          </div>
        </div>
      </div>
    </div>
  );
}
