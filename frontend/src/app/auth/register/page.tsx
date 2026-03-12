'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import axios from 'axios';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/register`, formData);
      if (res.data.status === 'success') {
        router.push('/auth/login?registered=true');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-10 border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Join TalentNode</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">AI-powered recruitment at your fingertips</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'candidate' }))}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                formData.role === 'candidate' 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
              )}
            >
              <span className="material-symbols-outlined text-3xl">resume</span>
              <span className="text-xs font-black uppercase tracking-widest">Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'recruiter' }))}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                formData.role === 'recruiter' 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
              )}
            >
              <span className="material-symbols-outlined text-3xl">work</span>
              <span className="text-xs font-black uppercase tracking-widest">Recruiter</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="Alex Rivera"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="alex@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="Min 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-sm font-bold border border-rose-100 dark:border-rose-900/50">
              {error}
            </div>
          )}

          <Button 
            variant="primary" 
            type="submit"
            className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500 font-medium">
          Already have an account? <a href="/auth/login" className="text-primary font-bold hover:underline">Log in</a>
        </p>
      </motion.div>
    </div>
  );
}
