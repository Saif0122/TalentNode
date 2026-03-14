'use client';

import React, { use } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CompareView } from '@/components/candidate/CompareView';
import { Button } from '@/components/ui';
import { useCandidate } from '@/hooks/useCandidates';

export default function ComparePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = params.id as string;
  const vA = searchParams.get('vA') || '';
  const vB = searchParams.get('vB') || '';

  const { data: candidateData } = useCandidate(id);
  const candidate = candidateData?.data?.profile;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                Back to Report
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 dark:text-white font-black">Compare Versions</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.03em]">
                Side-by-Side Comparison
              </h1>
              <p className="text-slate-500 font-bold text-sm tracking-tight">
                Comparing history for <span className="text-primary font-black">{candidate?.name || 'Candidate'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => router.push(`/report/${id}`)}
              className="h-10 px-4 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider group bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none hover:bg-slate-200"
            >
              Close Comparison
            </Button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-12 shadow-2xl">
          <CompareView candidateId={id} versionA={vA} versionB={vB} />
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-8">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
             TalentNode Versioning System • Artificial Intelligence Comparison
           </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
