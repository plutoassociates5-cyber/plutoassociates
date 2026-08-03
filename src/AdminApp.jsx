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
import PracticeAreasManager from './components/admin/PracticeAreasManager';
import LawyersManager from './components/admin/LawyersManager';
import KnowledgeManager from './components/admin/KnowledgeManager';
import CategoriesManager from './components/admin/CategoriesManager';
import TagsManager from './components/admin/TagsManager';
import MediaLibrary from './components/admin/MediaLibrary';
import HomepageManager from './components/admin/HomepageManager';
import SiteSettings from './components/admin/SiteSettings';
import LogoManager from './components/admin/LogoManager';
import ContactInbox from './components/admin/ContactInbox';
import ServicesDashboard from './components/admin/ServicesDashboard';
import ServiceEditor from './components/admin/ServiceEditor';

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
      case 'practice-areas':
        return <PracticeAreasManager />;
      case 'lawyers':
        return <LawyersManager />;
      case 'faqs':
        return <KnowledgeManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'tags':
        return <TagsManager />;
      case 'media':
        return <MediaLibrary />;
      case 'services':
        return <ServicesDashboard onEdit={(id) => openPage('service-edit', id)} onAdd={() => openPage('service-new')} />;
      case 'service-new':
        return <ServiceEditor editId={null} onNavigate={openPage} />;
      case 'service-edit':
        return <ServiceEditor editId={editId} onNavigate={openPage} />;
      case 'homepage':
        return <HomepageManager />;
      case 'messages':
        return <ContactInbox />;
      case 'logo':
        return <LogoManager />;
      case 'site':
        return <SiteSettings />;
      case 'settings':
        return <Settings onNavigate={openPage} />;
      default:
        return <Dashboard onEdit={(id) => openPage('edit', id)} onNavigate={openPage} />;
    }
  };

  return (
    <div id="app" className="show">
      <Sidebar page={page} onNavigate={openPage} user={user} onLogout={logout} />
      <div className="ml-[200px] flex flex-col min-h-screen w-[calc(100%-200px)]">
        <AdminBar onNavigate={openPage} />
        <div className="flex-1 p-6">{renderPage()}</div>
      </div>
    </div>
  );
}

function AdminInner() {
  const { user } = useAuth();
  if (!user) return <LoginScreen />;
  return <AdminLayout />;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminInner />
      </ToastProvider>
    </AuthProvider>
  );
}