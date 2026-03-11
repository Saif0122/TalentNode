import { useQuery } from '@tanstack/react-query';
import { candidateApi } from '@/lib/api';

export const useCandidates = (params?: any) => {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => candidateApi.getAll(params),
  });
};

export const useCandidate = (id: string) => {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidateApi.getById(id),
    enabled: !!id,
  });
};
