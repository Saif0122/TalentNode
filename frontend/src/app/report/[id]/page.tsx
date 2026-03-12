'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateProfile } from '@/components/candidate/CandidateProfile';
import { useCandidate } from '@/hooks/useCandidates';

/**
 * Adapter page for the Stitch report.
 * Loads the CandidateProfile component for a given candidate ID.
 */
export default function ReportAdapterPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, error } = useCandidate(id);

  const candidate = data?.data?.profile;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full py-8">
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-12 w-96 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-[800px] bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
              <div className="lg:col-span-5 h-[600px] bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
            </div>
          </div>
        ) : error || !candidate ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_search</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Report Not Found</h2>
            <p className="text-slate-500">We couldn't find a candidate with the provided ID.</p>
          </div>
        ) : (
          <CandidateProfile candidate={candidate} />
        )}
      </div>
    </DashboardLayout>
  );
}
