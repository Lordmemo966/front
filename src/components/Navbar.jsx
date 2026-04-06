import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTrackWA } from '../hooks/useStats';
import Logo from './Logo';

const PHONE = '+201001234567';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const trackWA = useTrackWA();

  const links = [
    { to: '/#services', label: 'خدماتنا' },
    { to: '/#contact',  label: 'تواصل'   },
    { to: '/gallery',   label: 'المعرض'  },
    { to: '/stats',     label: 'الإحصائيات' },
    { to: '/admin',     label: 'التحكم'  },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-wood-dark border-b-[3px] border-gold shadow-lg">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <Logo size="sm" />
          <span className="text-cream font-bold text-[0.95rem] hidden sm:block">النجارة الحديثة</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank" rel="noreferrer"
            onClick={() => trackWA.mutate()}
            className="mr-2 btn-gold !py-1.5 !px-4 !text-sm">
            واتساب الآن
          </a>
        </div>

        {/* Hamburger */}
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(o => !o)}>
          <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-cream transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-wood-dark border-t border-gold/20 px-4 py-3 flex flex-col gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link block py-2${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
          <a href={`https://wa.me/${PHONE}`} target="_blank" rel="noreferrer"
            className="btn-gold mt-2 justify-center !text-sm">واتساب الآن</a>
        </div>
      )}
    </nav>
  );
}
