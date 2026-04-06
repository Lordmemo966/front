import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return toast.error('أدخل بيانات الدخول');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wood-dark flex items-center justify-center px-4" dir="rtl">
      {/* Glow */}
      <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm bg-white/5 border border-gold/20 rounded-2xl p-10 animate-pop-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
          <h1 className="text-cream text-2xl font-bold mt-4">لوحة التحكم</h1>
          <p className="text-gold-light/70 text-xs tracking-widest mt-1">النجارة الحديثة · مدير النظام</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gold text-xs font-bold tracking-widest mb-2">اسم المستخدم</label>
            <input
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full bg-white/8 border border-white/15 rounded-lg px-4 py-3 text-cream placeholder-cream/30 font-tajawal text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-gold text-xs font-bold tracking-widest mb-2">كلمة المرور</label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-white/8 border border-white/15 rounded-lg px-4 py-3 text-cream placeholder-cream/30 font-tajawal text-sm outline-none focus:border-gold transition-colors"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full btn-gold justify-center py-3 text-base disabled:opacity-60">
            {loading ? <Spinner size="sm" /> : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
