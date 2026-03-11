'use client';

import React from 'react';

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
        className="h-full bg-primary flex items-center px-4 text-white text-xs font-bold transition-all duration-1000" 
        style={{ width: `${percentage}%`, opacity }}
      >
        {label} ({percentage}%)
      </div>
    </div>
  </div>
);

export const PipelineFunnel = () => {
  const steps = [
    { label: 'Applied', count: 1240, percentage: 100, opacity: 1 },
    { label: 'Screened', count: 840, percentage: 68, opacity: 0.8 },
    { label: 'Interview', count: 320, percentage: 26, opacity: 0.6 },
    { label: 'Offered', count: 48, percentage: 12, opacity: 0.4 },
    { label: 'Hired', count: 42, percentage: 10, opacity: 0.2 },
  ];

  return (
    <div className="space-y-4">
      {steps.map(step => (
        <FunnelStep key={step.label} {...step} />
      ))}
    </div>
  );
};
