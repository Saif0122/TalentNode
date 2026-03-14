import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { experimentApi } from '@/lib/api';

export const useExperiments = () => {
  const queryClient = useQueryClient();

  const getExperiments = useQuery({
    queryKey: ['experiments'],
    queryFn: () => experimentApi.getAll()
  });

  const getExperiment = (id: string) => useQuery({
    queryKey: ['experiments', id],
    queryFn: () => experimentApi.getById(id),
    enabled: !!id
  });

  const getComparison = (id: string) => useQuery({
    queryKey: ['experiments', id, 'compare'],
    queryFn: () => experimentApi.getComparison(id),
    enabled: !!id
  });

  const createExperiment = useMutation({
    mutationFn: (data: any) => experimentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
    }
  });

  const runExperiment = useMutation({
    mutationFn: (id: string) => experimentApi.run(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['experiments'] });
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
