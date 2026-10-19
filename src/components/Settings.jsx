import { useState } from 'react';
import { getArticles, saveArticles } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings({ onNavigate }) {
  const { toast } = useToast();

  const exportData = () => {
    const data = { articles: getArticles(), exportedAt: new Date().toISOString(), site: 'Pluto Associates' };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mlp-articles-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast('✓ Articles exported!');
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const imported = data.articles || (Array.isArray(data) ? data : []);
        const existing = getArticles();
        const merged = existing.concat(imported.filter((n) => !existing.find((e) => e.id === n.id)));
        saveArticles(merged);
        toast(`✓ Imported ${imported.length} articles!`);
      } catch {
        toast('Invalid file format.', 'err');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetData = () => {
    if (confirm('Delete ALL articles? This cannot be undone.')) {
      saveArticles([]);
      toast('All articles deleted.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Settings</h1>
      </div>
      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 max-w-[700px]">
        <h2 className="text-base text-[#1d2327] mb-6 pb-3 border-b border-wp-border">⚙️ General Settings</h2>

        <div className="mb-8">
          <h3 className="text-sm text-[#1d2327] font-semibold mb-4 flex items-center gap-1.5">🔐 Admin Access</h3>
          <div className="bg-off-white border border-light-gray p-4 text-xs leading-relaxed text-text-body">
            <p className="mb-2">Login credentials are no longer stored in the website code. They are managed securely as environment variables in the Cloudflare Pages dashboard.</p>
            <p className="mb-2">To change the admin username or password, update <code className="bg-white px-1 border border-light-gray">ADMIN_USER</code>, <code className="bg-white px-1 border border-light-gray">ADMIN_PASSWORD</code> and <code className="bg-white px-1 border border-light-gray">ADMIN_SECRET</code> under <strong>Cloudflare Dashboard → Pages → plutoassociates → Settings → Environment variables</strong>, then redeploy.</p>
            <p>Anyone with the new password can log in to this panel.</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm text-[#1d2327] font-semibold mb-4 flex items-center gap-1.5">💾 Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start py-3 border-b border-light-gray last:border-none">
            <div className="text-xs font-semibold text-[#333] pt-1">
              Export Articles
              <small className="block font-normal text-text-light mt-0.5 text-[0.68rem]">Download all articles as JSON</small>
            </div>
            <div className="">
              <button className="bg-wp-blue text-white border-none py-2.5 px-6 font-sans text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={exportData}>
                📥 Export JSON
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start py-3 border-b border-light-gray last:border-none">
            <div className="text-xs font-semibold text-[#333] pt-1">
              Import Articles
              <small className="block font-normal text-text-light mt-0.5 text-[0.68rem]">Import from JSON backup</small>
            </div>
            <div className="">
              <label className="bg-wp-blue text-white border-none py-2.5 px-6 font-sans text-xs font-semibold cursor-pointer hover:bg-[#005a87]" style={{ marginTop: 0, cursor: 'pointer' }}>
                📤 Import JSON
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start py-3 border-b border-light-gray last:border-none">
            <div className="text-xs font-semibold text-[#333] pt-1">
              Reset All Data
              <small className="block font-normal text-accent-red mt-0.5 text-[0.68rem]">This cannot be undone</small>
            </div>
            <div className="">
              <button
                className="bg-accent-red text-white border-none py-2.5 px-6 font-sans text-xs font-semibold cursor-pointer hover:bg-red-700"
                onClick={resetData}
              >
                🗑 Delete All Articles
              </button>
            </div>
          </div>
        </div>

        <button className="bg-wp-blue text-white border-none py-2.5 px-6 font-sans text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={saveSettings}>
          💾 Save Settings
        </button>
      </div>
    </>
  );
}
