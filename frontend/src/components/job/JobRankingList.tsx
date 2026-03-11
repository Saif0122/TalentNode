'use client';

import React from 'react';
import MatchScore from '@/components/visualization/MatchScore';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CandidateRankingItemProps {
  candidate: any;
  rank: number;
}

const CandidateRankingItem: React.FC<CandidateRankingItemProps> = ({ candidate, rank }) => {
  const score = candidate.parsedResume?.score || 0;
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        score >= 90 ? "bg-emerald-match" : score >= 75 ? "bg-amber-match" : "bg-indigo-match"
      )}></div>
      
      <div className="flex items-start gap-4">
        <input className="mt-1 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox"/>
        <div className="flex-1 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="size-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl ring-2 ring-slate-50">
              {candidate.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href={`/candidates/${candidate._id}`} className="hover:underline">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{candidate.name}</h3>
                </Link>
                {rank === 1 && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Top Match</span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-3">{candidate.skills[0]} Specialist at Enterprise Node</p>
              <div className="flex flex-wrap gap-2">
                 {candidate.skills.slice(0, 3).map((skill: string) => (
                   <span key={skill} className="px-2 py-1 rounded-md bg-primary/5 text-primary text-xs font-semibold">
                     {skill}
                   </span>
                 ))}
                 {candidate.skills.length > 3 && (
                   <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                     +{candidate.skills.length - 3} more
                   </span>
                 )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className={cn("relative size-20", score >= 90 && "animate-pulse-glow")}>
              <MatchScore score={score} size={80} strokeWidth={4} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">AI Match</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">history</span> 
            Applied 2d ago
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">attach_file</span> 
            Resume.pdf
          </span>
        </div>
        <Link 
          href={`/candidates/${candidate._id}`}
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          View Profile <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export const JobRankingList: React.FC<{ candidates: any[] }> = ({ candidates }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {candidates.map((c, i) => (
        <CandidateRankingItem key={c._id} candidate={c} rank={i + 1} />
      ))}
    </div>
  );
};
