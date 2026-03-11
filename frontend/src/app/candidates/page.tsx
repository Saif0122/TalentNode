'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCandidates } from '@/hooks/useCandidates';
import { CandidateList } from '@/components/candidate/CandidateList';

export default function CandidatesPage() {
  const { data: candidatesData, isLoading } = useCandidates();
  const candidates = candidatesData?.data?.candidates || [];

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">All Candidates</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <CandidateList candidates={candidates} isLoading={isLoading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
