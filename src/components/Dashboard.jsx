import { useState, useMemo } from 'react';
import { getArticles, saveArticles, deleteArticle } from '../utils/storage';
import { getLawyers, getPracticeAreas, getCategories, getTags, getFaqs, getMessages, getMedia } from '../utils/contentStore';
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

  const recent = filtered.slice(0, 6);
  const contacts = useMemo(() => getMessages().slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5), []);

  const stats = useMemo(() => {
    const pub = articles.filter((a) => a.status === 'published').length;
    const drf = articles.filter((a) => a.status === 'draft').length;
    const unread = getMessages().filter((m) => m.status === 'new').length;
    return {
      total: articles.length,
      published: pub,
      drafts: drf,
      practiceAreas: getPracticeAreas().length,
      lawyers: getLawyers().length,
      categories: getCategories().length,
      tags: getTags().length,
      faqs: getFaqs().length,
      media: getMedia().length,
      messages: getMessages().length,
      unread,
    };
  }, [articles]);

  const handleDelete = () => {
    if (!delTarget) return;
    deleteArticle(delTarget);
    setArticles(getArticles());
    toast('Article moved to trash.');
    setDelTarget(null);
  };

  const handleQuickPublish = (id) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, status: 'published', modifiedAt: new Date().toISOString() } : a));
    saveArticles(updated);
    setArticles(getArticles());
    toast('Article published!');
  };

  const handleQuickDraft = (id) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, status: 'draft', modifiedAt: new Date().toISOString() } : a));
    saveArticles(updated);
    setArticles(getArticles());
    toast('Saved as draft.', 'info');
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

  const quickActions = [
    { label: 'Write Article', pg: 'new', icon: '✍️' },
    { label: 'Add Lawyer', pg: 'lawyers', icon: '👤' },
    { label: 'Add Practice Area', pg: 'practice-areas', icon: '🌍' },
    { label: 'Upload Image', pg: 'media', icon: '🖼️' },
    { label: 'Edit Homepage', pg: 'homepage', icon: '🏠' },
    { label: 'Add FAQ', pg: 'faqs', icon: '❓' },
  ];

  const cards = [
    { label: 'Total Publications', value: stats.total, icon: '📄' },
    { label: 'Published', value: stats.published, icon: '✅' },
    { label: 'Drafts', value: stats.drafts, icon: '📝' },
    { label: 'Contact Inbox', value: stats.messages, icon: '📥' },
    { label: 'Unread', value: stats.unread, icon: '🔔' },
    { label: 'Practice Areas', value: stats.practiceAreas, icon: '🌍' },
    { label: 'Lawyers', value: stats.lawyers, icon: '👥' },
    { label: 'Categories', value: stats.categories, icon: '📁' },
    { label: 'Tags', value: stats.tags, icon: '🏷️' },
    { label: 'FAQs', value: stats.faqs, icon: '❓' },
    { label: 'Media Assets', value: stats.media, icon: '🖼️' },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Dashboard</h1>
        <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => onNavigate('new')}>+ Add New Article</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-4 pl-5 border-l-4 border-l-wp-blue shadow-[0_1px_3px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate(c.label === 'Practice Areas' ? 'practice-areas' : c.label === 'Lawyers' ? 'lawyers' : c.label === 'Categories' ? 'categories' : c.label === 'Tags' ? 'tags' : c.label === 'FAQs' ? 'faqs' : c.label === 'Media Assets' ? 'media' : c.label === 'Contact Inbox' ? 'messages' : 'all')}>
            <div className="text-[0.62rem] text-text-light uppercase tracking-[1px] font-semibold block mb-1">{c.label}</div>
            <div className="text-2xl lg:text-3xl font-bold text-[#1d2327] leading-none">{c.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[#1d2327] mb-3 mt-2">⚡ Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {quickActions.map((q) => (
          <button key={q.label} onClick={() => onNavigate(q.pg)} className="bg-white border border-wp-border p-4 text-left cursor-pointer hover:border-wp-blue hover:shadow-md transition-all">
            <div className="text-2xl mb-2">{q.icon}</div>
            <div className="text-xs font-semibold text-[#1d2327]">{q.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto">
          <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center flex-wrap gap-2">
            <div className="flex gap-3 flex-wrap">
              {[['all', 'Recent'], ['published', 'Published'], ['draft', 'Drafts']].map(([k, l]) => (
                <a key={k} className={`text-xs no-underline cursor-pointer hover:font-semibold ${filter === k ? 'text-[#333] font-semibold' : 'text-wp-blue'}`} onClick={() => setFilter(k)}>{l}</a>
              ))}
            </div>
            <input type="text" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} className="px-2.5 py-1 border border-wp-border font-sans text-xs outline-none focus:border-wp-blue w-[180px] max-w-full" />
          </div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Title</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Status</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id} className="group border-b border-light-gray">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#1d2327] cursor-pointer text-sm hover:text-wp-blue" onClick={() => onEdit(a.id)}>{a.title || '(no title)'}</span>
                    <div className="hidden text-[0.72rem] mt-1 group-hover:block">
                      <a onClick={() => onEdit(a.id)} className="cursor-pointer">Edit</a> |{' '}
                      <a onClick={() => handleQuickDraft(a.id)} className="cursor-pointer">Draft</a> |{' '}
                      <a onClick={() => handleQuickPublish(a.id)} className="cursor-pointer">Publish</a> |{' '}
                      <a className="text-accent-red cursor-pointer" onClick={() => setDelTarget(a.id)}>Trash</a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[0.65rem] font-bold rounded ${a.status === 'published' ? 'bg-green-50 text-accent-green' : 'bg-blue-50 text-blue-600'}`}>{a.status || 'draft'}</span>
                  </td>
                  <td className="px-4 py-3 text-text-light">{formatDate(a.date)}</td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan="3" className="px-4 py-10 text-center text-text-light">No articles yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-4 py-3 border-b border-wp-border font-semibold text-[#1d2327] text-sm">📥 Latest Contact Requests</div>
          {contacts.map((m) => (
            <div key={m.id} className="px-4 py-3 border-b border-light-gray flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#1d2327] truncate">{m.name} {m.status === 'new' && <span className="inline-block ml-1 px-1.5 py-0.5 text-[0.55rem] font-bold rounded bg-blue-50 text-accent-blue">NEW</span>}</p>
                <p className="text-[0.68rem] text-text-light truncate">{m.email} · {m.phone}</p>
                <p className="text-[0.72rem] text-text-body truncate">{m.subject || 'Inquiry'}</p>
              </div>
              <a className="text-wp-blue text-[0.72rem] whitespace-nowrap shrink-0" onClick={() => onNavigate('messages')}>View</a>
            </div>
          ))}
          {contacts.length === 0 && <div className="px-4 py-10 text-center text-text-light text-xs">No contact requests yet.</div>}
        </div>
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