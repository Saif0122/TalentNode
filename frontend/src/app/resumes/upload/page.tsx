'use client';

import React, { useState, useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUploadSubmit = async () => {
    if (!file && !rawText.trim()) {
      setError('Please select a file or paste resume text to continue.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setLogs(['[INFO] Initializing upload...']);

    const formData = new FormData();
    if (activeTab === 'file' && file) {
      formData.append('resume', file);
    } else if (activeTab === 'text' && rawText.trim()) {
      formData.append('rawText', rawText.trim());
    }

    try {
      const response = await api.post('/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { candidateId, logs: backendLogs } = response.data;
      
      setLogs(prev => [...prev, ...(backendLogs || []), '[SUCCESS] Redirecting to report...']);
      
      setTimeout(() => {
        router.push(`/report/${candidateId}`);
      }, 1500);

    } catch (err: any) {
      console.error('Upload Error:', err);
      // Ensure we extract error message from the response if available
      const errorMessage = err.response?.data?.error || err.error || err.message || 'Failed to process resume';
      setError(errorMessage);
      
      if (err.response?.data?.logs) {
        setLogs(prev => [...prev, ...err.response.data.logs]);
      } else if (err.logs) {
        setLogs(prev => [...prev, ...err.logs]);
      }
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setActiveTab('file');
      setError(null);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setActiveTab('file');
      setError(null);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return 'picture_as_pdf';
    if (filename.endsWith('.docx') || filename.endsWith('.doc')) return 'description';
    if (filename.endsWith('.txt')) return 'subject';
    return 'insert_drive_file';
  };

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto w-full py-12 px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Import Candidate
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Upload a resume or paste plain text to generate an AI-parsed report instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="wait">
            {!isUploading ? (
              <motion.div
                key="input-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden"
              >
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setActiveTab('file')}
                    className={cn(
                      "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                      activeTab === 'file' ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Upload Document
                  </button>
                  <button 
                    onClick={() => setActiveTab('text')}
                    className={cn(
                      "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                      activeTab === 'text' ? "bg-primary/5 text-primary border-b-2 border-primary" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">content_paste</span>
                    Paste Raw Text
                  </button>
                </div>

                <div className="p-8">
                  {activeTab === 'file' ? (
                    <div>
                      {!file ? (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all cursor-pointer",
                            isDragging 
                              ? "border-primary bg-primary/5 scale-[1.01]" 
                              : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-primary/50"
                          )}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileInput} 
                            className="hidden" 
                            accept=".pdf,.doc,.docx,.txt,.rtf" 
                          />
                          <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                            <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Click or drag resume here</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Supports PDF, DOCX, DOC, TXT, and RTF (Max 10MB)</p>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="size-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-3xl">{getFileIcon(file.name)}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{file.name}</h4>
                              <p className="text-xs text-slate-500 font-medium">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown Type'}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 px-3" onClick={() => setFile(null)}>
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Resume Text</label>
                      <textarea
                        value={rawText}
                        onChange={(e) => { setRawText(e.target.value); setError(null); }}
                        placeholder="Paste the candidate's full resume text here..."
                        className="w-full h-64 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 text-sm font-mono transition-shadow resize-none"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <Button 
                      variant="primary" 
                      onClick={handleUploadSubmit} 
                      disabled={(!file && !rawText.trim()) || isUploading}
                      className="w-full md:w-auto px-8 py-3 text-base shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">auto_awesome</span>
                      Extract & Parse
                    </Button>
                  </div>
                </div>
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
                    Parsing Intelligence...
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
              <span className="material-symbols-outlined text-rose-500 mt-0.5">error</span>
              <div className="flex-1">
                <h4 className="text-rose-900 dark:text-rose-100 font-bold mb-1">Extraction Failed</h4>
                <p className="text-rose-700 dark:text-rose-300 text-sm bg-white/50 p-3 rounded-lg border border-rose-100 mt-2 font-mono whitespace-pre-wrap">{error}</p>
                <div className="mt-4 flex gap-3">
                  <Button 
                    variant="ghost" 
                    onClick={() => { setError(null); setIsUploading(false); }}
                    className="text-rose-700 bg-rose-100 hover:bg-rose-200 uppercase text-xs tracking-widest font-bold"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
