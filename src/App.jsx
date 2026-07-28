import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import AdminBar from './components/AdminBar';
import Dashboard from './components/Dashboard';
import ArticlesList from './components/ArticlesList';
import ArticleEditor from './components/ArticleEditor';
import Settings from './components/Settings';

function AdminLayout() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState('dash');
  const [editId, setEditId] = useState(null);

  const openPage = (pg, id) => {
    setPage(pg);
    if (pg !== 'edit') setEditId(null);
    if (id) setEditId(id);
  };

  const renderPage = () => {
    switch (page) {
      case 'dash':
        return <Dashboard onEdit={(id) => openPage('edit', id)} onNavigate={openPage} />;
      case 'all':
        return <ArticlesList onEdit={(id) => openPage('edit', id)} onNavigate={openPage} />;
      case 'new':
        return <ArticleEditor editId={null} onNavigate={openPage} />;
      case 'edit':
        return <ArticleEditor editId={editId} onNavigate={openPage} />;
      case 'settings':
        return <Settings onNavigate={openPage} />;
      default:
        return <Dashboard onEdit={(id) => openPage('edit', id)} onNavigate={openPage} />;
    }
  };

  return (
    <div id="app" className="show">
      <Sidebar page={page} onNavigate={openPage} user={user} onLogout={logout} />
      <div className="topwrap">
        <AdminBar onNavigate={openPage} />
        <div className="main-content">{renderPage()}</div>
      </div>
    </div>
  );
}

function AppInner() {
  const { user } = useAuth();
  if (!user) return <LoginScreen />;
  return <AdminLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}