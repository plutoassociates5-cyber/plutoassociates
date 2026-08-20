import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import RouteSEO from './seo';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PracticeAreasPage from './pages/PracticeAreasPage';
import PracticeAreaDetailPage from './pages/PracticeAreaDetailPage';
import TeamsPage from './pages/TeamsPage';
import PublicationsPage from './pages/PublicationsPage';
import ArticlePage from './pages/ArticlePage';
import FaqPage from './pages/FaqPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/PublicHooks';
import SiteFavicon from './components/SiteFavicon';
import ChatAssistant from './components/ChatAssistant';
import { ToastProvider } from './context/ToastContext';
import { BrandProvider } from './context/BrandContext';

const AdminApp = lazy(() => import('./AdminApp'));

function PublicWidgets() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <ChatAssistant />;
}

export default function App() {
  return (
    <ToastProvider>
      <BrandProvider>
        <ScrollToTop />
        <SiteFavicon />
        <RouteSEO />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/practice-areas" element={<PracticeAreasPage />} />
            <Route path="/practice-areas/:slug" element={<PracticeAreaDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/publications/:slug" element={<ArticlePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-navy">Loading…</div>}>
                  <AdminApp />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <PublicWidgets />
      </BrandProvider>
    </ToastProvider>
  );
}
