'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCreateJob } from '@/hooks/useJobs';
import { Card, Button } from '@/components/ui';

export default function CreateJobPage() {
  const router = useRouter();
  const createJob = useCreateJob();
  
  const [formData, setFormData] = useState({
    title: '',
    department: 'General',
    location: '',
    employmentType: 'Full-time',
    salaryRange: '',
    description: '',
    requiredSkills: '',
    responsibilities: '',
    benefits: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      return setError('Title and Description are required.');
    }

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.split('\\n').map(s => s.trim()).filter(Boolean),
      benefits: formData.benefits.split('\\n').map(s => s.trim()).filter(Boolean),
    };

    createJob.mutate(payload, {
      onSuccess: (res) => {
        router.push(`/jobs`); // Redirect back to list
      },
      onError: (err: any) => {
        setError(err.response?.data?.error || 'Failed to create job');
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <nav className="flex text-xs text-slate-400 gap-2 items-center mb-2">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/jobs')}>Jobs</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary font-medium">Create Job</span>
          </nav>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create a New Job</h2>
          <p className="text-slate-500 mt-1">Fill out the details below to post a new job opportunity.</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title *</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  placeholder="e.g. Senior Frontend Engineer" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                <input 
                  type="text" 
                  value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                <input 
                  type="text" 
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  placeholder="e.g. Remote, New York" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Employment Type</label>
                <select 
                  value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Salary Range</label>
                <input 
                  type="text" 
                  value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  placeholder="e.g. $100k - $120k" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Description *</label>
                <textarea 
                  required rows={5}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  placeholder="Describe the role..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Required Skills</label>
                <input 
                  type="text" 
                  value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  placeholder="Comma separated: React, Node.js, TypeScript" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Responsibilities (One per line)</label>
                <textarea 
                  rows={4}
                  value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Benefits (One per line)</label>
                <textarea 
                  rows={3}
                  value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={createJob.isPending}>
                {createJob.isPending ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
