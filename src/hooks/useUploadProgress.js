import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

/**
 * Like useUploadImages but reports real upload progress (0-100)
 * Usage:
 *   const { upload, progress, isUploading } = useUploadProgress();
 *   upload(files);
 */
export function useUploadProgress() {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (files) => {
    if (!files?.length) return;
    setIsUploading(true);
    setProgress(0);

    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('images', f));

    try {
      await api.post('/gallery', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1));
          setProgress(pct);
        },
      });
      qc.invalidateQueries(['gallery']);
      toast.success('تم رفع الصور ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل رفع الصور');
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return { upload, progress, isUploading };
}
