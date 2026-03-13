'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useJob, useDeleteJob } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { useCandidates } from '@/hooks/useCandidates';
import { Card, Badge, Button } from '@/components/ui';
import { JobRankingList } from '@/components/job/JobRankingList';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const { data: jobData, isLoading: jobLoading } = useJob(params.id as string);
  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates();
  const deleteJob = useDeleteJob();
  
  const [activeTab, setActiveTab] = useState('jd');

  const isRecruiter = user?.role === 'admin' || user?.role === 'recruiter';
  
  const job = jobData?.data;
  const candidates = candidatesData?.data?.candidates || [];

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job completely? This action cannot be undone.')) {
      deleteJob.mutate(params.id as string, {
        onSuccess: () => router.push('/jobs')
      });
    }
  };

  if (jobLoading) return (
    <DashboardLayout>
      <div className="flex-1 flex justify-center items-center">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  if (!job) return (
    <DashboardLayout>
      <div className="p-8 text-center text-slate-500">Job not found or you do not have permission to view it.</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="mb-8">
          <nav className="flex items-center text-sm font-medium text-slate-500 gap-2 mb-4">
            <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100">{job.title}</span>
          </nav>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-3xl">domain</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h2>
                    <Badge variant="info" className={cn(
                       job.status === 'published' ? "bg-emerald-100 text-emerald-700" :
                       job.status === 'archived' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
                    )}>
                      {job.status?.toUpperCase() || 'PUBLISHED'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">location_on</span> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> {job.employmentType || 'Full-time'}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">monetization_on</span> {job.salaryRange || 'Competitive'}</span>
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">corporate_fare</span> {job.department || 'General'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                {isRecruiter ? (
                  <>
                    <Link href={`/jobs/${job._id}/edit`}>
                      <Button variant="ghost" className="border border-slate-200 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">edit</span> Edit Job
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleDelete} className="border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-2" disabled={deleteJob.isPending}>
                       {deleteJob.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </>
                ) : (
                  <Button variant="primary">Apply Now</Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('jd')}
              className={cn("px-6 py-3 border-b-2 text-sm font-bold transition-all", activeTab === 'jd' ? "border-primary text-primary" : "border-transparent text-slate-500")}
            >
              Job Description
            </button>
            {isRecruiter && (
              <button 
                onClick={() => setActiveTab('ranking')}
                className={cn("px-6 py-3 border-b-2 text-sm font-medium transition-all", activeTab === 'ranking' ? "border-primary text-primary" : "border-transparent text-slate-500")}
              >
                Candidate Match Setup
              </button>
            )}
          </div>
        </div>

        {activeTab === 'ranking' && isRecruiter ? (
          <div className="space-y-4">
             <JobRankingList candidates={candidates} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">About the Role</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
                
                {job.responsibilities?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Key Responsibilities</h3>
                    <ul className="space-y-3">
                      {job.responsibilities.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                           <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">check_circle</span>
                           <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {job.benefits?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Perks & Benefits</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.benefits.map((benefit: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
                           <span className="material-symbols-outlined text-slate-400 text-lg">star</span>
                           <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
            
            <div className="space-y-6 top-8 sticky">
              <Card className="p-6 border border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10">
                 <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Required Skills</h3>
                 <p className="text-xs text-slate-500 mb-4">Competencies verified by our parsing engine.</p>
                 <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill: string) => (
                      <Badge key={skill} variant="neutral" className="bg-white/60 dark:bg-slate-800 shadow-sm border-slate-200">{skill}</Badge>
                    ))}
                 </div>
              </Card>
              
              <div className="text-center text-xs text-slate-400">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
                {job.postedBy && <div>by {job.postedBy.name}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
