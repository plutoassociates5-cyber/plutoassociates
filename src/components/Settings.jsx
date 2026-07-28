import { useState } from 'react';
import { getCreds, saveCreds, getArticles, saveArticles } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings({ onNavigate }) {
  const { toast } = useToast();
  const creds = getCreds();
  const [user, setUser] = useState(creds.u);
  const [name, setName] = useState(creds.n || '');
  const [pass, setPass] = useState('');
  const [passC, setPassC] = useState('');

  const saveSettings = () => {
    if (!user.trim()) {
      toast('Username is required.', 'err');
      return;
    }
    if (pass && pass !== passC) {
      toast('Passwords do not match.', 'err');
      return;
    }
    const c = { u: user.trim(), n: name.trim() || user.trim(), p: pass || creds.p };
    saveCreds(c);
    toast('✓ Settings saved!');
    setPass('');
    setPassC('');
  };

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
      <div className="page-title-area">
        <h1>Settings</h1>
      </div>
      <div className="settings-wrap">
        <h2>⚙️ General Settings</h2>

        <div className="settings-section">
          <h3>🔐 Admin Credentials</h3>
          <div className="setting-row">
            <div className="setting-label">
              Username
              <small>Used to log into admin</small>
            </div>
            <div className="setting-input">
              <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-label">
              Display Name
              <small>Shown in admin panel</small>
            </div>
            <div className="setting-input">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-label">
              New Password
              <small>Leave blank to keep current</small>
            </div>
            <div className="setting-input">
              <input type="password" placeholder="Enter new password..." value={pass} onChange={(e) => setPass(e.target.value)} />
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-label">Confirm Password</div>
            <div className="setting-input">
              <input type="password" placeholder="Confirm new password..." value={passC} onChange={(e) => setPassC(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>💾 Data Management</h3>
          <div className="setting-row">
            <div className="setting-label">
              Export Articles
              <small>Download all articles as JSON</small>
            </div>
            <div className="setting-input">
              <button className="settings-save" style={{ marginTop: 0 }} onClick={exportData}>
                📥 Export JSON
              </button>
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-label">
              Import Articles
              <small>Import from JSON backup</small>
            </div>
            <div className="setting-input">
              <label className="settings-save" style={{ marginTop: 0, cursor: 'pointer' }}>
                📤 Import JSON
                <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div className="setting-row">
            <div className="setting-label">
              Reset All Data
              <small style={{ color: 'var(--red)' }}>This cannot be undone</small>
            </div>
            <div className="setting-input">
              <button
                className="settings-save"
                style={{ background: 'var(--red)', marginTop: 0 }}
                onClick={resetData}
              >
                🗑 Delete All Articles
              </button>
            </div>
          </div>
        </div>

        <button className="settings-save" onClick={saveSettings}>
          💾 Save Settings
        </button>
      </div>
    </>
  );
}