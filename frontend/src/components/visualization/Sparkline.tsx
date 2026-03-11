'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  color: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, className }) => {
  return (
    <div className={cn("flex items-end gap-1 px-2 py-1 h-8 bg-slate-100/50 dark:bg-primary/5 rounded", className)}>
      {data.map((val, i) => (
        <div 
          key={i} 
          className={cn("w-1 rounded-t transition-all duration-500", color)} 
          style={{ height: `${val}%` }}
        ></div>
      ))}
    </div>
  );
};
