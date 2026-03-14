'use client';

import React, { useEffect, useState } from 'react';
import { jobApi } from '@/lib/api';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const JobRequestList = ({ jobId }: { jobId: string }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await jobApi.getRequests(jobId);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [jobId]);

  const handleReview = async (requestId: string, status: string) => {
    try {
      await jobApi.reviewRequest(requestId, status);
      fetchRequests();
    } catch (err) {
      alert('Failed to update request');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-400">Loading requests...</div>;

  if (requests.length === 0) return (
    <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200">
      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
      <p className="text-slate-500 font-medium">No incoming requests for this job yet.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req._id} className="p-5 flex flex-wrap items-center justify-between gap-4 border-primary/5 hover:border-primary/20 transition-all group">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {req.candidateId?.name?.charAt(0) || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{req.candidateId?.name || 'Unknown Candidate'}</h4>
                <Badge variant="neutral" className={cn(
                  "text-[10px] px-2 py-0",
                  req.status === 'Pending' ? "text-amber-600 border-amber-200 bg-amber-50" :
                  req.status === 'Approved' ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-rose-600 border-rose-200 bg-rose-50"
                )}>
                  {req.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">Applied {new Date(req.createdAt).toLocaleDateString()}</p>
              {req.message && <p className="text-xs text-slate-400 mt-2 italic font-medium">"{req.message}"</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/report/${req.candidateId?._id}`}>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-wider h-9 border border-slate-200">View Report</Button>
            </Link>
            {req.status === 'Pending' && (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => handleReview(req._id, 'Approved')} 
                  className="text-emerald-600 hover:bg-emerald-50 h-9 px-4 text-xs font-bold uppercase"
                >
                  Approve
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => handleReview(req._id, 'Rejected')} 
                  className="text-rose-600 hover:bg-rose-50 h-9 px-4 text-xs font-bold uppercase"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
