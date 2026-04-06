import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useGallery() {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: () => api.get('/gallery').then(r => r.data.data),
  });
}

export function useUploadImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files) => {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      return api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { qc.invalidateQueries(['gallery']); toast.success('تم رفع الصور ✅'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'فشل الرفع'),
  });
}

export function useDeleteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries(['gallery']); toast.success('تم حذف الصورة'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'فشل الحذف'),
  });
}
