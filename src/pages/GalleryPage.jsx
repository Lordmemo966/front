import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { useGallery, useUploadImages, useDeleteImage } from '../hooks/useGallery';
import { PageLoader } from '../components/Spinner';
import SectionTitle from '../components/SectionTitle';

function Lightbox({ images, index, onClose, onNav }) {
  if (index === null) return null;
  const img = images[index];
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-4 p-5"
      onClick={onClose}>
      <button className="absolute top-4 left-4 w-10 h-10 bg-white/10 border border-white/20 text-white rounded-lg flex items-center justify-center hover:bg-white/20 z-10"
        onClick={onClose}>✕</button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/20 text-white text-xl rounded-lg flex items-center justify-center hover:bg-white/20"
        onClick={e => { e.stopPropagation(); onNav(-1); }}>›</button>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 border border-white/20 text-white text-xl rounded-lg flex items-center justify-center hover:bg-white/20"
        onClick={e => { e.stopPropagation(); onNav(1); }}>‹</button>
      <img src={img.url} alt={img.caption || ''} onClick={e => e.stopPropagation()}
        className="max-w-[90vw] max-h-[78vh] rounded-lg object-contain shadow-2xl animate-pop-in" />
      {img.caption && <p className="text-gold-light text-sm tracking-wider">{img.caption}</p>}
      <p className="text-white/40 text-xs">{index + 1} / {images.length}</p>
    </div>
  );
}

function DropZone({ onDrop, isLoading }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: true,
  });
  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-6
      ${isDragActive ? 'border-gold bg-gold/10 -translate-y-1' : 'border-gold/50 bg-gold/5 hover:bg-gold/10 hover:border-gold'}`}>
      <input {...getInputProps()} />
      <div className="text-5xl mb-3">📁</div>
      <p className="font-bold text-wood-dark mb-1">{isDragActive ? 'أفلت الصور هنا' : 'اسحب الصور هنا أو انقر للاختيار'}</p>
      <p className="text-sm text-wood-warm/60">يمكنك رفع أكثر من صورة دفعة واحدة</p>
      <div className={`inline-block mt-4 btn-gold !py-2 !px-6 pointer-events-none ${isLoading ? 'opacity-60' : ''}`}>
        {isLoading ? 'جارٍ الرفع…' : '+ اختر الصور'}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { isAdmin } = useAuth();
  const { data: images = [], isLoading } = useGallery();
  const upload = useUploadImages();
  const deleteImg = useDeleteImage();
  const [lbIndex, setLbIndex] = useState(null);

  const onDrop = useCallback(files => upload.mutate(files), [upload]);

  const navLb = (dir) =>
    setLbIndex(i => (i + dir + images.length) % images.length);

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <SectionTitle>معرض الأعمال</SectionTitle>

      {/* Upload zone — admin only */}
      {isAdmin && <DropZone onDrop={onDrop} isLoading={upload.isPending} />}

      {/* Count bar */}
      {images.length > 0 && (
        <p className="text-sm text-wood-warm/60 mb-5">
          عدد الصور: <strong className="text-wood-mid">{images.length}</strong>
        </p>
      )}

      {/* Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 text-wood-warm/50">
          <div className="text-6xl mb-4 opacity-30">🖼️</div>
          <p>لم تُضَف صور بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden bg-cream-dark shadow-sm cursor-pointer animate-pop-in"
              onClick={() => setLbIndex(idx)}>
              <img src={img.url} alt={img.caption} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
                {img.caption && <span className="text-cream text-xs truncate max-w-[70%]">{img.caption}</span>}
                {isAdmin && (
                  <button onClick={e => { e.stopPropagation(); if (window.confirm('حذف هذه الصورة؟')) deleteImg.mutate(img._id); }}
                    className="w-7 h-7 bg-red-600/80 text-white rounded-md flex items-center justify-center text-xs hover:bg-red-600 flex-shrink-0">
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox images={images} index={lbIndex} onClose={() => setLbIndex(null)} onNav={navLb} />
    </div>
  );
}
