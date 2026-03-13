import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats()
  });
};

export const useDashboardActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardApi.getActivity()
  });
};

export const useDashboardTopSkills = () => {
  return useQuery({
    queryKey: ['dashboard', 'topSkills'],
    queryFn: () => dashboardApi.getTopSkills()
  });
};

export const useDashboardConversion = () => {
  return useQuery({
    queryKey: ['dashboard', 'conversion'],
    queryFn: () => dashboardApi.getConversion()
  });
};
