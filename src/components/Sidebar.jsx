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
    <aside className="side">
      <div className="side-logo">
        <h2>Pluto Associates</h2>
        <span>Admin</span>
      </div>
      <nav className="side-nav">
        {links.map((link, i) => {
          if (link.sep && link.label) {
            return (
              <div key={i}>
                <div className="menu-label">{link.label}</div>
              </div>
            );
          }
          if (link.sep) return <div key={i} className="sep" />;
          if (link.external) {
            return (
              <a key={i} onClick={() => window.open('index.html')}>
                {link.icon} {link.text}
              </a>
            );
          }
          return (
            <a
              key={i}
              className={page === link.pg ? 'on' : ''}
              onClick={() => onNavigate(link.pg)}
            >
              {link.icon} {link.text}
            </a>
          );
        })}
      </nav>
      <div className="side-ft">
        <div className="side-user">
          <div className="side-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
          <div className="side-uname">{user?.name || 'Admin'}</div>
        </div>
        <button className="side-logout" onClick={onLogout}>Log Out</button>
      </div>
    </aside>
  );
}