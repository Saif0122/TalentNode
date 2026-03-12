'use client';

import React, { useState, useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function RedirectUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const uploadFile = async (selectedFile: File) => {
    setIsUploading(true);
    setError(null);
    setLogs(['[INFO] Initializing upload...']);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await api.post('/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { candidateId, logs: backendLogs } = response.data;
      
      setLogs(prev => [...prev, ...(backendLogs || []), '[SUCCESS] Redirecting to report...']);
      
      // Artificial delay for UX visibility of the success state
      setTimeout(() => {
        router.push(`/report/${candidateId}`);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.error || err.message || 'Failed to upload resume';
      setError(errorMessage);
      if (err.logs) {
        setLogs(prev => [...prev, ...err.logs]);
      }
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      uploadFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto w-full py-12 px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Stitch Smart Upload
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Upload a resume and view the AI-parsed report instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="wait">
            {!isUploading ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-3xl border-4 border-dashed p-20 text-center transition-all cursor-pointer",
                  isDragging 
                    ? "border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/20" 
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileInput} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                />
                
                <div className="size-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Click or drag resume here
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Support for PDF and DOCX files up to 10MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl overflow-hidden"
              >
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative size-32 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-4xl">psychology</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Parsing Resume...
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                    Our AI is extracting candidate profile data
                  </p>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Processing Logs</h4>
                    <span className="size-2 bg-emerald-500 rounded-full animate-ping"></span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 font-mono text-xs space-y-2 h-48 overflow-y-auto border border-slate-100 dark:border-slate-800 shadow-inner">
                    {logs.map((log, i) => (
                      <div key={i} className={cn(
                        "flex gap-3",
                        log.includes('[ERROR]') ? "text-rose-500" : 
                        log.includes('[SUCCESS]') ? "text-emerald-500" : "text-slate-500"
                      )}>
                        <span className="opacity-30">{i + 1}</span>
                        <span className="font-bold">{log}</span>
                      </div>
                    ))}
                    <div className="h-1" ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 flex items-start gap-4"
            >
              <span className="material-symbols-outlined text-rose-500">error</span>
              <div>
                <h4 className="text-rose-900 dark:text-rose-100 font-bold mb-1">Upload Failed</h4>
                <p className="text-rose-700 dark:text-rose-300 text-sm">{error}</p>
                <Button 
                  variant="ghost" 
                  onClick={() => { setError(null); setIsUploading(false); }}
                  className="mt-4 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 p-0 h-auto font-bold uppercase text-[10px] tracking-widest"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
