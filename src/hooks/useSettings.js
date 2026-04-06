import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.put('/settings', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries(['settings']); toast.success('تم حفظ الإعدادات ✅'); },
    onError:   (e) => toast.error(e.response?.data?.message || 'خطأ في الحفظ'),
  });
}
