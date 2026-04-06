export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }[size];
  return (
    <div className={`${s} border-gold/30 border-t-gold rounded-full animate-spin ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
