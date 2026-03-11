'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useJobs } from '@/hooks/useJobs';
import { useCandidates } from '@/hooks/useCandidates';
import { Card, Badge, Button } from '@/components/ui';
import { JobRankingList } from '@/components/job/JobRankingList';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const { data: jobsData } = useJobs();
  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates();
  
  const [activeTab, setActiveTab] = useState('ranking');

  const jobs = jobsData?.data || [];
  const job = jobs.find((j: any) => j._id === params.id) || {
    title: "Senior React Developer",
    location: "Remote",
    description: "Looking for a seasoned React developer to join our core team.",
    requiredSkills: ["React", "TypeScript", "Tailwind", "Next.js"],
    createdAt: new Date().toISOString()
  };

  const candidates = candidatesData?.data?.candidates || [];

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">code</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{job.title}</h2>
                    <Badge variant="info" className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">location_on</span> {job.location || 'Remote'}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">schedule</span> Full-time</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">monetization_on</span> $140k - $180k</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" className="border border-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">edit</span> Edit JD
                </Button>
                <Button variant="primary">Share Job</Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('ranking')}
              className={cn("px-6 py-3 border-b-2 text-sm font-bold transition-all", activeTab === 'ranking' ? "border-primary text-primary" : "border-transparent text-slate-500")}
            >
              Candidate Ranking
            </button>
            <button 
              onClick={() => setActiveTab('jd')}
              className={cn("px-6 py-3 border-b-2 text-sm font-medium transition-all", activeTab === 'jd' ? "border-primary text-primary" : "border-transparent text-slate-500")}
            >
              Job Description
            </button>
            <button className="px-6 py-3 border-b-2 border-transparent text-slate-500 text-sm font-medium cursor-not-allowed">Analytics</button>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-primary/10 shadow-sm">
            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase">Batch Actions:</div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-match/10 text-emerald-match rounded-lg text-xs font-bold hover:bg-emerald-match/20 transition-all">
              <span className="material-symbols-outlined text-base">check_circle</span> Move to Interview
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-all">
              <span className="material-symbols-outlined text-base">cancel</span> Reject
            </button>
          </div>
        </div>

        {activeTab === 'ranking' ? (
          <div className="space-y-4">
             <JobRankingList candidates={candidates} />
             <div className="mt-8 flex items-center justify-between text-sm text-slate-500 font-medium">
               <p>Showing <span className="text-slate-900 dark:text-slate-100 font-bold">{candidates.length}</span> of <span className="text-slate-900 dark:text-slate-100 font-bold">48</span> qualified candidates</p>
               <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100">Previous</button>
                 <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100">Next</button>
               </div>
             </div>
          </div>
        ) : (
          <Card className="p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Job Description</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{job.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {job.requiredSkills.map((skill: string) => (
                   <Badge key={skill} variant="neutral">{skill}</Badge>
                 ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// Inline helper for cn because I sometimes miss it
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
