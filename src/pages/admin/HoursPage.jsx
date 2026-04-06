import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { PageLoader } from '../../components/Spinner';

const DEFAULT_HOURS = [
  { day:'السبت',    open:'09:00', close:'21:00', closed:false },
  { day:'الأحد',    open:'09:00', close:'21:00', closed:false },
  { day:'الاثنين',  open:'09:00', close:'21:00', closed:false },
  { day:'الثلاثاء', open:'09:00', close:'21:00', closed:false },
  { day:'الأربعاء', open:'09:00', close:'21:00', closed:false },
  { day:'الخميس',   open:'09:00', close:'18:00', closed:false },
  { day:'الجمعة',   open:'09:00', close:'21:00', closed:true  },
];

export default function HoursPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [hours, setHours] = useState(DEFAULT_HOURS);

  useEffect(() => {
    if (settings?.hours?.length) setHours(settings.hours);
  }, [settings]);

  const set = (i, key, val) =>
    setHours(h => h.map((row, idx) => idx === i ? { ...row, [key]: val } : row));

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-dark mb-6">🕐 مواعيد العمل</h2>

      <div className="card mb-5">
        <p className="text-xs text-wood-warm/60 mb-5">أوقف التبديل لتعيين اليوم "مغلق". التغييرات تنعكس فوراً على الموقع بعد الحفظ.</p>
        <div className="space-y-3">
          {hours.map((h, i) => (
            <div key={i} className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${h.closed ? 'bg-cream-dark/60' : 'bg-cream/60'}`}>
              {/* Day name */}
              <span className="w-20 font-bold text-wood-dark text-sm flex-shrink-0">{h.day}</span>

              {/* Time inputs */}
              {h.closed ? (
                <span className="text-wood-warm/50 italic text-sm flex-1">مغلق</span>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={h.open}  onChange={e => set(i,'open',e.target.value)}
                    className="border border-cream-dark rounded-lg px-3 py-1.5 text-sm font-tajawal bg-white outline-none focus:border-gold" />
                  <span className="text-wood-warm/50">–</span>
                  <input type="time" value={h.close} onChange={e => set(i,'close',e.target.value)}
                    className="border border-cream-dark rounded-lg px-3 py-1.5 text-sm font-tajawal bg-white outline-none focus:border-gold" />
                </div>
              )}

              {/* Toggle */}
              <label className="relative flex-shrink-0 cursor-pointer">
                <input type="checkbox" className="sr-only" checked={!h.closed}
                  onChange={e => set(i,'closed',!e.target.checked)} />
                <div className={`w-11 h-6 rounded-full transition-colors ${!h.closed ? 'bg-gold' : 'bg-gray-300'}`} />
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${!h.closed ? 'right-0.5' : 'left-0.5'}`} />
              </label>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => update.mutate({ hours })} disabled={update.isPending}
        className="btn-gold disabled:opacity-60">
        {update.isPending ? '…جارٍ الحفظ' : '💾 حفظ المواعيد'}
      </button>
    </div>
  );
}
