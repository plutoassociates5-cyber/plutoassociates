export default function PublishPanel({ article, onSave }) {
  const formatDate = (d) => {
    if (!d) return 'Immediately';
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className="side-panel">
      <div className="side-panel-head">
        <h3><span className="ph-icon">📤</span> Publish</h3>
      </div>
      <div className="side-panel-body">
        <div className="pub-status-row">
          <span className="pub-label">Status</span>
          <span className="pub-value" id="statusDisplay">{article?.status || 'Draft'}</span>
        </div>
        <div className="pub-status-row">
          <span className="pub-label">Visibility</span>
          <span className="pub-value">Public</span>
        </div>
        <div className="pub-status-row">
          <span className="pub-label">Published</span>
          <span className="pub-value">{formatDate(article?.date)}</span>
        </div>
        {article?.modifiedAt && (
          <div className="pub-status-row">
            <span className="pub-label">Last Modified</span>
            <span className="pub-value">{formatDate(article.modifiedAt)}</span>
          </div>
        )}
        <div className="pub-btns">
          <button className="btn-publish" onClick={() => onSave('published')}>✓ Publish</button>
          <button className="btn-draft" onClick={() => onSave('draft')}>Save Draft</button>
          <button className="btn-draft" onClick={() => onSave('preview')}>Preview</button>
        </div>
      </div>
    </div>
  );
}