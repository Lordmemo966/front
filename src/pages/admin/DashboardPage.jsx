import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { PageLoader } from '../../components/Spinner';

function Field({ label, name, register, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest text-wood-warm/70 mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} {...register(name)}
        className="input-field" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (settings) reset({
      phone:    settings.phone    || '',
      whatsapp: settings.whatsapp || '',
      email:    settings.email    || '',
      address:  settings.address  || '',
      note:     settings.note     || '',
    });
  }, [settings, reset]);

  if (isLoading) return <PageLoader />;

  const onSubmit = (data) => update.mutate(data);

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-dark mb-6">📋 بيانات التواصل</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="card">
          <h3 className="font-bold text-wood-dark mb-1 text-sm">معلومات الاتصال</h3>
          <p className="text-xs text-wood-warm/60 mb-5">تُعرض في الصفحة الرئيسية — احفظ بعد كل تغيير.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="الهاتف"            name="phone"    register={register} placeholder="+20 100 123 4567" />
            <Field label="واتساب"            name="whatsapp" register={register} placeholder="+20 100 123 4567" />
            <Field label="البريد الإلكتروني" name="email"    register={register} placeholder="info@example.com" type="email" />
            <Field label="العنوان"            name="address"  register={register} placeholder="المنطقة، المدينة" />
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-wood-dark mb-1 text-sm">نص الملاحظة</h3>
          <p className="text-xs text-wood-warm/60 mb-4">يظهر في قسم مواعيد العمل بالصفحة الرئيسية.</p>
          <textarea {...register('note')} rows={4}
            className="input-field resize-none"
            placeholder="نص الملاحظة للزوار..." />
        </div>

        <button type="submit" disabled={update.isPending}
          className="btn-gold disabled:opacity-60">
          {update.isPending ? '…جارٍ الحفظ' : '💾 حفظ البيانات'}
        </button>
      </form>
    </div>
  );
}
