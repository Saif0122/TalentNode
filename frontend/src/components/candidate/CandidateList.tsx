'use client';

import React from 'react';
import { CandidateCard } from './CandidateCard';

interface CandidateListProps {
  candidates: any[];
  isLoading?: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-500">No candidates found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
       {candidates.map((candidate) => (
         <CandidateCard key={candidate._id} candidate={candidate} />
       ))}
    </div>
  );
};
