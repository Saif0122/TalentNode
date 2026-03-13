'use client';

import React from 'react';
import { Card, Badge, Button } from '../ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { usePublishJob, useArchiveJob } from '@/hooks/useJobs';
import Link from 'next/link';

interface JobCardProps {
  job: any;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, className }) => {
  const { user } = useAuth();
  const publishJob = usePublishJob();
  const archiveJob = useArchiveJob();

  const isRecruiter = user?.role === 'admin' || user?.role === 'recruiter';

  const statusColors: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    published: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-rose-100 text-rose-700'
  };

  const getStatusColor = (status: string) => statusColors[status] || statusColors.draft;

  return (
    <Card className={cn("p-6 space-y-4 hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between", className)}>
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
          </div>
          {isRecruiter && (
             <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg uppercase shrink-0 ml-2", getStatusColor(job.status))}>
               {job.status || 'draft'}
             </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
           {job.requiredSkills?.slice(0, 3).map((skill: string) => (
             <Badge key={skill} variant="neutral">{skill}</Badge>
           ))}
           {job.requiredSkills?.length > 3 && <Badge variant="neutral">+{job.requiredSkills.length - 3}</Badge>}
        </div>
      </div>
      
      <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
        <div className="flex items-center text-xs text-slate-400 gap-4 font-medium">
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {job.location || 'Remote'}</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {job.employmentType || 'Full-time'}</span>
          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">monetization_on</span> {job.salaryRange || 'Competitive'}</span>
        </div>

        <div className="flex items-center justify-between">
          {isRecruiter ? (
            <div className="flex items-center gap-2">
              <Link href={`/jobs/${job._id}/edit`}>
                 <Button variant="ghost" size="sm" className="h-8 px-2 border border-slate-200">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                 </Button>
              </Link>
              {job.status !== 'published' && (
                <Button 
                   variant="ghost" size="sm" 
                   onClick={(e) => { e.preventDefault(); publishJob.mutate(job._id) }} 
                   disabled={publishJob.isPending}
                   className="h-8 px-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-bold"
                >
                  Publish
                </Button>
              )}
              {job.status === 'published' && (
                <Button 
                   variant="ghost" size="sm" 
                   onClick={(e) => { e.preventDefault(); archiveJob.mutate(job._id) }}
                   disabled={archiveJob.isPending}
                   className="h-8 px-2 text-amber-600 bg-amber-50 hover:bg-amber-100 font-bold"
                >
                  Archive
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Created {new Date(job.createdAt).toLocaleDateString()}</p>
          )}

          <Link href={`/jobs/${job._id}`}>
            <Button variant="ghost" size="sm" className="text-primary font-bold h-8 flex gap-1 items-center">
              View <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
