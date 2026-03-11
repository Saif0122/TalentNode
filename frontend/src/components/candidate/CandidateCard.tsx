import React from 'react';
import Link from 'next/link';
import MatchScore from '../visualization/MatchScore';
import { Card, Badge, Button } from '../ui';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: {
    _id: string;
    name: string;
    location?: string;
    skills: string[];
    parsedResume?: {
      summary?: string;
      score?: number;
      yearsExperience?: number;
    };
    createdAt: string;
  };
  className?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = React.memo(({ candidate, className }) => {
  const score = candidate.parsedResume?.score || 0;
  
  return (
    <Card className={cn("hover:bg-slate-50 transition-colors flex items-center justify-between p-4", className)}>
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <Link href={`/candidates/${candidate._id}`} className="hover:underline">
          <h4 className="text-sm font-semibold text-slate-900">{candidate.name}</h4>
        </Link>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden md:block">
          <p className="text-xs font-medium text-slate-500 mb-1">Top Skills</p>
          <div className="flex gap-1">
             {candidate.skills.slice(0, 3).map(skill => (
               <Badge key={skill} variant="neutral">{skill}</Badge>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-32 justify-end">
          <MatchScore score={score} size={40} className={score >= 90 ? "animate-pulse-glow" : ""} />
          <div className="hidden lg:block">
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-tighter",
              score >= 90 ? "text-emerald-600" : score >= 75 ? "text-amber-600" : "text-indigo-600"
            )}>
              {score >= 90 ? "Excellent Match" : score >= 75 ? "Strong Match" : "Good Match"}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-slate-400">
           <span className="material-symbols-outlined">more_vert</span>
        </Button>
      </div>
    </Card>
  );
});

CandidateCard.displayName = 'CandidateCard';
