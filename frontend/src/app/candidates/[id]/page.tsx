'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateProfile } from '@/components/candidate/CandidateProfile';
import { useCandidate } from '@/hooks/useCandidates';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useCandidate(params.id as string);

  const candidate = data?.data?.profile;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="flex items-center gap-2 -ml-4 hover:bg-transparent text-slate-500"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to List
        </Button>
        
        {isLoading ? (
          <div className="h-96 bg-slate-100 animate-pulse rounded-2xl" />
        ) : error || !candidate ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-400">Candidate not found</h2>
          </div>
        ) : (
          <CandidateProfile candidate={candidate} />
        )}
      </div>
    </DashboardLayout>
  );
}
