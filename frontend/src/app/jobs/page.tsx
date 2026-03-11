'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';
import { JobList } from '@/components/job/JobList';
import { useJobs } from '@/hooks/useJobs';

export default function JobsPage() {
  const { data: jobsData, isLoading } = useJobs();
  const jobs = jobsData?.data || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <nav className="flex text-xs text-slate-400 gap-2 items-center mb-2">
                    <span>Recruiter Portal</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary font-medium">Jobs</span>
                </nav>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Job Postings</h2>
                <p className="text-slate-500">Manage and create new job opportunities.</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                Create Job
            </Button>
        </div>

        <JobList jobs={jobs} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
}
