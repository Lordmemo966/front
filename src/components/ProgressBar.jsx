/**
 * Props: value (0-100), label, className
 */
export default function ProgressBar({ value = 0, label = '', className = '' }) {
  if (value <= 0) return null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-wood-warm/70">{label}</span>
          <span className="text-xs font-bold text-gold">{value}٪</span>
        </div>
      )}
      <div className="w-full bg-cream-dark rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-gold to-gold-light rounded-full transition-all duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
