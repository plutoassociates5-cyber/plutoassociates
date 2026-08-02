export default function Sidebar({ page, onNavigate, user, onLogout }) {
  const sections = [
    {
      label: 'Main',
      items: [
        { pg: 'dash', icon: '\uD83D\uDCCA', text: 'Dashboard' },
      ],
    },
    {
      label: 'Content',
      items: [
        { pg: 'all', icon: '\uD83D\uDCC4', text: 'Articles' },
        { pg: 'new', icon: '\u270F\uFE0F', text: 'New Article' },
        { pg: 'practice-areas', icon: '\uD83C\uDF0D', text: 'Practice Areas' },
        { pg: 'lawyers', icon: '\uD83D\uDC64', text: 'Lawyers' },
        { pg: 'faqs', icon: '\u2753', text: 'FAQs' },
        { pg: 'categories', icon: '\uD83D\uDCC1', text: 'Categories' },
        { pg: 'tags', icon: '\uD83C\uDFF7\uFE0F', text: 'Tags' },
        { pg: 'media', icon: '\uD83D\uDDBC\uFE0F', text: 'Media Library' },
        { pg: 'homepage', icon: '\uD83C\uDF10', text: 'Homepage' },
      ],
    },
    {
      label: 'Website',
      items: [
        { pg: 'messages', icon: '\uD83D\uDCE7', text: 'Contact Inbox' },
        { pg: 'site', icon: '\u2699\uFE0F', text: 'Site Settings' },
      ],
    },
  ];

  return (
    <aside className="w-[200px] lg:w-[200px] bg-[#1d2327] fixed top-0 left-0 h-screen z-[100] overflow-y-auto shrink-0 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-serif text-sm text-white leading-tight">Pluto Associates</h2>
        <span className="text-[0.55rem] text-gold tracking-[1.5px] uppercase">CMS</span>
      </div>
      <nav className="py-2 flex-1">
        {sections.map((section, si) => (
          <div key={si}>
            <div className="px-4 py-1.5 text-[0.62rem] text-white/30 uppercase tracking-[1px] font-semibold">{section.label}</div>
            {section.items.map((link) => (
              <a
                key={link.pg}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-white/70 no-underline text-xs font-medium cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-white hover:bg-white/5 ${page === link.pg ? 'text-white bg-white/10 border-l-gold' : ''}`}
                onClick={() => onNavigate(link.pg)}
              >
                {link.icon} {link.text}
              </a>
            ))}
            {si < sections.length - 1 && <div className="h-px bg-white/10 my-2 mx-4" />}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-[0.65rem] shrink-0">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
          <div className="text-xs text-white font-semibold">{user?.name || 'Admin'}</div>
        </div>
        <button className="w-full py-1.5 bg-white/5 border border-white/10 text-white/50 text-[0.68rem] cursor-pointer font-sans hover:bg-accent-red hover:text-white hover:border-accent-red" onClick={onLogout}>Log Out</button>
      </div>
    </aside>
  );
}
