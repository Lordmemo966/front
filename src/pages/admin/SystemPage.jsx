import { useState } from 'react';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { PageLoader } from '../../components/Spinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-cream-dark last:border-none">
      <div>
        <p className="font-semibold text-wood-dark text-sm">{label}</p>
        <p className="text-xs text-wood-warm/60 mt-0.5">{description}</p>
      </div>
      <label className="relative cursor-pointer flex-shrink-0 ml-4">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-gray-300'}`} />
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </label>
    </div>
  );
}

export default function SystemPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  if (isLoading) return <PageLoader />;

  const handleMaintenance = (val) => update.mutate({ maintenance: val });

  const handleChangePass = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword) return toast.error('أدخل جميع الحقول');
    if (pwForm.newPassword.length < 6) return toast.error('كلمة المرور الجديدة قصيرة جداً');
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('كلمة المرور غير متطابقة');
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
      toast.success('تم تغيير كلمة المرور ✅');
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'خطأ');
    } finally {
      setPwLoading(false);
    }
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `najara-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('تم التصدير');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-wood-dark">⚙️ إعدادات النظام</h2>

      {/* Toggles */}
      <div className="card">
        <h3 className="font-bold text-wood-dark text-sm mb-4">إعدادات عامة</h3>
        <Toggle
          label="وضع الصيانة"
          description="يُخفي الموقع ويعرض رسالة للزوار حتى ترفعه"
          checked={!!settings?.maintenance}
          onChange={handleMaintenance}
        />
      </div>

      {/* Change password */}
      <div className="card">
        <h3 className="font-bold text-wood-dark text-sm mb-1">تغيير كلمة المرور</h3>
        <p className="text-xs text-wood-warm/60 mb-4">كلمة المرور الجديدة يجب ألا تقل عن ٦ أحرف.</p>
        <div className="space-y-3">
          {[
            ['oldPassword', 'كلمة المرور الحالية'],
            ['newPassword', 'كلمة المرور الجديدة'],
            ['confirm',     'تأكيد كلمة المرور الجديدة'],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="block text-xs font-bold tracking-wider text-wood-warm/60 mb-1">{label}</label>
              <input type="password" value={pwForm[k]}
                onChange={e => setPwForm(f => ({ ...f, [k]: e.target.value }))}
                className="input-field" placeholder="••••••••" />
            </div>
          ))}
          <button onClick={handleChangePass} disabled={pwLoading}
            className="btn-gold disabled:opacity-60">
            {pwLoading ? '…' : '🔐 تحديث كلمة المرور'}
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="card">
        <h3 className="font-bold text-wood-dark text-sm mb-1">النسخ الاحتياطي</h3>
        <p className="text-xs text-wood-warm/60 mb-4">تصدير إعدادات الموقع الحالية كملف JSON.</p>
        <button onClick={exportSettings} className="btn-gold">⬇️ تصدير الإعدادات</button>
      </div>
    </div>
  );
}
