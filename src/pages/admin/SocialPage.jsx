import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { PageLoader } from '../../components/Spinner';

const PLATFORMS = [
  { key: 'facebook',  icon: '📘', label: 'فيسبوك',    placeholder: 'https://facebook.com/yourpage' },
  { key: 'instagram', icon: '📸', label: 'إنستغرام',  placeholder: 'https://instagram.com/yourpage' },
  { key: 'youtube',   icon: '▶️', label: 'يوتيوب',    placeholder: 'https://youtube.com/yourchannel' },
  { key: 'twitter',   icon: '🐦', label: 'تويتر / X', placeholder: 'https://x.com/yourhandle' },
];

export default function SocialPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings?.social) reset(settings.social);
  }, [settings, reset]);

  if (isLoading) return <PageLoader />;

  const onSubmit = (data) => update.mutate({ social: data });

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-dark mb-6">🌐 روابط السوشيال ميديا</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card mb-5 space-y-4">
          <p className="text-xs text-wood-warm/60 mb-2">أدخل الروابط الكاملة لصفحات المؤسسة على كل منصة. اتركها فارغة لإخفائها.</p>
          {PLATFORMS.map(p => (
            <div key={p.key} className="flex items-center gap-3">
              <span className="text-2xl w-9 text-center flex-shrink-0">{p.icon}</span>
              <div className="flex-1">
                <label className="block text-xs font-bold tracking-wider text-wood-warm/60 mb-1">{p.label}</label>
                <input {...register(p.key)} placeholder={p.placeholder} className="input-field" type="url" />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={update.isPending}
          className="btn-gold disabled:opacity-60">
          {update.isPending ? '…جارٍ الحفظ' : '💾 حفظ الروابط'}
        </button>
      </form>
    </div>
  );
}
