import { useState, useRef, useEffect, useCallback } from 'react';
import { getArticles, saveArticles, uid, slugify } from '../utils/storage';
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
  const [keywords, setKeywords] = useState(existing?.metaKeywords || '');
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
    const art = {
      title: trimmedTitle,
      slug: slug || slugify(trimmedTitle),
      excerpt: excerpt,
      content: finalContent,
      category: category,
      authorInitials: authorParts[0] || 'SN',
      authorName: authorParts[1] || 'Adv. Sudeep Nepal',
      date: date,
      status: status,
      tags: tags.slice(),
      featuredImage: featImage,
      seoTitle: '',
      seoDesc: excerpt,
      metaKeywords: keywords,
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
      <div className="page-title-area">
        <h1>{existing ? 'Edit Article' : 'Add New Article'}</h1>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            className="add-new-btn"
            style={{ background: '#fff', color: '#333', border: '1px solid #ddd' }}
            onClick={() => save('preview')}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <div className="editor-main">
          <div className="editor-title-wrap">
            <label>Article Title</label>
            <input
              type="text"
              className="post-title-input"
              placeholder="Enter article title here..."
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <div className="permalink-row">
              <strong>Permalink:</strong>
              <span>https://plutoassociates.com/</span>
              <input
                className="slug-field"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setManualSlug(true); }}
              />
              <button className="permalink-btn" onClick={() => { setSlug(slugify(title)); setManualSlug(false); }}>
                Regenerate
              </button>
            </div>
          </div>

          <EditorToolbar onCmd={execCmd} />

          <div className="editor-content-wrap">
            <div className="editor-tab-bar">
              <div
                className={`editor-tab ${visualTab ? 'active' : ''}`}
                onClick={() => switchTab('visual')}
              >
                Visual
              </div>
              <div
                className={`editor-tab ${!visualTab ? 'active' : ''}`}
                onClick={() => switchTab('source')}
              >
                Text (HTML)
              </div>
            </div>
            <div
              className="editor-body"
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
              className="source-view"
              ref={sourceRef}
              style={{ display: visualTab ? 'none' : 'block' }}
              defaultValue={existing?.content || ''}
            />
            <div className="word-count-bar">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>{readTime} min read</span>
            </div>
          </div>

          <div className="excerpt-wrap">
            <div className="meta-box-header">
              <h3>Excerpt</h3>
            </div>
            <div className="meta-box-body">
              <textarea
                placeholder="Write a brief summary of this article..."
                rows="4"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
              <p>Excerpts are optional summaries. If not provided, the first 150 characters of content will be used.</p>
            </div>
          </div>
        </div>

        <div className="editor-side">
          <PublishPanel article={existing} onSave={save} />

          <div className="side-panel">
            <div className="side-panel-head">
              <h3><span className="ph-icon">📋</span> Article Settings</h3>
            </div>
            <div className="side-panel-body">
              <div className="meta-field">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
              <div className="meta-field">
                <label>Author</label>
                <select value={authorVal} onChange={(e) => setAuthorVal(e.target.value)}>
                  <option value="SN|Adv. Sudeep Nepal">Adv. Sudeep Nepal (Founder)</option>
                  <option value="RG|Adv. Ram Sharan Ghimire">Adv. Ram Sharan Ghimire</option>
                  <option value="NN|Nikesh Nepal">Nikesh Nepal</option>
                </select>
              </div>
              <div className="meta-field">
                <label>Publish Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <CategoryPanel category={category} onChange={setCategory} />
          <TagsPanel tags={tags} onChange={setTags} />
          <FeaturedImagePanel image={featImage} onChange={setFeatImage} />

          <SEOPanel
            title={title}
            slug={slug}
            excerpt={excerpt}
            content={content}
            tags={tags}
            keywords={keywords}
            onKwChange={setKeywords}
          />
        </div>
      </div>
    </>
  );
}