import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../utils/api';

export function useStats(days = 30) {
  return useQuery({
    queryKey: ['stats', days],
    queryFn:  () => api.get(`/stats?days=${days}`).then(r => r.data.data),
    refetchInterval: 30_000,
  });
}

export function useTrackVisit() {
  return useMutation({
    mutationFn: (page) => api.post('/stats/track', { page }),
  });
}

export function useTrackWA() {
  return useMutation({
    mutationFn: () => api.post('/stats/wa'),
  });
}
