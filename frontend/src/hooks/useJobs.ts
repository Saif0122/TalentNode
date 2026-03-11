import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/lib/api';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobApi.getAll(),
  });
};
