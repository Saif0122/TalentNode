'use client';

import React, { useState, useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button, Badge } from '@/components/ui';
import { ParsingStatusList } from '@/components/upload/ParsingStatusList';
import { candidateApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function ResumeUploadPage() {
  const [activeUploads, setActiveUploads] = useState<any[]>([]);
  const [completedUploads, setCompletedUploads] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      const id = Math.random().toString(36).substring(7);
      
      setActiveUploads(prev => [{ id, file, progress: 0, status: 'Initializing upload...' }, ...prev]);

      const formData = new FormData();
      formData.append('resume', file);
      
      candidateApi.upload(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setActiveUploads(prev => prev.map(u => 
          u.id === id ? { ...u, progress: percentCompleted, status: percentCompleted < 100 ? 'Uploading...' : 'AI Extraction in progress...' } : u
        ));
      })
      .then((res) => {
        const candidate = res.data.candidate;
        const skillsCount = candidate?.skills?.length || 0;
        
        setActiveUploads(prev => prev.filter(u => u.id !== id));
        setCompletedUploads(prev => [{
          id,
          filename: file.name,
          details: `SUCCESS: ${skillsCount} skills detected`,
          candidateId: candidate?._id
        }, ...prev]);
        
        queryClient.invalidateQueries({ queryKey: ['candidates'] });
      })
      .catch((err) => {
        console.error(err);
        setActiveUploads(prev => prev.map(u => 
          u.id === id ? { ...u, status: 'FAILED: ' + (err?.error || err.message), progress: 100 } : u
        ));
      });
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input
    }
  };

  return (
    <DashboardLayout>
      <main className="max-w-5xl mx-auto w-full space-y-10 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Upload Resumes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Add candidates to your pipeline with AI-powered parsing.</p>
        </div>

        {/* Large Drag & Drop Zone */}
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-all cursor-pointer shadow-sm",
            isDragging ? "border-primary bg-primary/[0.08] scale-[1.02]" : "border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/[0.08]"
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            className="hidden" 
            multiple 
            accept=".pdf,.doc,.docx,.txt" 
          />
          
          <div className="relative mb-10 w-72 h-56 flex items-center justify-center pointer-events-none">
            {/* Abstract Illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-48 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-primary/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="p-5 space-y-4">
                  <div className="h-2 w-3/4 bg-primary/10 rounded"></div>
                  <div className="h-2 w-1/2 bg-primary/10 rounded"></div>
                  <div className="h-2 w-5/6 bg-primary/10 rounded"></div>
                  <div className="h-2 w-2/3 bg-primary/10 rounded"></div>
                  <div className="h-2 w-3/4 bg-primary/10 rounded"></div>
                  <div className="h-2 w-1/2 bg-primary/10 rounded"></div>
                </div>
                <div className="absolute left-0 w-full h-1.5 bg-primary/60 shadow-[0_0_20px_rgba(59,30,138,0.9)] z-10 animate-scan"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent"></div>
              </div>
            </div>
            {/* Decorative floating elements */}
            <div className="absolute -top-6 -right-6 size-14 bg-primary/20 rounded-full flex items-center justify-center text-primary shadow-lg animate-bounce duration-3000">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div className="absolute -bottom-4 -left-8 size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shadow-lg">
              <span className="material-symbols-outlined text-xl">data_object</span>
            </div>
          </div>
          
          <div className="max-w-md pointer-events-none">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isDragging ? 'Drop files here!' : 'Drag & drop 100+ resumes here'}
            </h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Our AI will parse contact info, skills, and experience in seconds. Support for PDF, DOCX, and TXT.
            </p>
          </div>
          <div className="mt-10 flex gap-4 pointer-events-none">
            <Button variant="primary" className="px-10 py-3 text-sm">
              Browse Files
            </Button>
            <Button variant="ghost" className="border border-slate-200 px-10 py-3 text-sm flex items-center gap-2 pointer-events-auto">
              <span className="material-symbols-outlined text-sm">link</span>
              Import from LinkedIn
            </Button>
          </div>
        </div>

        {/* Recent Uploads Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 underline decoration-primary/20 underline-offset-8">Recent Uploads</h2>
            <Badge variant="info" className="px-3 py-1">{activeUploads.length} files processing</Badge>
          </div>
          <ParsingStatusList activeUploads={activeUploads} completedUploads={completedUploads} />
        </div>
      </main>
    </DashboardLayout>
  );
}
