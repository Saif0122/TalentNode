'use client';

import React from 'react';

interface PipelineFunnelProps {
  data?: { step: string; count: number }[];
}

interface FunnelStepProps {
  label: string;
  count: number;
  percentage: number;
  opacity: number;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ label, count, percentage, opacity }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
      <span>{label}</span>
      <span>{count.toLocaleString()}</span>
    </div>
    <div className="h-10 bg-primary/10 rounded-lg overflow-hidden flex">
      <div 
        className="h-full bg-primary flex items-center px-4 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-1000 shadow-inner" 
        style={{ width: `${percentage}%`, opacity }}
      >
        {label}
      </div>
    </div>
  </div>
);

export const PipelineFunnel: React.FC<PipelineFunnelProps> = ({ data }) => {
  const steps = data || [
    { step: 'Applied', count: 1240 },
    { step: 'Screening', count: 840 },
    { step: 'Interview', count: 320 },
    { step: 'Offer', count: 48 },
    { step: 'Hired', count: 42 },
  ];

  const maxCount = Math.max(...steps.map(s => s.count), 1);

  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const percentage = Math.round((step.count / maxCount) * 100);
        // Decrease opacity as we go down the funnel
        const opacity = 1 - (idx * 0.15);
        return (
          <FunnelStep 
            key={step.step} 
            label={step.step} 
            count={step.count} 
            percentage={percentage} 
            opacity={opacity} 
          />
        );
      })}
    </div>
  );
};
