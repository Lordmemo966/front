import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6" dir="rtl">
      <div className="text-8xl mb-6 opacity-30">🪵</div>
      <h1 className="text-5xl font-bold text-wood-dark mb-3">٤٠٤</h1>
      <p className="text-wood-warm/70 text-lg mb-2">عذراً، الصفحة غير موجودة</p>
      <p className="text-wood-warm/50 text-sm mb-8">ربما تم نقل الصفحة أو حذفها.</p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link to="/" className="btn-gold">🏠 الرئيسية</Link>
        <Link to="/gallery" className="btn-outline !text-wood-dark !border-cream-dark">🖼️ المعرض</Link>
      </div>
    </div>
  );
}
