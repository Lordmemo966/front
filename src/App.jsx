import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

import PublicLayout from './components/PublicLayout';
import AdminLayout  from './components/AdminLayout';

import HomePage     from './pages/HomePage';
import GalleryPage  from './pages/GalleryPage';
import StatsPage    from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';

import LoginPage        from './pages/admin/LoginPage';
import DashboardPage    from './pages/admin/DashboardPage';
import HoursPage        from './pages/admin/HoursPage';
import SocialPage       from './pages/admin/SocialPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import ServicesPage     from './pages/admin/ServicesPage';
import SystemPage       from './pages/admin/SystemPage';
import MessagesPage     from './pages/admin/MessagesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 2 * 60 * 1000, refetchOnWindowFocus: false },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                fontFamily: 'Tajawal, sans-serif',
                direction: 'rtl',
                fontSize: '0.9rem',
                borderRadius: '10px',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#2C1A0E' }, duration: 3000 },
              error:   { duration: 4000 },
            }}
          />
          <ErrorBoundary>
            <Routes>
              {/* ── Public ── */}
              <Route element={<PublicLayout />}>
                <Route index          element={<HomePage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="stats"   element={<StatsPage />} />
                <Route path="*"       element={<NotFoundPage />} />
              </Route>

              {/* ── Admin login (standalone, no sidebar) ── */}
              <Route path="admin/login" element={<LoginPage />} />

              {/* ── Admin (protected sidebar layout) ── */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index            element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="hours"     element={<HoursPage />} />
                <Route path="social"    element={<SocialPage />} />
                <Route path="gallery"   element={<AdminGalleryPage />} />
                <Route path="services"  element={<ServicesPage />} />
                <Route path="system"    element={<SystemPage />} />
                <Route path="messages"  element={<MessagesPage />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
