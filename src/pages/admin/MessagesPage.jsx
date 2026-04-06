import { useState } from 'react';
import { useMessages, useMarkRead, useDeleteMessage } from '../../hooks/useMessages';
import { PageLoader } from '../../components/Spinner';
import ConfirmDialog from '../../components/ConfirmDialog';

function formatDate(iso) {
  return new Date(iso).toLocaleString('ar-EG', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMessages(page);
  const markRead   = useMarkRead();
  const deleteMsg  = useDeleteMessage();
  const [selected, setSelected]   = useState(null);  // message object for detail view
  const [deleteId, setDeleteId]   = useState(null);

  if (isLoading) return <PageLoader />;

  const { data: messages = [], total = 0, unread = 0 } = data || {};
  const totalPages = Math.ceil(total / 20);

  const openMessage = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead.mutate(msg._id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-wood-dark">
          📨 صندوق الرسائل
        </h2>
        {unread > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {unread} غير مقروءة
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 text-wood-warm/40">
          <div className="text-5xl mb-3 opacity-25">📭</div>
          <p className="text-sm">لا توجد رسائل بعد.</p>
          <p className="text-xs mt-1 opacity-70">ستظهر رسائل نموذج التواصل هنا.</p>
        </div>
      ) : (
        <>
          {/* Message list */}
          <div className="space-y-2 mb-6">
            {messages.map(msg => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`flex items-start gap-4 border rounded-xl px-4 py-3.5 cursor-pointer transition-all hover:border-gold/50 hover:shadow-sm
                  ${!msg.read
                    ? 'border-gold/30 bg-gold/5 font-semibold'
                    : 'border-cream-dark bg-white'
                  }`}
              >
                {/* Unread dot */}
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-gold' : 'bg-transparent'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className={`text-sm ${!msg.read ? 'text-wood-dark font-bold' : 'text-wood-dark/80'}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-wood-warm/50 flex-shrink-0">{formatDate(msg.createdAt)}</p>
                  </div>
                  <p className="text-xs text-wood-warm/60 mt-0.5">{msg.phone}</p>
                  <p className="text-xs text-wood-warm/70 mt-1 truncate">{msg.message}</p>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); setDeleteId(msg._id); }}
                  className="flex-shrink-0 text-red-300 hover:text-red-500 transition-colors p-1"
                  title="حذف">
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-cream-dark rounded-lg text-sm text-wood-warm/70 disabled:opacity-40 hover:border-gold transition-colors">
                ‹ السابق
              </button>
              <span className="text-sm text-wood-warm/60">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 border border-cream-dark rounded-lg text-sm text-wood-warm/70 disabled:opacity-40 hover:border-gold transition-colors">
                التالي ›
              </button>
            </div>
          )}
        </>
      )}

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" dir="rtl"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full animate-pop-in"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-wood-dark text-lg">{selected.name}</h3>
                <p className="text-xs text-wood-warm/60 mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-wood-warm/40 hover:text-wood-dark text-xl leading-none">✕</button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 bg-cream rounded-lg px-3 py-2">
                <span className="text-lg">📞</span>
                <a href={`tel:${selected.phone}`} className="text-sm font-medium text-wood-dark hover:text-gold">
                  {selected.phone}
                </a>
              </div>
              {selected.email && (
                <div className="flex items-center gap-3 bg-cream rounded-lg px-3 py-2">
                  <span className="text-lg">✉️</span>
                  <a href={`mailto:${selected.email}`} className="text-sm text-wood-dark hover:text-gold">
                    {selected.email}
                  </a>
                </div>
              )}
              <div className="bg-cream rounded-lg px-4 py-3">
                <p className="text-xs font-bold tracking-wider text-wood-warm/60 mb-2">الرسالة</p>
                <p className="text-sm text-wood-dark leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>

            {/* Quick reply buttons */}
            <div className="flex gap-3 flex-wrap">
              <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`}
                target="_blank" rel="noreferrer"
                className="btn-gold !py-2 !px-4 !text-sm">
                💬 رد عبر واتساب
              </a>
              {selected.email && (
                <a href={`mailto:${selected.email}`}
                  className="btn-dark !py-2 !px-4 !text-sm">
                  ✉️ رد بالبريد
                </a>
              )}
              <button onClick={() => { setDeleteId(selected._id); setSelected(null); }}
                className="mr-auto text-xs border border-red-100 px-4 py-2 rounded-lg text-red-400 hover:bg-red-50">
                🗑️ حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        title="حذف الرسالة"
        message="هل أنت متأكد من حذف هذه الرسالة نهائياً؟"
        onConfirm={() => { deleteMsg.mutate(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
