export default function AdminBar({ onNavigate }) {
  return (
    <div className="wp-admin-bar">
      <span className="bar-site" onClick={() => window.open('index.html')}>
        🏛 Pluto Associates
      </span>
      <span onClick={() => onNavigate('new')}>+ New Article</span>
    </div>
  );
}