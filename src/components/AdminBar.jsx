export default function AdminBar({ onNavigate }) {
  return (
    <div className="bg-[#1d2327] h-8 flex items-center px-4 gap-6 sticky top-0 z-50">
      <span className="text-[0.72rem] text-gold font-semibold cursor-pointer transition-colors duration-150 hover:text-white" onClick={() => window.open('/')}>
        🏛 Pluto Associates
      </span>
      <span className="text-[0.72rem] text-white/60 cursor-pointer transition-colors duration-150 hover:text-white" onClick={() => onNavigate('new')}>+ New Article</span>
    </div>
  );
}
