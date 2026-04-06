import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WaFloat from './WaFloat';
import { useTrackVisit } from '../hooks/useStats';
import { useSettings } from '../hooks/useSettings';

const PAGE_MAP = { '/': 'home', '/gallery': 'gallery', '/stats': 'stats' };

export default function PublicLayout() {
  const { pathname } = useLocation();
  const trackVisit   = useTrackVisit();
  const { data: s }  = useSettings();

  useEffect(() => {
    const page = PAGE_MAP[pathname] || 'home';
    trackVisit.mutate(page);
  }, [pathname]); // eslint-disable-line

  // Maintenance mode
  if (s?.maintenance) {
    return (
      <div className="min-h-screen bg-wood-dark flex flex-col items-center justify-center text-center gap-4">
        <span className="text-6xl">🔧</span>
        <h1 className="text-gold-light text-3xl font-bold">الموقع تحت الصيانة</h1>
        <p className="text-wood-warm">نعمل على تحسين خدمتنا، نعود قريباً</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WaFloat phone={s?.whatsapp || '+201001234567'} />
    </div>
  );
}
