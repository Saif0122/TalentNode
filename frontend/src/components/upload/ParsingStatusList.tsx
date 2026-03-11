'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface UploadProgressItem {
  id: string;
  file: File;
  progress: number;
  status: string;
}

interface CompletedItemProps {
  id: string;
  filename: string;
  details: string;
  candidateId?: string;
}

const ParsingItem = ({ file, progress, status }: UploadProgressItem) => (
  <div className="rounded-2xl border border-primary/10 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
        </div>
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{file.name}</p>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 animate-pulse">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-black text-primary">{progress}%</span>
      </div>
    </div>
    <div className="h-2.5 w-full rounded-full bg-primary/5 dark:bg-primary/10 overflow-hidden border border-primary/5">
      <div 
        className="h-full bg-gradient-to-r from-primary to-ai-accent rounded-full transition-all duration-700 ease-out relative" 
        style={{ width: `${progress}%` }}
      >
        {progress < 100 && <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>}
      </div>
    </div>
  </div>
);

const CompletedItem = ({ filename, details, candidateId }: CompletedItemProps) => (
  <div className="flex items-center justify-between p-5 rounded-2xl border border-emerald-match/10 bg-emerald-match/5 dark:bg-emerald-match/10 group transition-all hover:bg-emerald-match/10">
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-xl bg-emerald-match/20 flex items-center justify-center text-emerald-match shadow-sm">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <div>
        <p className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">{filename}</p>
        <p className="text-[10px] text-emerald-match font-black uppercase tracking-widest mt-1">{details}</p>
      </div>
    </div>
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-xs font-black text-primary hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5"
      onClick={() => candidateId && window.open(`/candidates/${candidateId}`, '_blank')}
    >
      View Profile
    </Button>
  </div>
);

interface ParsingStatusListProps {
  activeUploads: UploadProgressItem[];
  completedUploads: CompletedItemProps[];
}

export const ParsingStatusList: React.FC<ParsingStatusListProps> = ({ activeUploads, completedUploads }) => {
  if (activeUploads.length === 0 && completedUploads.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {activeUploads.map(upload => (
         <div key={upload.id} className="md:col-span-2">
           <ParsingItem {...upload} />
         </div>
       ))}
       
       {completedUploads.map(upload => (
         <div key={upload.id} className="md:col-span-2">
           <CompletedItem {...upload} />
         </div>
       ))}
    </div>
  );
};
