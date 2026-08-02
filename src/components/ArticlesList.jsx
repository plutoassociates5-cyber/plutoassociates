import { useState, useMemo } from 'react';
import { getArticles, saveArticles, deleteArticle, getSeedArticles } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';

export default function ArticlesList({ onEdit, onNavigate }) {
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
    return { total: articles.length, published: pub, drafts: drf };
  }, [articles]);

  const handleDelete = () => {
    if (!delTarget) return;
    deleteArticle(delTarget);
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

  const handleExport = () => {
    const seedIds = new Set(getSeedArticles().map((a) => a.id));
    const local = articles.filter((a) => !seedIds.has(a.id));
    const blob = new Blob([JSON.stringify(local, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pluto-articles-seed.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(
      local.length
        ? `Exported ${local.length} article${local.length === 1 ? '' : 's'} to pluto-articles-seed.json. Append them to src/content/articles.json to make them permanent.`
        : 'Nothing new to export — all articles are already part of the seed.',
      local.length ? 'info' : undefined
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Articles</h1>
        <div className="flex gap-2">
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-wp-gray" onClick={handleExport}>
            ⬇ Export
          </button>
          <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => onNavigate('new')}>
            + Add New
          </button>
        </div>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto">
        <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-3 flex-wrap">
            <a className={`text-xs no-underline cursor-pointer hover:font-semibold ${filter === 'all' ? 'text-[#333] font-semibold' : 'text-wp-blue'}`} onClick={() => setFilter('all')}>
              All ({counts.total})
            </a>
            <a className={`text-xs no-underline cursor-pointer hover:font-semibold ${filter === 'published' ? 'text-[#333] font-semibold' : 'text-wp-blue'}`} onClick={() => setFilter('published')}>
              Published ({counts.published})
            </a>
            <a className={`text-xs no-underline cursor-pointer hover:font-semibold ${filter === 'draft' ? 'text-[#333] font-semibold' : 'text-wp-blue'}`} onClick={() => setFilter('draft')}>
              Drafts ({counts.drafts})
            </a>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-2.5 py-1 border border-wp-border font-sans text-xs outline-none focus:border-wp-blue w-[180px] max-w-full"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-8">
            <h3 className="text-lg text-[#1d2327] mb-2">No Articles Yet</h3>
            <p className="text-sm text-text-light mb-6">Create your first article to get started.</p>
            <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => onNavigate('new')}>
              + Add New
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse text-xs lg:text-sm">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Title</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Status</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Category</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Author</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="group">
                  <td className="px-4 py-3 border-b border-light-gray align-top">
                    <span className="font-semibold text-[#1d2327] cursor-pointer text-sm hover:text-wp-blue" onClick={() => onEdit(a.id)}>
                      {a.title || '(no title)'}
                    </span>
                    <div className="hidden text-[0.72rem] mt-1 group-hover:block">
                      <a onClick={() => onEdit(a.id)} className="cursor-pointer">Edit</a> |{' '}
                      <a onClick={() => handleQuickDraft(a.id)} className="cursor-pointer">Draft</a> |{' '}
                      <a onClick={() => handleQuickPublish(a.id)} className="cursor-pointer">Publish</a> |{' '}
                      <a className="text-accent-red cursor-pointer" onClick={() => setDelTarget(a.id)}>
                        Trash
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-light-gray align-top">
                    <span className={`inline-block px-2 py-0.5 text-[0.65rem] font-bold rounded ${a.status === 'published' ? 'bg-green-50 text-accent-green' : 'bg-blue-50 text-blue-600'}`}>
                      {a.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-light-gray align-top">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-[#555] text-[0.68rem] rounded">{a.category || 'General'}</span>
                  </td>
                  <td className="px-4 py-3 border-b border-light-gray align-top">{a.authorName || '—'}</td>
                  <td className="px-4 py-3 border-b border-light-gray align-top">{formatDate(a.date)}</td>
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
