'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { useCreateInterview } from '@/hooks/useInterviews';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  jobId,
  jobTitle
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [description, setDescription] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createInterview = useCreateInterview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + duration * 60000);

    try {
      await createInterview.mutateAsync({
        candidateId,
        jobId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration,
        description,
        meetingLink
      });
      setIsSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Failed to schedule interview:', err);
      setErrorMessage(err.response?.data?.error || err.error || 'Failed to schedule interview. Ensure you have an approved connection.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-primary/5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Interview</h2>
            <p className="text-sm text-slate-500">{candidateName} • {jobTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Interview Scheduled!</h3>
              <p className="text-sm text-slate-500">Google Calendar invite has been sent.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45, 60].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={cn(
                        "py-2 text-xs font-bold rounded-lg border transition-all",
                        duration === d 
                          ? "bg-primary border-primary text-white shadow-sm" 
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-primary/50"
                      )}
                    >
                      {d}m
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setDuration(90)}
                    className={cn(
                        "py-2 text-xs font-bold rounded-lg border transition-all",
                        duration === 90 
                          ? "bg-primary border-primary text-white shadow-sm" 
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:border-primary/50"
                      )}
                  >
                    1.5h
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Meeting Link (Optional)</label>
                <input 
                  type="url" 
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Interview agenda, etc."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none h-16 resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] mt-0.5">error</span>
                  {errorMessage}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={onClose} type="button">Cancel</Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  type="submit"
                  disabled={createInterview.isPending}
                >
                  {createInterview.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                </Button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};
