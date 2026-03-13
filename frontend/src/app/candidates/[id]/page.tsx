'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateProfile } from '@/components/candidate/CandidateProfile';
import { useCandidate } from '@/hooks/useCandidates';
import { useParams, useRouter } from 'next/navigation';
import { Button, Badge } from '@/components/ui';
import api from '@/lib/api';
import { ScheduleModal } from '@/components/scheduling/ScheduleModal';
import { cn } from '@/lib/utils';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useCandidate(params.id as string);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);

  const candidate = data?.data?.profile;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 -ml-4 hover:bg-transparent text-slate-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to List
          </Button>
          {candidate && (
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-primary/20"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Schedule Interview
              </Button>
              <Button variant="ghost" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5">
                Send Message
              </Button>
            </div>
          )}
        </div>

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

      {candidate && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          candidateId={candidate._id}
          candidateName={candidate.name}
          jobId={candidate.appliedJobs?.[0]?._id || ''} // Fallback or dynamic selection
          jobTitle={candidate.appliedJobs?.[0]?.title || 'General Interview'}
        />
      )}
    </DashboardLayout>
  );
}
