'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Successful login, check if user is actually an admin
        // NextAuth doesn't easily expose the user object post-signIn with redirect: false
        // but we can trust the session or just redirect and let middleware handle it.
        // To be safe, we check the session first if we want a better UX.
        router.push('/dashboard'); 
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl p-10 border border-slate-700"
      >
        <div className="text-center mb-10">
          <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Admin Terminal</h1>
          <p className="text-slate-400 font-medium">System Administrative Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="admin@talentnode.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Security Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-rose-950/20 text-rose-400 p-4 rounded-xl text-sm font-bold border border-rose-900/50">
              {error}
            </div>
          )}

          <Button 
            variant="primary" 
            type="submit"
            className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Terminal'}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 font-medium uppercase tracking-tighter">
          This connection is logged and monitored.
        </p>
      </motion.div>
    </div>
  );
}
