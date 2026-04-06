import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const { data: s } = useSettings();

  return (
    <footer className="bg-wood-dark border-t-4 border-gold pt-10 pb-6">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Logo size="sm" />
              <span className="text-cream font-bold">النجارة الحديثة</span>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">
              متخصصون في تصنيع وتركيب الأثاث الخشبي والديكور الداخلي بأعلى معايير الجودة.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gold text-xs font-bold tracking-widest mb-3">روابط سريعة</h4>
            {[['/#services','خدماتنا'],['/gallery','معرض الأعمال'],['/#contact','تواصل معنا'],['/admin','التحكم']].map(([to,label]) => (
              <Link key={to} to={to} className="block text-cream/60 text-sm hover:text-gold-light leading-loose transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold text-xs font-bold tracking-widest mb-3">تواصل</h4>
            {s?.phone    && <a href={`tel:${s.phone}`}       className="block text-cream/60 text-sm hover:text-gold-light leading-loose">📞 {s.phone}</a>}
            {s?.email    && <a href={`mailto:${s.email}`}    className="block text-cream/60 text-sm hover:text-gold-light leading-loose">✉️ {s.email}</a>}
            {s?.address  && <p className="text-cream/60 text-sm leading-loose">📍 {s.address}</p>}
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-center text-xs text-cream/30">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()}{' '}
          <span className="text-gold-light">النجارة الحديثة</span>
        </div>
      </div>
    </footer>
  );
}
