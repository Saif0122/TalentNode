import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

/**
 * Hook to fetch all interviews for the current recruiter
 */
export const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const response = await api.get('/scheduling/events');
      return response.data.data;
    }
  });
};

/**
 * Hook to create a new interview
 */
export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interviewData: {
      candidateId: string;
      jobId: string;
      startTime: string;
      endTime: string;
      duration: number;
      description?: string;
      meetingLink?: string;
    }) => {
      const response = await api.post('/scheduling/create', interviewData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }
  });
};

/**
 * Hook to update an interview status or time
 */
export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/scheduling/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    }
  });
};

/**
 * Hook to delete an interview
 */
export const useDeleteInterview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/scheduling/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    }
  });
};
