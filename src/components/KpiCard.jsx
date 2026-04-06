export default function KpiCard({ label, value, sub, badge, color = 'border-gold', emoji }) {
  return (
    <div className={`relative bg-white rounded-xl p-5 shadow-sm border-t-4 ${color} overflow-hidden animate-fade-up`}>
      {emoji && (
        <span className="absolute bottom-0 left-2 text-5xl opacity-[.07] leading-none select-none">
          {emoji}
        </span>
      )}
      <p className="text-xs font-bold tracking-widest text-wood-warm/70 mb-2 uppercase">{label}</p>
      <p className="text-4xl font-bold text-wood-dark leading-none">{value ?? '–'}</p>
      {sub   && <p className="text-xs text-wood-warm/60 mt-1.5">{sub}</p>}
      {badge && (
        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1.5 ${badge.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          {badge.label}
        </span>
      )}
    </div>
  );
}
