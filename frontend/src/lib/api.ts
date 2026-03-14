import customApi from './axios';

const api = customApi;

// Centralized error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export const candidateApi = {
  getAll: (params?: any) => api.get('/candidates', { params }).then(res => res.data),
  getById: (id: string) => api.get(`/candidates/${id}`).then(res => res.data),
  upload: (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => 
    api.post('/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }).then(res => res.data),
  getVersions: (id: string) => api.get(`/candidates/${id}/versions`).then(res => res.data),
  getVersionById: (id: string, versionId: string) => api.get(`/candidates/${id}/versions/${versionId}`).then(res => res.data),
  compare: (id: string, versionA: string, versionB: string) => 
    api.post(`/candidates/${id}/compare`, { versionA, versionB }).then(res => res.data),
};

export const jobApi = {
  getAll: () => api.get('/jobs').then(res => res.data),
  create: (data: any) => api.post('/jobs', data).then(res => res.data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then(res => res.data),
  getActivity: () => api.get('/dashboard/activity').then(res => res.data),
  getTopSkills: () => api.get('/dashboard/top-skills').then(res => res.data),
  getConversion: () => api.get('/dashboard/conversion').then(res => res.data),
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications').then(res => res.data),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`).then(res => res.data),
  markAllAsRead: () => api.put('/notifications/read-all').then(res => res.data),
};

export const userApi = {
  getProfile: () => api.get('/users/me').then(res => res.data),
  updateProfile: (data: any) => api.patch('/users/me', data).then(res => res.data),
  updatePassword: (data: any) => api.patch('/users/password', data).then(res => res.data),
  updateNotifications: (data: any) => api.patch('/users/notifications', data).then(res => res.data),
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview').then(res => res.data),
  getConversion: () => api.get('/analytics/conversion').then(res => res.data),
  getTopSkills: () => api.get('/analytics/top-skills').then(res => res.data),
  getSources: () => api.get('/analytics/sources').then(res => res.data),
  getCohorts: () => api.get('/analytics/cohorts').then(res => res.data),
  getRolePerformance: () => api.get('/analytics/role-performance').then(res => res.data),
};

export default api;
