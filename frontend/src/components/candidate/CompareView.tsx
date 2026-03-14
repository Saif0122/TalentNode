'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { useCompare } from '@/hooks/useCandidates';
import { cn } from '@/lib/utils';

interface CompareViewProps {
  candidateId: string;
  versionA: string;
  versionB: string;
}

export const CompareView: React.FC<CompareViewProps> = ({ candidateId, versionA, versionB }) => {
  const { data, isLoading, error } = useCompare(candidateId, versionA, versionB);

  const diff = data?.data;

  if (isLoading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
      <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
    </div>
  );

  if (error || !diff) return (
    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
      <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">error</span>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Comparison Failed</h3>
      <p className="text-slate-500 text-sm">We couldn't generate the side-by-side comparison at this time.</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Diff */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary font-black">description</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em] text-sm">Executive Summary Changes</h2>
        </div>
        
        <Card className="p-8 dark:bg-slate-900 border-primary/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl font-black">history_edu</span>
          </div>
          <div className="text-sm leading-relaxed font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {diff.summary.map((chunk: any, i: number) => (
              <span 
                key={i} 
                className={cn(
                  chunk.added && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500/50",
                  chunk.removed && "bg-rose-500/20 text-rose-700 dark:text-rose-400 line-through border-b-2 border-rose-500/50"
                )}
              >
                {chunk.value}
              </span>
            ))}
          </div>
        </Card>
      </section>

      {/* Skills Diff */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 font-black">bolt</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em] text-sm">Skill Evolution</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Newly Added
            </h4>
            <div className="flex flex-wrap gap-2">
              {diff.skills.added.length > 0 ? diff.skills.added.map((skill: string) => (
                <Badge key={skill} variant="success" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-black text-[10px] uppercase tracking-wider">
                  {skill}
                </Badge>
              )) : <span className="text-[10px] text-slate-400 font-bold italic">None</span>}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Removed
            </h4>
            <div className="flex flex-wrap gap-2">
              {diff.skills.removed.length > 0 ? diff.skills.removed.map((skill: string) => (
                <Badge key={skill} variant="neutral" className="bg-rose-500/10 text-rose-600 border-rose-500/20 line-through px-3 py-1 font-black text-[10px] uppercase tracking-wider">
                  {skill}
                </Badge>
              )) : <span className="text-[10px] text-slate-400 font-bold italic">None</span>}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              Maintained
            </h4>
            <div className="flex flex-wrap gap-2">
              {diff.skills.unchanged.map((skill: string) => (
                <Badge key={skill} variant="neutral" className="bg-slate-100 dark:bg-slate-800 text-slate-600 px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Diff */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600 font-black">work_history</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em] text-sm">Experience Timeline Evolution</h2>
        </div>

        <div className="space-y-6">
          {diff.experience.map((item: any, idx: number) => (
            <div 
              key={idx}
              className={cn(
                "p-6 rounded-2xl border transition-all relative overflow-hidden",
                item.type === 'added' && "border-emerald-500/20 bg-emerald-500/[0.02]",
                item.type === 'removed' && "border-rose-500/20 bg-rose-500/[0.02] opacity-60",
                item.type === 'unchanged' && "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                      {item.role} @ {item.company}
                    </h4>
                    {item.type === 'added' && <Badge className="bg-emerald-500 text-white text-[8px] font-black uppercase px-2">New</Badge>}
                    {item.type === 'removed' && <Badge className="bg-rose-500 text-white text-[8px] font-black uppercase px-2">Removed</Badge>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.duration}</span>
                </div>
              </div>
              
              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                {Array.isArray(item.description) ? (
                  item.description.map((chunk: any, i: number) => (
                    <span 
                      key={i} 
                      className={cn(
                        chunk.added && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
                        chunk.removed && "bg-rose-500/20 text-rose-700 dark:text-rose-400 line-through"
                      )}
                    >
                      {chunk.value}
                    </span>
                  ))
                ) : (
                  item.description
                )}
              </div>

              {item.isChanged && (
                <div className="absolute top-4 right-4 animate-pulse">
                   <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[8px] font-black uppercase px-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">edit</span>
                    Modified
                   </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
