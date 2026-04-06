import { useForm } from 'react-hook-form';
import { useSendMessage } from '../hooks/useMessages';
import Spinner from './Spinner';

export default function ContactForm() {
  const send = useSendMessage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await send.mutateAsync(data);
      reset();
    } catch {
      // error toast shown by hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" dir="rtl">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold tracking-widest text-gold mb-1.5">
            الاسم <span className="text-red-400">*</span>
          </label>
          <input
            {...register('name', { required: 'الاسم مطلوب' })}
            placeholder="اسمك الكريم"
            className={`w-full bg-white/8 border rounded-lg px-4 py-2.5 text-cream placeholder-cream/30 font-tajawal text-sm outline-none transition-colors
              ${errors.name ? 'border-red-400' : 'border-white/15 focus:border-gold'}`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold tracking-widest text-gold mb-1.5">
            رقم الهاتف <span className="text-red-400">*</span>
          </label>
          <input
            {...register('phone', {
              required: 'رقم الهاتف مطلوب',
              pattern: { value: /^[0-9+\s()-]{7,}$/, message: 'رقم هاتف غير صالح' },
            })}
            placeholder="+20 100 000 0000"
            type="tel"
            className={`w-full bg-white/8 border rounded-lg px-4 py-2.5 text-cream placeholder-cream/30 font-tajawal text-sm outline-none transition-colors
              ${errors.phone ? 'border-red-400' : 'border-white/15 focus:border-gold'}`}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Email (optional) */}
      <div>
        <label className="block text-xs font-bold tracking-widest text-gold mb-1.5">
          البريد الإلكتروني <span className="text-white/30">(اختياري)</span>
        </label>
        <input
          {...register('email', {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'بريد إلكتروني غير صالح' },
          })}
          placeholder="example@email.com"
          type="email"
          className={`w-full bg-white/8 border rounded-lg px-4 py-2.5 text-cream placeholder-cream/30 font-tajawal text-sm outline-none transition-colors
            ${errors.email ? 'border-red-400' : 'border-white/15 focus:border-gold'}`}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-bold tracking-widest text-gold mb-1.5">
          رسالتك <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('message', {
            required: 'الرسالة مطلوبة',
            minLength: { value: 10, message: 'الرسالة قصيرة جداً' },
          })}
          rows={4}
          placeholder="اكتب رسالتك هنا... (نوع الخدمة المطلوبة، التفاصيل، المنطقة...)"
          className={`w-full bg-white/8 border rounded-lg px-4 py-2.5 text-cream placeholder-cream/30 font-tajawal text-sm outline-none transition-colors resize-none
            ${errors.message ? 'border-red-400' : 'border-white/15 focus:border-gold'}`}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={send.isPending}
        className="w-full btn-gold justify-center py-3 disabled:opacity-60">
        {send.isPending
          ? <><Spinner size="sm" /> جارٍ الإرسال…</>
          : '📨 إرسال الرسالة'}
      </button>
    </form>
  );
}
