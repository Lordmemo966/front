import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useGallery, useDeleteImage } from '../../hooks/useGallery';
import { useUploadProgress } from '../../hooks/useUploadProgress';
import { PageLoader } from '../../components/Spinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import ProgressBar from '../../components/ProgressBar';

export default function AdminGalleryPage() {
  const { data: images = [], isLoading } = useGallery();
  const deleteImg = useDeleteImage();
  const { upload, progress, isUploading } = useUploadProgress();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const onDrop = useCallback(files => upload(files), [upload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: 8 * 1024 * 1024,
    disabled: isUploading,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h2 className="text-xl font-bold text-wood-dark mb-6">🖼️ إدارة المعرض</h2>

      {/* Drop Zone */}
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 mb-6
          ${isUploading      ? 'border-gold/30 bg-gold/5 cursor-not-allowed'
          : isDragActive     ? 'border-gold bg-gold/10 scale-[1.01] cursor-copy'
          : 'border-gold/40 bg-gold/5 hover:border-gold hover:bg-gold/10 cursor-pointer'}`}>
        <input {...getInputProps()} />
        <div className="text-5xl mb-3 select-none">
          {isUploading ? '⏳' : isDragActive ? '📂' : '📁'}
        </div>
        <p className="font-bold text-wood-dark text-base">
          {isUploading
            ? 'جارٍ الرفع — انتظر…'
            : isDragActive
              ? 'أفلت الصور هنا'
              : 'اسحب الصور هنا أو انقر للاختيار'}
        </p>
        <p className="text-xs text-wood-warm/60 mt-1.5">
          تُرفع مباشرة إلى Cloudinary · JPG, PNG, WEBP · الحد الأقصى 8 MB للصورة
        </p>

        {/* Progress bar */}
        {isUploading && (
          <div className="mt-5 px-4">
            <ProgressBar value={progress} label="جارٍ الرفع إلى Cloudinary…" />
          </div>
        )}

        {!isUploading && (
          <div className="inline-block mt-4 btn-gold !py-2 !px-6 pointer-events-none !text-sm">
            + اختر الصور
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-wood-warm/60">
          عدد الصور:{' '}
          <strong className="text-wood-mid text-base">{images.length}</strong>
        </p>
        {images.length > 0 && (
          <p className="text-xs text-wood-warm/40">مرّر فوق الصورة للحذف أو الفتح</p>
        )}
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 text-wood-warm/40">
          <div className="text-6xl mb-4 opacity-25">🖼️</div>
          <p className="text-sm">لا توجد صور في المعرض بعد.</p>
          <p className="text-xs mt-1 opacity-70">ارفع أول صورة من المنطقة أعلاه.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map(img => (
            <div key={img._id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-cream-dark border border-cream-dark shadow-sm">
              <img src={img.url} alt={img.caption || ''} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                <a href={img.url} target="_blank" rel="noreferrer"
                  title="فتح الصورة"
                  className="w-9 h-9 bg-white/20 text-white rounded-lg flex items-center justify-center hover:bg-white/35 transition-colors">
                  🔗
                </a>
                <button onClick={() => setDeleteTarget(img._id)}
                  title="حذف الصورة"
                  className="w-9 h-9 bg-red-500/80 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                  🗑️
                </button>
              </div>

              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/65 px-2 py-1">
                  <p className="text-white text-xs truncate">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الصورة"
        message="سيتم حذف هذه الصورة من Cloudinary نهائياً ولا يمكن استعادتها."
        onConfirm={() => { deleteImg.mutate(deleteTarget); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
