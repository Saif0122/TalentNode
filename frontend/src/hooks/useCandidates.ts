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

export const useVersions = (id: string) => {
  return useQuery({
    queryKey: ['candidate-versions', id],
    queryFn: () => candidateApi.getVersions(id),
    enabled: !!id,
  });
};

export const useCompare = (id: string, versionA: string, versionB: string) => {
  return useQuery({
    queryKey: ['candidate-compare', id, versionA, versionB],
    queryFn: () => candidateApi.compare(id, versionA, versionB),
    enabled: !!id && !!versionA && !!versionB,
  });
};
