import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useStats } from '../hooks/useStats';
import KpiCard from '../components/KpiCard';
import SectionTitle from '../components/SectionTitle';
import { PageLoader } from '../components/Spinner';
import api from '../utils/api';

const PERIODS = [
  { label: '٧ أيام',  value: 7   },
  { label: '٣٠ يوم', value: 30  },
  { label: '٣ أشهر', value: 90  },
  { label: 'الكل',   value: 999 },
];

const PIE_COLORS = ['#C9A84C','#2471a3','#7d3c98','#27ae60','#e67e22'];

const PAGE_NAMES = { home: 'الرئيسية', gallery: 'المعرض', admin: 'التحكم', stats: 'الإحصائيات' };

function toAr(n) { return (n ?? 0).toLocaleString('ar-EG'); }

export default function StatsPage() {
  const [days, setDays] = useState(30);
  const { data, isLoading, refetch } = useStats(days);

  const handleClear = async () => {
    if (!window.confirm('هل تريد مسح جميع بيانات الإحصائيات؟')) return;
    await api.delete('/stats');
    refetch();
  };

  if (isLoading) return <PageLoader />;

  const { daily = [], totals = {}, activeDays = 0 } = data || {};

  const chartData = daily.map(d => ({
    date: new Date(d.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
    زيارات: d.total,
  }));

  const pagesData = Object.entries(totals.pages || {})
    .map(([k, v]) => ({ name: PAGE_NAMES[k] || k, value: v }))
    .filter(d => d.value > 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <SectionTitle>إحصائيات الموقع</SectionTitle>

      {/* Period filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-wood-warm/60">الفترة:</span>
        {PERIODS.map(p => (
          <button key={p.value} onClick={() => setDays(p.value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
              days === p.value
                ? 'bg-gold text-wood-dark border-gold font-bold'
                : 'bg-white border-cream-dark text-wood-warm/70 hover:border-gold'
            }`}>
            {p.label}
          </button>
        ))}
        <button onClick={handleClear}
          className="mr-auto text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          🗑️ مسح الكل
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard label="إجمالي الزيارات"   value={toAr(totals.total)}        emoji="👁"  color="border-gold"   />
        <KpiCard label="زيارات الرئيسية"   value={toAr(totals.pages?.home)}   emoji="🏠"  color="border-blue-500"   />
        <KpiCard label="زيارات المعرض"     value={toAr(totals.pages?.gallery)} emoji="🖼"  color="border-purple-500" />
        <KpiCard label="نقرات واتساب"      value={toAr(totals.waClicks)}      emoji="💬"  color="border-green-500"  />
        <KpiCard label="أيام النشاط"       value={toAr(activeDays)}           emoji="📅"  color="border-orange-400" />
        <KpiCard label="جلسات التحكم"      value={toAr(totals.pages?.admin)}  emoji="⚙"  color="border-wood-warm"  />
      </div>

      {/* Charts row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {/* Line chart */}
        <div className="sm:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
          <h3 className="font-bold text-wood-dark text-sm mb-1">الزيارات اليومية</h3>
          <p className="text-xs text-wood-warm/60 mb-4">عدد الزيارات المسجلة يومياً</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE0C8" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Tajawal' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'Tajawal' }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontFamily: 'Tajawal', fontSize: 12 }} />
                <Line type="monotone" dataKey="زيارات" stroke="#C9A84C" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-wood-warm/40 text-sm">
              لا توجد بيانات لعرضها بعد
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark">
          <h3 className="font-bold text-wood-dark text-sm mb-1">توزيع الصفحات</h3>
          <p className="text-xs text-wood-warm/60 mb-4">نسبة زيارات كل صفحة</p>
          {pagesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pagesData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                  paddingAngle={3} dataKey="value">
                  {pagesData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={10} formatter={v => <span style={{ fontFamily: 'Tajawal', fontSize: 11 }}>{v}</span>} />
                <Tooltip contentStyle={{ fontFamily: 'Tajawal', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-wood-warm/40 text-sm">لا توجد بيانات</div>
          )}
        </div>
      </div>

      {/* Daily log table */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark mb-6">
        <h3 className="font-bold text-wood-dark text-sm mb-4">📅 سجل الأيام الأخيرة</h3>
        {daily.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-cream-dark">
                <th className="text-right py-2 px-3 text-xs font-bold tracking-widest text-wood-warm/60">التاريخ</th>
                <th className="text-right py-2 px-3 text-xs font-bold tracking-widest text-wood-warm/60">الزيارات</th>
                <th className="text-right py-2 px-3 text-xs font-bold tracking-widest text-wood-warm/60">واتساب</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...daily].reverse().slice(0, 14).map(d => {
                const max = Math.max(...daily.map(x => x.total), 1);
                return (
                  <tr key={d.date} className="border-b border-cream-dark hover:bg-gold/5">
                    <td className="py-2 px-3 text-wood-warm/80">
                      {new Date(d.date).toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-2 px-3 font-bold">{toAr(d.total)}</td>
                    <td className="py-2 px-3 text-green-600">{toAr(d.waClicks)}</td>
                    <td className="py-2 px-3 w-24">
                      <div className="bg-cream-dark rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-gold to-gold-light rounded-full" style={{ width: `${(d.total / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-wood-warm/40 py-8 text-sm">
            لا توجد إحصائيات مسجلة — تصفح الصفحات لتبدأ البيانات بالظهور هنا.
          </p>
        )}
      </div>
    </div>
  );
}
