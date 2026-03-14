import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

export const useAnalyticsOverview = () => {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  });
};

export const useAnalyticsConversion = () => {
  return useQuery({
    queryKey: ['analytics-conversion'],
    queryFn: () => analyticsApi.getConversion(),
  });
};

export const useAnalyticsTopSkills = () => {
  return useQuery({
    queryKey: ['analytics-top-skills'],
    queryFn: () => analyticsApi.getTopSkills(),
  });
};

export const useAnalyticsSources = () => {
  return useQuery({
    queryKey: ['analytics-sources'],
    queryFn: () => analyticsApi.getSources(),
  });
};

export const useAnalyticsCohorts = () => {
  return useQuery({
    queryKey: ['analytics-cohorts'],
    queryFn: () => analyticsApi.getCohorts(),
  });
};

export const useAnalyticsRolePerformance = () => {
  return useQuery({
    queryKey: ['analytics-role-performance'],
    queryFn: () => analyticsApi.getRolePerformance(),
  });
};
