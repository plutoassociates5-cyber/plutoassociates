import { useState, useMemo } from 'react';
import { getArticles, saveArticles } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';

export default function Dashboard({ onEdit, onNavigate }) {
  const { toast } = useToast();
  const [articles, setArticles] = useState(getArticles);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [delTarget, setDelTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? articles : articles.filter((a) => a.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.title || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q) ||
          (a.authorName || '').toLowerCase().includes(q)
      );
    }
    return list.slice().sort((a, b) => new Date(b.modifiedAt || b.createdAt || 0) - new Date(a.modifiedAt || a.createdAt || 0));
  }, [articles, filter, search]);

  const counts = useMemo(() => {
    const pub = articles.filter((a) => a.status === 'published').length;
    const drf = articles.filter((a) => a.status === 'draft').length;
    const cats = new Set(articles.map((a) => a.category)).size;
    return { total: articles.length, published: pub, drafts: drf, categories: cats };
  }, [articles]);

  const handleDelete = () => {
    if (!delTarget) return;
    saveArticles(articles.filter((a) => a.id !== delTarget));
    setArticles(getArticles());
    toast('Article moved to trash.');
    setDelTarget(null);
  };

  const handleQuickPublish = (id) => {
    const updated = articles.map((a) =>
      a.id === id ? { ...a, status: 'published', modifiedAt: new Date().toISOString() } : a
    );
    saveArticles(updated);
    setArticles(getArticles());
    toast('Article published!');
  };

  const handleQuickDraft = (id) => {
    const updated = articles.map((a) =>
      a.id === id ? { ...a, status: 'draft', modifiedAt: new Date().toISOString() } : a
    );
    saveArticles(updated);
    setArticles(getArticles());
    toast('Saved as draft.', 'info');
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="page-title-area">
        <h1>Dashboard</h1>
        <button className="add-new-btn" onClick={() => onNavigate('new')}>
          + Add New Article
        </button>
      </div>

      <div className="dash-stats">
        <div className="dash-stat">
          <small>Total Articles</small>
          <div className="dval">{counts.total}</div>
        </div>
        <div className="dash-stat green">
          <small>Published</small>
          <div className="dval">{counts.published}</div>
        </div>
        <div className="dash-stat orange">
          <small>Drafts</small>
          <div className="dval">{counts.drafts}</div>
        </div>
        <div className="dash-stat purple">
          <small>Categories</small>
          <div className="dval">{counts.categories}</div>
        </div>
      </div>

      <div className="wp-table-wrap">
        <div className="wp-table-nav">
          <div className="filter-links">
            <a className={filter === 'all' ? 'current' : ''} onClick={() => setFilter('all')}>
              All ({counts.total})
            </a>
            <a className={filter === 'published' ? 'current' : ''} onClick={() => setFilter('published')}>
              Published ({counts.published})
            </a>
            <a className={filter === 'draft' ? 'current' : ''} onClick={() => setFilter('draft')}>
              Drafts ({counts.drafts})
            </a>
          </div>
          <div className="table-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No Articles Yet</h3>
            <p>Create your first article to get started.</p>
            <button className="add-new-btn" onClick={() => onNavigate('new')}>
              + Add New
            </button>
          </div>
        ) : (
          <table className="wp-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span className="post-title" onClick={() => onEdit(a.id)}>
                      {a.title || '(no title)'}
                    </span>
                    <div className="row-actions">
                      <a onClick={() => onEdit(a.id)}>Edit</a> |{' '}
                      <a onClick={() => handleQuickDraft(a.id)}>Draft</a> |{' '}
                      <a onClick={() => handleQuickPublish(a.id)}>Publish</a> |{' '}
                      <a className="trash" onClick={() => setDelTarget(a.id)}>
                        Trash
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${a.status === 'published' ? 'status-published' : 'status-draft'}`}>
                      {a.status || 'draft'}
                    </span>
                  </td>
                  <td>
                    <span className="cat-pill">{a.category || 'General'}</span>
                  </td>
                  <td>{a.authorName || '—'}</td>
                  <td>{formatDate(a.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        show={!!delTarget}
        title="Move to Trash?"
        message="This article will be permanently deleted and cannot be recovered."
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
      />
    </>
  );
}