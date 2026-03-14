'use client';

import React from 'react';

interface SourcePerformanceProps {
  data?: { source: string; count: number; hired: number; hireRate: number }[];
}

interface SourceBarProps {
  name: string;
  count: number;
  percentage: number;
  colorOpacity: number;
}

const SourceBar: React.FC<SourceBarProps> = ({ name, count, percentage, colorOpacity }) => (
  <div className="relative group">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-tight mb-2">
      <span className="text-slate-700 dark:text-slate-300">{name}</span>
      <span className="text-primary font-bold">{count} candidates</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-1000 group-hover:brightness-110" 
        style={{ width: `${percentage}%`, opacity: colorOpacity }}
      ></div>
    </div>
  </div>
);

export const SourcePerformance: React.FC<SourcePerformanceProps> = ({ data }) => {
  const sources = data || [
    { source: 'LinkedIn', count: 450, hireRate: 15, hired: 20 },
    { source: 'Referrals', count: 210, hireRate: 35, hired: 15 },
    { source: 'Careers Page', count: 180, hireRate: 18, hired: 10 },
    { source: 'Indeed', count: 380, hireRate: 12, hired: 12 },
  ];

  const maxHires = Math.max(...sources.map(s => s.hired), 1);

  return (
    <div className="space-y-6">
       {sources.map((source, idx) => {
         const percentage = Math.round((source.hired / maxHires) * 100);
         const opacity = 1 - (idx * 0.15);
         return (
           <SourceBar 
              key={source.source} 
              name={source.source} 
              count={source.count} 
              percentage={percentage} 
              colorOpacity={opacity} 
            />
         );
       })}
       
       <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Top Quality</p>
          <p className="text-xs font-black text-primary uppercase tracking-tight">Referrals</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Fastest Hire</p>
          <p className="text-xs font-black text-primary uppercase tracking-tight">LinkedIn</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Lowest CPA</p>
          <p className="text-xs font-black text-primary uppercase tracking-tight">Careers Page</p>
        </div>
      </div>
    </div>
  );
};
