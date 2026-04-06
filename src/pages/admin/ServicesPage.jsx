import { useState } from 'react';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../hooks/useServices';
import { PageLoader } from '../../components/Spinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import toast from 'react-hot-toast';

const BLANK = { icon: '🔧', name: '', description: '' };

export default function ServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const create  = useCreateService();
  const update  = useUpdateService();
  const remove  = useDeleteService();

  const [form, setForm]       = useState(BLANK);
  const [editing, setEditing] = useState(null);   // { id, icon, name, description }
  const [deleteId, setDeleteId] = useState(null);

  if (isLoading) return <PageLoader />;

  const handleCreate = () => {
    if (!form.name.trim()) return toast.error('أدخل اسم الخدمة');
    create.mutate(form, { onSuccess: () => setForm(BLANK) });
  };

  const handleUpdate = () => {
    if (!editing?.name?.trim()) return toast.error('أدخل اسم الخدمة');
    update.mutate({ id: editing._id, data: editing }, { onSuccess: () => setEditing(null) });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-dark mb-6">🔧 إدارة الخدمات</h2>

      {/* Add form */}
      <div className="card mb-6">
        <h3 className="font-bold text-wood-dark text-sm mb-4">إضافة خدمة جديدة</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="text-xs font-bold tracking-wider text-wood-warm/60 block mb-1.5">الأيقونة (emoji)</label>
            <input value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              className="input-field text-center text-2xl" maxLength={2} placeholder="🔧" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider text-wood-warm/60 block mb-1.5">اسم الخدمة</label>
            <input value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input-field" placeholder="مثال: أثاث المنازل" />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider text-wood-warm/60 block mb-1.5">الوصف</label>
            <input value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field" placeholder="وصف مختصر..." />
          </div>
        </div>
        <button onClick={handleCreate} disabled={create.isPending}
          className="btn-gold !py-2 !px-6 disabled:opacity-60">
          {create.isPending ? '…' : '+ إضافة'}
        </button>
      </div>

      {/* List */}
      <div className="card">
        <h3 className="font-bold text-wood-dark text-sm mb-4">
          الخدمات الحالية <span className="text-wood-warm/50 font-normal">({services.length})</span>
        </h3>
        {services.length === 0 ? (
          <p className="text-center text-wood-warm/40 py-10 text-sm">
            لا توجد خدمات — أضف خدمة من الأعلى.
          </p>
        ) : (
          <div className="space-y-2">
            {services.map(svc => (
              <div key={svc._id}
                className="flex items-center gap-3 border border-cream-dark rounded-xl px-4 py-3 bg-cream/50 hover:bg-cream transition-colors">
                {editing?._id === svc._id ? (
                  /* ── Inline edit ── */
                  <>
                    <input value={editing.icon}
                      onChange={e => setEditing(ed => ({ ...ed, icon: e.target.value }))}
                      className="input-field w-14 text-center text-xl" maxLength={2} />
                    <input value={editing.name}
                      onChange={e => setEditing(ed => ({ ...ed, name: e.target.value }))}
                      className="input-field flex-1" placeholder="اسم الخدمة" />
                    <input value={editing.description}
                      onChange={e => setEditing(ed => ({ ...ed, description: e.target.value }))}
                      className="input-field flex-1" placeholder="الوصف" />
                    <button onClick={handleUpdate} disabled={update.isPending}
                      className="btn-gold !py-1.5 !px-4 !text-sm disabled:opacity-60">
                      {update.isPending ? '…' : '💾 حفظ'}
                    </button>
                    <button onClick={() => setEditing(null)}
                      className="text-xs text-wood-warm/50 hover:text-wood-dark px-2">
                      إلغاء
                    </button>
                  </>
                ) : (
                  /* ── Display row ── */
                  <>
                    <span className="text-2xl w-10 text-center flex-shrink-0">{svc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-wood-dark text-sm">{svc.name}</p>
                      <p className="text-xs text-wood-warm/60 truncate">{svc.description}</p>
                    </div>
                    <button onClick={() => setEditing({ ...svc })}
                      className="flex-shrink-0 text-xs border border-cream-dark px-3 py-1.5 rounded-lg hover:border-gold text-wood-warm/70 hover:text-wood-dark transition-colors">
                      ✏️ تعديل
                    </button>
                    <button onClick={() => setDeleteId(svc._id)}
                      className="flex-shrink-0 text-xs border border-red-100 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      🗑️
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="حذف الخدمة"
        message="هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => { remove.mutate(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
