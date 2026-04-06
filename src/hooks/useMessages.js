import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export function useMessages(page = 1) {
  return useQuery({
    queryKey: ['messages', page],
    queryFn: () => api.get(`/messages?page=${page}&limit=20`).then(r => r.data),
    refetchInterval: 60_000, // auto-refresh every minute
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries(['messages']),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/messages/${id}`),
    onSuccess: () => { qc.invalidateQueries(['messages']); toast.success('تم حذف الرسالة'); },
    onError:   ()  => toast.error('فشل الحذف'),
  });
}

export function useSendMessage() {
  return useMutation({
    mutationFn: (data) => api.post('/messages', data).then(r => r.data),
    onSuccess: () => toast.success('تم إرسال رسالتك ✅'),
    onError:   (e) => toast.error(e.response?.data?.message || 'فشل الإرسال'),
  });
}
