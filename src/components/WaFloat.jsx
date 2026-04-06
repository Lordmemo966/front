import { useTrackWA } from '../hooks/useStats';

export default function WaFloat({ phone = '+201001234567' }) {
  const trackWA = useTrackWA();
  const num = phone.replace(/\D/g, '');

  return (
    <a
      href={`https://wa.me/${num}`}
      target="_blank" rel="noreferrer"
      onClick={() => trackWA.mutate()}
      title="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] rounded-full
                 flex items-center justify-center shadow-lg animate-pulse-wa
                 hover:scale-110 transition-transform duration-200">
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.65 4.73 1.78 6.72L2 30l7.5-1.74A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm6.23 19.4c-.34-.17-2-.99-2.31-1.1-.31-.11-.54-.17-.76.17-.23.34-.88 1.1-1.08 1.32-.2.23-.39.26-.73.09-.34-.17-1.43-.53-2.73-1.68-1.01-.9-1.69-2.01-1.89-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.39.51-.59.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.76-1.84-1.04-2.52-.27-.66-.55-.57-.76-.58l-.64-.01c-.23 0-.6.09-.91.43-.31.34-1.19 1.16-1.19 2.83s1.22 3.28 1.39 3.51c.17.23 2.4 3.67 5.82 5.14.81.35 1.44.56 1.93.71.81.26 1.55.22 2.13.13.65-.1 2-.82 2.28-1.61.28-.79.28-1.47.2-1.61-.09-.14-.31-.23-.65-.4z"/>
      </svg>
    </a>
  );
}
