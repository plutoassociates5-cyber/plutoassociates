export default function Sidebar({ page, onNavigate, user, onLogout }) {
  const links = [
    { label: 'Main', sep: true },
    { pg: 'dash', icon: '\uD83D\uDCCA', text: 'Dashboard' },
    { sep: true },
    { label: 'Articles', sep: true },
    { pg: 'all', icon: '\uD83D\uDCC4', text: 'All Articles' },
    { pg: 'new', icon: '\u270F\uFE0F', text: 'Add New' },
    { sep: true },
    { label: 'System', sep: true },
    { pg: 'settings', icon: '\u2699\uFE0F', text: 'Settings' },
    { external: true, icon: '\uD83C\uDF10', text: 'Visit Site', href: '#' },
  ];

  return (
    <aside className="w-[200px] lg:w-[200px] bg-[#1d2327] fixed top-0 left-0 h-screen z-[100] overflow-y-auto shrink-0 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-serif text-sm text-white leading-tight">Pluto Associates</h2>
        <span className="text-[0.55rem] text-gold tracking-[1.5px] uppercase">Admin</span>
      </div>
      <nav className="py-2 flex-1">
        {links.map((link, i) => {
          if (link.sep && link.label) {
            return (
              <div key={i}>
                <div className="px-4 py-1.5 text-[0.62rem] text-white/30 uppercase tracking-[1px] font-semibold">{link.label}</div>
              </div>
            );
          }
          if (link.sep) return <div key={i} className="h-px bg-white/10 my-2 mx-4" />;
          if (link.external) {
            return (
              <a key={i} onClick={() => window.open('/')} className="flex items-center gap-2.5 px-4 py-2.5 text-white/70 no-underline text-xs font-medium cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-white hover:bg-white/5">
                {link.icon} {link.text}
              </a>
            );
          }
          return (
            <a
              key={i}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-white/70 no-underline text-xs font-medium cursor-pointer transition-all duration-150 border-l-[3px] border-transparent hover:text-white hover:bg-white/5 ${page === link.pg ? 'text-white bg-white/10 border-l-gold' : ''}`}
              onClick={() => onNavigate(link.pg)}
            >
              {link.icon} {link.text}
            </a>
          );
        })}
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
