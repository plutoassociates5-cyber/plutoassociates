import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteSEO from './seo';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PracticeAreasPage from './pages/PracticeAreasPage';
import TeamsPage from './pages/TeamsPage';
import PublicationsPage from './pages/PublicationsPage';
import ArticlePage from './pages/ArticlePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from './components/PublicHooks';
import SiteFavicon from './components/SiteFavicon';
import { ToastProvider } from './context/ToastContext';

const AdminApp = lazy(() => import('./AdminApp'));

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <SiteFavicon />
      <RouteSEO />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/practice-areas" element={<PracticeAreasPage />} />
          <Route path="/teams" element={<TeamsPage />} />
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
    </ToastProvider>
  );
}
