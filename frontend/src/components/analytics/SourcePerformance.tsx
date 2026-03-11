'use client';

import React from 'react';

interface SourceBarProps {
  name: string;
  count: number;
  percentage: number;
  colorOpacity: number;
}

const SourceBar: React.FC<SourceBarProps> = ({ name, count, percentage, colorOpacity }) => (
  <div className="relative">
    <div className="flex justify-between text-sm mb-2">
      <span className="font-medium text-slate-700 dark:text-slate-300">{name}</span>
      <span className="font-bold text-slate-900 dark:text-slate-100">{count} candidates</span>
    </div>
    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-1000" 
        style={{ width: `${percentage}%`, opacity: colorOpacity }}
      ></div>
    </div>
  </div>
);

export const SourcePerformance = () => {
  const sources = [
    { name: 'LinkedIn', count: 450, percentage: 85, opacity: 1 },
    { name: 'Referrals', count: 210, percentage: 45, opacity: 0.7 },
    { name: 'Careers Page', count: 180, percentage: 38, opacity: 0.5 },
    { name: 'Indeed', count: 380, percentage: 72, opacity: 0.3 },
  ];

  return (
    <div className="space-y-6">
       {sources.map(source => (
         <SourceBar key={source.name} {...source} colorOpacity={source.opacity} />
       ))}
       
       <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Top Quality</p>
          <p className="text-sm font-bold text-primary">Referrals</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fastest Hire</p>
          <p className="text-sm font-bold text-primary">LinkedIn</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Lowest CPA</p>
          <p className="text-sm font-bold text-primary">Careers Page</p>
        </div>
      </div>
    </div>
  );
};
