'use client';

import React from 'react';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: any[];
  isLoading?: boolean;
}

export const JobList: React.FC<JobListProps> = ({ jobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {jobs.map((job) => (
         <JobCard key={job._id} job={job} />
       ))}
    </div>
  );
};
