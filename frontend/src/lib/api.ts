import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api', // Adjusted to 5001 based on backend logs
});

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
};

export const jobApi = {
  getAll: () => api.get('/jobs').then(res => res.data),
  create: (data: any) => api.post('/jobs', data).then(res => res.data),
};

export default api;
