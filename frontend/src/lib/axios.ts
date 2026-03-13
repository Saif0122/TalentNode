import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach NextAuth session token for backend auth
api.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    const token = (session?.user as any)?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('[Axios Interceptor] Error fetching session:', error);
  }
  return config;
});

export default api;
