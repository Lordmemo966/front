/**
 * Usage:
 *   const [dialog, setDialog] = useState(null);
 *   <ConfirmDialog
 *     open={!!dialog}
 *     title="حذف الصورة"
 *     message="هل أنت متأكد من الحذف؟"
 *     onConfirm={() => { doDelete(); setDialog(null); }}
 *     onCancel={() => setDialog(null)}
 *   />
 */
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-pop-in">
        <h3 className="font-bold text-wood-dark text-lg mb-2">{title}</h3>
        <p className="text-wood-warm/70 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-cream-dark text-wood-warm/70 hover:bg-cream text-sm transition-colors">
            إلغاء
          </button>
          <button onClick={onConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-bold text-white transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-gold hover:bg-gold-light text-wood-dark'
            }`}>
            تأكيد
          </button>
        </div>
      </div>
    </div>
  );
}
