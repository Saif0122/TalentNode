'use client';

import React from 'react';
import { Card, Badge, Button } from '../ui';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
  };
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, className }) => {
  return (
    <Card className={cn("p-6 space-y-4 hover:border-primary/20 transition-all", className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
        </div>
        <Badge variant="info">Active</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
         {job.requiredSkills.map(skill => (
           <Badge key={skill} variant="neutral">{skill}</Badge>
         ))}
      </div>
      
      <div className="pt-2 flex items-center justify-between border-t border-slate-50">
        <p className="text-xs text-slate-400">Created {new Date(job.createdAt).toLocaleDateString()}</p>
        <Button variant="ghost" size="sm" className="text-primary font-bold">
          View Detail
        </Button>
      </div>
    </Card>
  );
};
