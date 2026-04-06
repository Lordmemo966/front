import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { PageLoader } from './Spinner';

const NAV = [
  { to: '/admin/dashboard', icon: '📋', label: 'البيانات'   },
  { to: '/admin/hours',     icon: '🕐', label: 'المواعيد'  },
  { to: '/admin/social',    icon: '🌐', label: 'السوشيال'  },
  { to: '/admin/gallery',   icon: '🖼️', label: 'المعرض'    },
  { to: '/admin/services',  icon: '🔧', label: 'الخدمات'   },
  { to: '/admin/system',    icon: '⚙️', label: 'النظام'    },
  { to: '/admin/messages', icon: '📨', label: 'الرسائل'   },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/admin/login" replace />;

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen flex bg-cream/80" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-56 bg-wood-dark flex flex-col
                         transition-transform duration-300 md:translate-x-0
                         ${sideOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gold/20">
          <Logo size="sm" />
          <div>
            <p className="text-cream font-bold text-sm">لوحة التحكم</p>
            <p className="text-gold text-xs tracking-wider">النجارة الحديثة</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setSideOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150
                 ${isActive ? 'bg-gold text-wood-dark font-bold' : 'text-cream/70 hover:bg-white/10 hover:text-cream'}`
              }>
              <span className="text-base">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gold/20 flex flex-col gap-2">
          <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-cream/60 hover:bg-white/10 hover:text-cream transition-all">
            🏠 الرئيسية
          </NavLink>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-all w-full text-right">
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {sideOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 md:mr-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-cream-dark flex items-center justify-between px-5 h-14 shadow-sm">
          <button className="md:hidden p-2" onClick={() => setSideOpen(o => !o)}>
            <span className="block w-5 h-0.5 bg-wood-dark mb-1" />
            <span className="block w-5 h-0.5 bg-wood-dark mb-1" />
            <span className="block w-5 h-0.5 bg-wood-dark" />
          </button>
          <h1 className="font-bold text-wood-dark text-sm hidden sm:block">
            مرحباً، {user?.username} 👋
          </h1>
          <div className="flex items-center gap-2">
            <NavLink to="/stats" className="btn-dark !py-1.5 !px-3 !text-xs">📊 الإحصائيات</NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 max-w-4xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
