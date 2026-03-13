import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: (res) => {
      // Optimistically update caches
      queryClient.setQueryData(['userProfile'], { success: true, data: res.data });
      queryClient.invalidateQueries({ queryKey: ['me'] }); // NextAuth hook fallback
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: any) => userApi.updatePassword(data),
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => userApi.updateNotifications(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
