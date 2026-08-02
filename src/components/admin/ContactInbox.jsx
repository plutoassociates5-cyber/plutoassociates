import { useMemo, useState } from 'react';
import { getMessages, saveMessages } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

const LABELS = { new: 'New', read: 'Read', archived: 'Archived', spam: 'Spam' };

export default function ContactInbox() {
  const { toast } = useToast();
  const [msgs, setMsgs] = useState(getMessages);
  const [filter, setFilter] = useState('new');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  const persist = (list) => { saveMessages(list); setMsgs(list); };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return msgs
      .filter((m) => (filter === 'all' ? true : m.status === filter))
      .filter((m) => !q || (m.name + m.email + m.subject + m.message).toLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [msgs, filter, search]);

  const counts = useMemo(() => ({
    new: msgs.filter((m) => m.status === 'new').length,
    read: msgs.filter((m) => m.status === 'read').length,
    archived: msgs.filter((m) => m.status === 'archived').length,
    spam: msgs.filter((m) => m.status === 'spam').length,
  }), [msgs]);

  const update = (id, status) => {
    persist(msgs.map((m) => (m.id === id ? { ...m, status } : m)));
    toast('Message updated.');
  };

  const setStatus = (m, status) => { update(m.id, status); };
  const open = (m) => { setOpenId(m.id); if (m.status === 'new') update(m.id, 'read'); };
  const active = msgs.find((m) => m.id === openId);

  const mailto = (m) => `mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subject || 'Your inquiry'))}`;

  const taps = [
    { k: 'new', label: 'New', n: counts.new },
    { k: 'read', label: 'Read', n: counts.read },
    { k: 'archived', label: 'Archived', n: counts.archived },
    { k: 'spam', label: 'Spam', n: counts.spam },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Contact Inbox</h1>
        <button className="bg-white border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => { const s = getMessages(); toast(`Exporting ${s.length} messages…`); const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `contact-messages-${new Date().toISOString().split('T')[0]}.json`; a.click(); }}>⬇ Export CSV/JSON</button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {taps.map((t) => (
          <button key={t.k} className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${filter === t.k ? 'bg-wp-blue text-white border-wp-blue' : 'bg-white border-wp-border text-[#555]'}`} onClick={() => setFilter(t.k)}>{t.label} ({t.n})</button>
        ))}
        <input className="ml-auto border border-wp-border px-2.5 py-1.5 text-xs outline-none focus:border-wp-blue w-[180px]" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] divide-y divide-light-gray max-h-[70vh] overflow-y-auto">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => open(m)} className={`w-full text-left px-4 py-3 cursor-pointer border-none bg-transparent flex flex-col gap-1 ${openId === m.id ? 'bg-wp-gray' : 'hover:bg-wp-gray'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[0.75rem] font-semibold text-[#1d2327] truncate ${m.status === 'new' ? 'font-bold' : ''}`}>{m.name}</span>
                <span className="text-[0.6rem] text-text-light shrink-0">{new Date(m.date).toLocaleDateString()}</span>
              </div>
              <span className="text-xs text-text-body truncate">{m.subject || '(no subject)'}</span>
              <span className="text-[0.68rem] text-text-light truncate">{m.email}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="px-4 py-16 text-center text-text-light text-sm">No messages here.</div>}
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 min-h-[300px]">
          {active ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg text-[#1d2327] font-semibold">{active.name}</h2>
                  <p className="text-xs text-text-light">{active.email} · {active.phone && <a className="text-wp-blue" href={`tel:${active.phone}`}>{active.phone}</a>} · {new Date(active.date).toLocaleString()}</p>
                  <p className="text-xs text-accent-blue mt-1">Area: {active.area || 'general'}</p>
                </div>
                <span className={`inline-block px-2 py-0.5 text-[0.62rem] font-bold rounded ${active.status === 'new' ? 'bg-blue-50 text-accent-blue' : active.status === 'spam' ? 'bg-red-50 text-accent-red' : 'bg-gray-100 text-[#555]'}`}>{LABELS[active.status]}</span>
              </div>
              {active.subject && <h3 className="text-sm font-semibold text-[#1d2327] mb-2">{active.subject}</h3>}
              <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap mb-6">{active.message}</p>
              <div className="flex gap-2 flex-wrap">
                <a className="bg-wp-blue text-white px-4 py-2 text-xs font-semibold no-underline" href={`mailto:${active.email}?subject=${encodeURIComponent('Re: ' + (active.subject || ''))}`}>Reply</a>
                <button className="bg-white border border-wp-border px-3 py-2 text-xs font-semibold cursor-pointer" onClick={() => setStatus(active, 'archived')}>Archive</button>
                <button className="bg-white border border-wp-border px-3 py-2 text-xs font-semibold cursor-pointer" onClick={() => setStatus(active, 'spam')}>Mark Spam</button>
                <button className="bg-accent-red text-white px-3 py-2 text-xs font-semibold cursor-pointer border-none" onClick={() => { persist(msgs.filter((x) => x.id !== active.id)); setOpenId(null); toast('Message deleted.'); }}>Delete</button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-text-light text-sm">Select a message to view it.</div>
          )}
        </div>
      </div>
    </>
  );
}