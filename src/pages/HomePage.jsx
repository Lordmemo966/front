import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import SectionTitle from '../components/SectionTitle';
import { PageLoader } from '../components/Spinner';
import ContactForm from '../components/ContactForm';
import { useSettings } from '../hooks/useSettings';
import { useTrackWA } from '../hooks/useStats';
import api from '../utils/api';

function ServiceCard({ icon, name, description }) {
  return (
    <div className="card text-center group hover:border-gold cursor-default">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-wood-dark mb-1.5">{name}</h3>
      <p className="text-sm text-wood-warm/70 leading-relaxed">{description}</p>
    </div>
  );
}

function ContactItem({ icon, label, value, href }) {
  const inner = (
    <>
      <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-light rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-md">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest text-wood-warm/60 mb-0.5 uppercase">{label}</p>
        <p className="font-medium text-wood-dark text-sm leading-snug">{value}</p>
      </div>
    </>
  );
  return href
    ? <a href={href} className="flex items-start gap-3 hover:-translate-x-1 transition-transform">{inner}</a>
    : <div className="flex items-start gap-3">{inner}</div>;
}

const DEFAULT_SERVICES = [
  { _id:'1', icon:'🛋️', name:'أثاث المنازل',  description:'غرف نوم، صالونات، مطابخ بتصاميم عصرية وكلاسيكية' },
  { _id:'2', icon:'🏢', name:'أثاث المكاتب',  description:'مكاتب، رفوف، أنظمة تخزين للشركات والمؤسسات' },
  { _id:'3', icon:'🚪', name:'أبواب ونوافذ',  description:'أبواب خشبية مصمتة ومزخرفة بأحدث التصاميم' },
  { _id:'4', icon:'🎨', name:'ديكور داخلي',   description:'ألواح خشبية للجدران، أسقف، إطارات زخرفية' },
  { _id:'5', icon:'🔧', name:'صيانة وترميم',  description:'إصلاح وتجديد الأثاث القديم بأسعار مناسبة' },
  { _id:'6', icon:'📐', name:'تصميم مخصص',    description:'تنفيذ أي تصميم حسب رغبة العميل بدقة عالية' },
];

export default function HomePage() {
  const { data: settings, isLoading } = useSettings();
  const { data: services = DEFAULT_SERVICES } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data),
  });
  const trackWA = useTrackWA();

  if (isLoading) return <PageLoader />;

  const waNum = (settings?.whatsapp || '+201001234567').replace(/\D/g, '');

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-wood-dark py-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-wood-mid via-gold to-wood-mid" />

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="flex justify-center mb-6 animate-fade-down">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-cream leading-tight animate-fade-down">
            النجارة الحديثة
          </h1>
          <p className="text-gold-light/80 tracking-widest font-light mt-3 animate-fade-down">
            حرفة راسخة · جودة لا تُضاهى · نجارة وديكور
          </p>
          <div className="flex gap-3 justify-center flex-wrap mt-8 animate-fade-up">
            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer"
              onClick={() => trackWA.mutate()} className="btn-gold">
              💬 تواصل عبر واتساب
            </a>
            <Link to="/gallery" className="btn-outline">🖼️ شاهد أعمالنا</Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="bg-white border-b border-cream-dark flex justify-center">
        {[['+ ١٥','سنة خبرة'],['+ ٥٠٠','مشروع منجز'],['+ ٢٠٠','عميل راضٍ'],['٢٤/٧','دعم مستمر']].map(([n,l]) => (
          <div key={l} className="flex-1 max-w-[220px] text-center py-5 px-4 border-l border-cream-dark last:border-l-0">
            <div className="text-2xl font-bold text-wood-dark">{n}</div>
            <div className="text-xs text-wood-warm/60 tracking-widest mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* ── SERVICES ── */}
      <section className="max-w-5xl mx-auto px-6 py-14" id="services">
        <SectionTitle>خدماتنا</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {services.map(svc => <ServiceCard key={svc._id} {...svc} />)}
        </div>
      </section>

      {/* ── CONTACT INFO ── */}
      <section className="max-w-5xl mx-auto px-6 pb-10" id="contact">
        <SectionTitle>تواصل معنا</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-0">
          {/* Left: contact details */}
          <div className="bg-white border border-cream-dark rounded-xl sm:rounded-l-xl sm:rounded-r-none p-8">
            <h3 className="font-bold text-wood-dark mb-5 pb-3 border-b border-cream-dark">📋 بيانات التواصل</h3>
            <div className="space-y-4">
              {settings?.phone    && <ContactItem icon="📞" label="الهاتف"            value={settings.phone}    href={`tel:${settings.phone}`} />}
              {settings?.whatsapp && <ContactItem icon="💬" label="واتساب"            value={settings.whatsapp} href={`https://wa.me/${waNum}`} />}
              {settings?.email    && <ContactItem icon="✉️" label="البريد الإلكتروني" value={settings.email}    href={`mailto:${settings.email}`} />}
              {settings?.address  && <ContactItem icon="📍" label="العنوان"            value={settings.address} />}
            </div>
            <div className="mt-5 rounded-lg overflow-hidden border border-cream-dark h-36">
              <iframe src={process.env.REACT_APP_MAPS_URL} title="الموقع"
                className="w-full h-full border-0" loading="lazy" />
            </div>
          </div>

          {/* Right: hours + social */}
          <div className="bg-wood-dark rounded-xl sm:rounded-r-xl sm:rounded-l-none p-8">
            <h3 className="font-bold text-gold-light mb-5 pb-3 border-b border-white/10">🕐 مواعيد العمل</h3>
            <table className="w-full text-sm">
              <tbody>
                {settings?.hours?.map((h, i) => (
                  <tr key={i} className="border-b border-white/[.07] last:border-none">
                    <td className="py-1.5 text-cream/80">{h.day}</td>
                    <td className="py-1.5 text-gold-light text-left">
                      {h.closed
                        ? <span className="bg-gold text-wood-dark text-xs font-bold px-2 py-0.5 rounded-full">مغلق</span>
                        : `${h.open} – ${h.close}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {settings?.social && (
              <div className="mt-5">
                <p className="text-gold text-xs font-bold tracking-widest mb-2">تابعنا على</p>
                <div className="flex gap-2 flex-wrap">
                  {[['facebook','📘','فيسبوك'],['instagram','📸','إنستغرام'],['youtube','▶','يوتيوب'],['twitter','🐦','تويتر']].map(([k,ic,lb]) =>
                    settings.social[k] && settings.social[k] !== '#' ? (
                      <a key={k} href={settings.social[k]} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-cream text-xs px-3 py-1.5 rounded-lg hover:bg-gold hover:text-wood-dark hover:border-gold transition-all">
                        {ic} {lb}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {settings?.note && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-gold text-xs font-bold tracking-widest mb-2">ملاحظة</p>
                <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-line">{settings.note}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-wood-dark rounded-2xl p-8 md:p-10">
          <div className="max-w-lg mx-auto">
            <h2 className="text-gold-light text-xl font-bold mb-1 text-center">📨 أرسل لنا رسالة</h2>
            <p className="text-cream/50 text-sm text-center mb-6 tracking-wide">
              سنرد عليك في أقرب وقت ممكن
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
