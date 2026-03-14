import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useExperiments = () => {
  const queryClient = useQueryClient();

  const getExperiments = useQuery({
    queryKey: ['experiments'],
    queryFn: async () => {
      const response = await api.get('/api/experiments');
      return response.data;
    }
  });

  const getExperiment = (id: string) => useQuery({
    queryKey: ['experiments', id],
    queryFn: async () => {
      const response = await api.get(`/api/experiments/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  const getComparison = (id: string) => useQuery({
    queryKey: ['experiments', id, 'compare'],
    queryFn: async () => {
      const response = await api.get(`/api/experiments/${id}/compare`);
      return response.data;
    },
    enabled: !!id
  });

  const createExperiment = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/experiments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
    }
  });

  const runExperiment = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/api/experiments/${id}/run`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
      queryClient.invalidateQueries({ queryKey: ['experiments', id, 'compare'] });
    }
  });

  return {
    getExperiments,
    getExperiment,
    getComparison,
    createExperiment,
    runExperiment
  };
};
