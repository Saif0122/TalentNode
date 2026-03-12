'use client';

import { useSession, signOut } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const { data: userProfile, isLoading, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (!session?.user?.accessToken) return null;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/me`, {
        headers: { Authorization: `Bearer ${(session.user as any).accessToken}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.accessToken,
  });

  return {
    user: userProfile || (session?.user as any),
    session,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: status === 'authenticated',
    role: userProfile?.role || (session?.user as any)?.role,
    logout: () => signOut({ callbackUrl: '/auth/login' }),
    refetch,
  };
};
