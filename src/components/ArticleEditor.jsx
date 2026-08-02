import { useState, useRef, useEffect, useCallback } from 'react';
import { getArticles, saveArticles, uid, slugify, uniqueSlug } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import EditorToolbar from './EditorToolbar';
import PublishPanel from './PublishPanel';
import SEOPanel from './SEOPanel';
import CategoryPanel from './CategoryPanel';
import TagsPanel from './TagsPanel';
import FeaturedImagePanel from './FeaturedImagePanel';

export default function ArticleEditor({ editId, onNavigate }) {
  const { toast } = useToast();
  const contentRef = useRef(null);
  const sourceRef = useRef(null);

  const existing = editId ? getArticles().find((a) => a.id === editId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [manualSlug, setManualSlug] = useState(false);
  const [content, setContent] = useState(existing?.content || '');
  const [excerpt, setExcerpt] = useState(existing?.excerpt || '');
  const [category, setCategory] = useState(existing?.category || 'general');
  const [authorVal, setAuthorVal] = useState(
    existing ? `${existing.authorInitials || 'SN'}|${existing.authorName || 'Adv. Sudeep Nepal'}` : 'SN|Adv. Sudeep Nepal'
  );
  const [date, setDate] = useState(existing?.date || new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState(existing?.tags || []);
  const [featImage, setFeatImage] = useState(existing?.featuredImage || null);
  const [featImageAlt, setFeatImageAlt] = useState(existing?.featuredImageAlt || '');
  const [keywords, setKeywords] = useState(existing?.metaKeywords || '');
  const [seoTitle, setSeoTitle] = useState(existing?.seoTitle || '');
  const [seoDesc, setSeoDesc] = useState(existing?.seoDesc || '');
  const [canonical, setCanonical] = useState(existing?.canonical || '');
  const [sourceMode, setSourceMode] = useState(false);
  const [visualTab, setVisualTab] = useState(true);

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (!existing) {
      contentRef.current.innerHTML = '<p>Write your article content here...</p>';
    }
  }, []);

  const updateCounts = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const text = el.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  }, []);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!manualSlug) {
      setSlug(slugify(val));
    }
  };

  const execCmd = (cmd, val) => {
    if (cmd === 'formatBlock' && val && val.charAt(0) !== '<') val = '<' + val + '>';
    document.execCommand(cmd, false, val || null);
    contentRef.current?.focus();
    updateCounts();
    setContent(contentRef.current?.innerHTML || '');
  };

  const handleContentInput = () => {
    const html = contentRef.current?.innerHTML || '';
    setContent(html);
    updateCounts();
  };

  const toggleSource = () => {
    setSourceMode(!sourceMode);
    if (!sourceMode) {
      if (sourceRef.current) sourceRef.current.value = contentRef.current?.innerHTML || '';
    } else {
      if (contentRef.current) contentRef.current.innerHTML = sourceRef.current?.value || '';
    }
  };

  const switchTab = (mode) => {
    if (mode === 'source') {
      if (sourceRef.current) sourceRef.current.value = contentRef.current?.innerHTML || '';
      setVisualTab(false);
    } else {
      if (contentRef.current) contentRef.current.innerHTML = sourceRef.current?.value || '';
      setVisualTab(true);
    }
  };

  const save = (action) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle && action !== 'preview') {
      toast('Please enter an article title.', 'err');
      return;
    }

    const contentHtml = contentRef.current?.innerHTML || '';
    const sourceHtml = sourceRef.current?.value || '';
    const finalContent = !sourceMode ? contentHtml : sourceHtml;
    const authorParts = authorVal.split('|');
    const now = new Date().toISOString();
    const status = action === 'draft' ? 'draft' : action === 'preview' ? 'draft' : 'published';

    let articles = getArticles();
    let finalSlug = (slug || '').trim() ? slug.trim() : slugify(trimmedTitle);
    const slugCollides = articles.some((a) => a.id !== editId && a.slug === finalSlug);
    if (slugCollides) finalSlug = uniqueSlug(finalSlug, articles, editId);
    const art = {
      title: trimmedTitle,
      slug: finalSlug,
      excerpt: excerpt,
      content: finalContent,
      category: category,
      authorInitials: authorParts[0] || 'SN',
      authorName: authorParts[1] || 'Adv. Sudeep Nepal',
      date: date,
      status: status,
      tags: tags.slice(),
      featuredImage: featImage,
      featuredImageAlt: featImageAlt.trim(),
      seoTitle: seoTitle.trim(),
      seoDesc: seoDesc.trim(),
      metaKeywords: keywords,
      canonical: canonical.trim(),
      modifiedAt: now,
    };

    if (editId) {
      const idx = articles.findIndex((a) => a.id === editId);
      if (idx !== -1) {
        art.id = editId;
        art.createdAt = articles[idx].createdAt || now;
        articles[idx] = art;
      }
    } else {
      art.id = uid();
      art.createdAt = now;
      articles.push(art);
    }

    saveArticles(articles);

    if (action === 'preview') {
      toast('Draft saved. Opening preview...', 'info');
    } else {
      toast(action === 'draft' ? '✓ Draft saved!' : '✓ Article published!');
      onNavigate('all');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">{existing ? 'Edit Article' : 'Add New Article'}</h1>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            className="bg-white text-[#333] border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans rounded"
            onClick={() => save('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <label className="block text-[0.7rem] font-semibold text-[#555] mb-1.5 uppercase tracking-[0.5px]">Article Title</label>
            <input
              type="text"
              className="w-full font-serif text-xl lg:text-2xl font-semibold border-b-2 border-light-gray px-0 py-2 text-[#1d2327] outline-none bg-transparent focus:border-wp-blue placeholder:text-[#ccc] placeholder:font-normal"
              placeholder="Enter article title here..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <div className="mt-2 text-[0.72rem] text-text-light flex items-center gap-1.5 flex-wrap">
              <strong>Permalink:</strong>
              <span>https://plutoassociates.com/</span>
              <input
                className="border border-wp-border px-1.5 py-0.5 text-[0.72rem] outline-none min-w-[150px] focus:border-wp-blue"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setManualSlug(true); }}
              />
              <button className="bg-wp-gray border border-wp-border px-2.5 py-0.5 text-[0.7rem] cursor-pointer font-sans" onClick={() => { setSlug(slugify(title)); setManualSlug(false); }}>
                Regenerate
              </button>
            </div>
          </div>

          <EditorToolbar onCmd={execCmd} />

          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex border-b border-wp-border">
              <div
                className={`px-4 py-2 text-xs font-semibold cursor-pointer border-b-2 mb-[-1px] ${visualTab ? 'text-[#1d2327] border-b-[#1d2327]' : 'text-text-light border-transparent'}`}
                onClick={() => switchTab('visual')}
              >
                Visual
              </div>
              <div
                className={`px-4 py-2 text-xs font-semibold cursor-pointer border-b-2 mb-[-1px] ${!visualTab ? 'text-[#1d2327] border-b-[#1d2327]' : 'text-text-light border-transparent'}`}
                onClick={() => switchTab('source')}
              >
                Text (HTML)
              </div>
            </div>
            <div
              className="min-h-[450px] p-6 font-['Georgia',serif] text-sm leading-relaxed text-text-dark outline-none focus:outline-none"
              ref={contentRef}
              contentEditable={visualTab}
              onInput={handleContentInput}
              style={{ display: visualTab ? 'block' : 'none' }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                  e.preventDefault();
                  save('draft');
                }
              }}
              dangerouslySetInnerHTML={{ __html: existing?.content || '<p>Write your article content here...</p>' }}
            />
            <textarea
              className="min-h-[450px] p-4 font-mono text-xs border-none w-full resize-y outline-none leading-relaxed text-[#333] bg-gray-50"
              ref={sourceRef}
              style={{ display: visualTab ? 'none' : 'block' }}
              defaultValue={existing?.content || ''}
            />
            <div className="px-4 py-1.5 bg-wp-gray border-t border-wp-border text-[0.7rem] text-text-light flex gap-6">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>{readTime} min read</span>
            </div>
          </div>

          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
              <h3 className="text-xs font-semibold text-[#1d2327]">Excerpt</h3>
            </div>
            <div className="p-4">
              <textarea
                placeholder="Write a brief summary of this article..."
                rows="4"
                className="w-full border border-wp-border p-3 font-sans text-xs resize-y min-h-[80px] outline-none leading-relaxed focus:border-wp-blue"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
              <p className="text-[0.72rem] text-text-light mt-2 leading-relaxed">Excerpts are optional summaries. If not provided, the first 150 characters of content will be used.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <PublishPanel article={existing} onSave={save} />

          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
              <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>📋</span> Article Settings</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#333] mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-2.5 py-2 border border-wp-border font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]">
                  <option value="general">General</option>
                  <option value="fdi">FDI & Investment</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="labor">Labor & Employment</option>
                  <option value="energy">Energy Law</option>
                  <option value="tax">Taxation</option>
                  <option value="ip">Intellectual Property</option>
                  <option value="litigation">Litigation</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#333] mb-1">Author</label>
                <select value={authorVal} onChange={(e) => setAuthorVal(e.target.value)} className="w-full px-2.5 py-2 border border-wp-border font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]">
                  <option value="SN|Adv. Sudeep Nepal">Adv. Sudeep Nepal (Founder)</option>
                  <option value="SS|Associate Sujan Subedi">Associate Sujan Subedi</option>
                  <option value="NN|Nikesh Nepal">Nikesh Nepal</option>
                  <option value="NP|Associate Neehal Pokharel">Associate Neehal Pokharel</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#333] mb-1">Publish Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-2 border border-wp-border font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]"
                />
              </div>
            </div>
          </div>

          <CategoryPanel category={category} onChange={setCategory} />
          <TagsPanel tags={tags} onChange={setTags} />
          <FeaturedImagePanel image={featImage} onChange={setFeatImage} alt={featImageAlt} onAltChange={setFeatImageAlt} />

          <SEOPanel
            title={title}
            slug={slug}
            excerpt={excerpt}
            content={content}
            tags={tags}
            keywords={keywords}
            onKwChange={setKeywords}
            seoTitle={seoTitle}
            seoDesc={seoDesc}
            canonical={canonical}
            onSeoTitleChange={setSeoTitle}
            onSeoDescChange={setSeoDesc}
            onCanonicalChange={setCanonical}
          />
        </div>
      </div>
    </>
  );
}
