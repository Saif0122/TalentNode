'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useJob, useUpdateJob } from '@/hooks/useJobs';
import { Card, Button } from '@/components/ui';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { data: jobData, isLoading } = useJob(params.id as string);
  const updateJob = useUpdateJob();
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    salaryRange: '',
    description: '',
    requiredSkills: '',
    responsibilities: '',
    benefits: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (jobData?.data) {
      const job = jobData.data;
      setFormData({
        title: job.title || '',
        department: job.department || 'General',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        salaryRange: job.salaryRange || '',
        description: job.description || '',
        requiredSkills: job.requiredSkills?.join(', ') || '',
        responsibilities: job.responsibilities?.join('\\n') || '',
        benefits: job.benefits?.join('\\n') || ''
      });
    }
  }, [jobData]);

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

    updateJob.mutate({ id: params.id as string, data: payload }, {
      onSuccess: () => {
        router.push(`/jobs/${params.id}`); 
      },
      onError: (err: any) => {
        setError(err.response?.data?.error || 'Failed to update job');
      }
    });
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex-1 flex justify-center items-center">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <nav className="flex text-xs text-slate-400 gap-2 items-center mb-2">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => router.push('/jobs')}>Jobs</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary font-medium">Edit Job</span>
          </nav>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Edit {formData.title}</h2>
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
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Description *</label>
                <textarea 
                  required rows={5}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Required Skills</label>
                <input 
                  type="text" 
                  value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Responsibilities</label>
                <textarea 
                  rows={4}
                  value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Benefits</label>
                <textarea 
                  rows={3}
                  value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={updateJob.isPending}>
                {updateJob.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
