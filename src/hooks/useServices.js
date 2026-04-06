import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/services', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries(['services']); toast.success('تمت الإضافة ✅'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'خطأ في الإضافة'),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries(['services']); toast.success('تم التحديث ✅'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'خطأ في التحديث'),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { qc.invalidateQueries(['services']); toast.success('تم الحذف'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'خطأ في الحذف'),
  });
}
