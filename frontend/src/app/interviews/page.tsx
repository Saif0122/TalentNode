'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button, Badge } from '@/components/ui';
import { useInterviews, useUpdateInterview, useDeleteInterview } from '@/hooks/useInterviews';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewsPage() {
  const { data: interviews, isLoading, error } = useInterviews();
  const updateInterview = useUpdateInterview();
  const deleteInterview = useDeleteInterview();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'rescheduled': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'canceled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateInterview.mutateAsync({ id, data: { status } });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview record?')) return;
    try {
      await deleteInterview.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete interview:', err);
    }
  };

  return (
    <DashboardLayout>
      <main className="max-w-6xl mx-auto w-full py-10 px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Interviews</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your upcoming candidate conversations.</p>
          </div>
          <Badge variant="info" className="px-4 py-1.5 text-sm font-bold">
            {interviews?.length || 0} Total Events
          </Badge>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="py-20 text-center bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-100 dark:border-rose-900/50">
            <span className="material-symbols-outlined text-4xl text-rose-500 mb-4">error</span>
            <p className="text-rose-900 dark:text-rose-100 font-bold">Failed to load interviews</p>
          </div>
        ) : interviews?.length === 0 ? (
          <div className="py-32 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">event_busy</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No interviews scheduled yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">Head over to a candidate profile to initiate a scheduling workflow with Google Calendar integration.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {interviews.map((interview: any) => (
                <motion.div
                  key={interview._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-primary/5">
                        {interview.candidate?.avatar ? (
                          <img src={interview.candidate.avatar} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="text-xl font-black">{interview.candidate?.name?.[0]}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{interview.candidate?.name}</h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">{interview.job?.title}</p>
                      </div>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", getStatusColor(interview.status))}>
                      {interview.status}
                    </span>
                  </div>

                  <div className="p-5 flex-1 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                        <span className="text-sm font-bold">
                          {new Date(interview.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                        <span className="text-sm font-bold">
                          {new Date(interview.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {interview.duration}m
                        </span>
                      </div>
                      {interview.meetingLink && (
                        <a 
                          href={interview.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-primary hover:underline group"
                        >
                          <span className="material-symbols-outlined text-lg group-hover:animate-pulse">videocam</span>
                          <span className="text-sm font-bold truncate">Join Google Meet</span>
                        </a>
                      )}
                    </div>

                    {interview.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                        "{interview.description}"
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    {interview.status === 'scheduled' && (
                      <Button 
                        variant="ghost" 
                        className="flex-1 text-[10px] uppercase tracking-widest font-black h-8 bg-white dark:bg-slate-800 shadow-sm"
                        onClick={() => handleStatusChange(interview._id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    <div className="flex-1 flex gap-2">
                       <Button 
                        variant="ghost" 
                        className="flex-1 text-[10px] uppercase tracking-widest font-black h-8 text-rose-500 hover:bg-rose-50"
                        onClick={() => handleDelete(interview._id)}
                      >
                        Delete
                      </Button>
                      {interview.status !== 'canceled' && (
                        <Button 
                          variant="ghost" 
                          className="flex-1 text-[10px] uppercase tracking-widest font-black h-8 bg-rose-100 text-rose-600 hover:bg-rose-200"
                          onClick={() => handleStatusChange(interview._id, 'canceled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
