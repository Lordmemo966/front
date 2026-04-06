export default function Logo({ size = 'md' }) {
  const dims = { sm: 34, md: 50, lg: 90 };
  const s = dims[size] || dims.md;

  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="hc-logo">
          <polygon points="50,7 88,28 88,71 50,92 12,71 12,28" />
        </clipPath>
      </defs>
      <polygon points="50,1 94,25 94,75 50,99 6,75 6,25" fill="none" stroke="#C9A84C" strokeWidth="2.2" />
      <polygon points="50,7 88,28 88,71 50,92 12,71 12,28" fill="#1e1108" />
      <g clipPath="url(#hc-logo)" stroke="#5a3010" strokeWidth=".9" opacity=".5">
        <line x1="12" y1="40" x2="88" y2="40" />
        <line x1="10" y1="52" x2="90" y2="52" />
        <line x1="10" y1="64" x2="90" y2="64" />
      </g>
      <rect x="42" y="22" width="16" height="29" rx="3" fill="#A0522D" />
      <rect x="42" y="29" width="16" height="3"  rx=".8" fill="#6B3A1F" />
      <rect x="42" y="37" width="16" height="3"  rx=".8" fill="#6B3A1F" />
      <polygon points="42,51 58,51 62,74 38,74" fill="#E8CC7A" />
      <polygon points="42,65 58,65 62,74 38,74" fill="#C9A84C" />
      <line x1="46" y1="53" x2="46" y2="73" stroke="rgba(255,255,255,.3)" strokeWidth="1.3" />
      <polygon points="50,7 88,28 84,31 50,11 16,31 12,28" fill="#C9A84C" opacity=".7" />
    </svg>
  );
}
