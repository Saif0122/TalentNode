'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui';
import { JobList } from '@/components/job/JobList';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';

export default function JobsPage() {
  const { data: jobsData, isLoading } = useJobs();
  const { user } = useAuth();
  
  const isRecruiter = user?.role === 'admin' || user?.role === 'recruiter';

  // Only show active jobs to non-recruiters
  let jobs = jobsData?.data || [];
  if (!isRecruiter) {
    jobs = jobs.filter((j: any) => j.status === 'published' || j.status == null); // keep old ones null safe
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <nav className="flex text-xs text-slate-400 gap-2 items-center mb-2">
                    <span>{isRecruiter ? 'Recruiter Portal' : 'Candidate Portal'}</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary font-medium">Jobs</span>
                </nav>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Job Postings</h2>
                <p className="text-slate-500">{isRecruiter ? 'Manage and create new job opportunities.' : 'Find your next great opportunity.'}</p>
            </div>
            
            {isRecruiter && (
              <Link href="/jobs/create">
                <Button variant="primary" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Create Job
                </Button>
              </Link>
            )}
        </div>

        <JobList jobs={jobs} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
