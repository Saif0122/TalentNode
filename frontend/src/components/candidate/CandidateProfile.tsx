'use client';

import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { VersionHistoryPanel } from './VersionHistoryPanel';

interface CandidateProfileProps {
  candidate: any;
}

const RadarChart = () => (
  <div className="relative h-64 w-full flex items-center justify-center bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 overflow-hidden group">
    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity">
      <div className="w-full h-full p-4">
        <div className="w-full h-full border border-primary rounded-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 border border-primary rounded-full flex items-center justify-center">
            <div className="w-1/3 h-1/3 border border-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    <svg className="w-48 h-48 rotate-[-90deg] filter drop-shadow-xl transition-transform duration-1000 group-hover:scale-105" viewBox="0 0 100 100">
      <polygon 
        className="text-primary/20" 
        fill="none" 
        points="50,10 85,35 75,80 25,80 15,35" 
        stroke="currentColor" 
        strokeWidth="2"
      ></polygon>
      <polygon 
        fill="#3b1e8a" 
        fillOpacity="0.5" 
        points="50,20 78,40 68,70 32,75 20,40" 
        stroke="#3b1e8a" 
        strokeWidth="2" 
        className="animate-pulse-slow"
      ></polygon>
    </svg>
    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary uppercase tracking-widest">Architecture</div>
    <div className="absolute top-1/3 right-4 text-[10px] font-black text-primary uppercase tracking-widest">React</div>
    <div className="absolute bottom-8 right-12 text-[10px] font-black text-primary uppercase tracking-widest">Node.js</div>
    <div className="absolute bottom-8 left-12 text-[10px] font-black text-primary uppercase tracking-widest">Team Lead</div>
    <div className="absolute top-1/3 left-4 text-[10px] font-black text-primary uppercase tracking-widest">Cloud</div>
  </div>
);

export const CandidateProfile: React.FC<CandidateProfileProps> = ({ candidate }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  if (!candidate) return null;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const response = await api.get(`/api/reports/${candidate._id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${candidate.name.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
        <a className="hover:text-primary transition-colors cursor-pointer">Talent Pool</a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <a className="hover:text-primary transition-colors cursor-pointer">Engineering</a>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-black">{candidate.name}</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-6 mb-2">
        <div className="space-y-2">
          <h1 className="text-slate-900 dark:text-white text-5xl font-black leading-tight tracking-[-0.03em]">
            {candidate.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Senior Software Engineer
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight">
              {candidate.location || "San Francisco, CA"} • {candidate.parsedResume?.yearsExperience || 8}+ Years Exp.
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={() => handleExportPDF()}
            disabled={isExporting}
            className={cn(
              "h-10 px-4 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider group bg-primary/10 text-primary border-none hover:bg-primary/20",
              isExporting && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className={cn("material-symbols-outlined text-lg group-hover:translate-y-0.5 transition-transform", isExporting && "animate-spin")}>
              {isExporting ? 'hourglass_empty' : 'download'}
            </span>
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
          <Button variant="primary" className="h-10 px-4 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/10 group bg-primary text-white hover:brightness-110">
            <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">mail</span>
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-display">
        {/* Left Column: Resume View */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="overflow-hidden shadow-xl dark:bg-slate-900 border-primary/10 rounded-xl">
            <div className="flex border-b border-primary/10 bg-primary/5 px-4 gap-8">
              <button className="flex items-center gap-2 border-b-2 border-primary text-primary pb-3 pt-4 font-black text-sm uppercase tracking-wider transition-all">
                <span className="material-symbols-outlined text-lg">description</span>
                Original PDF
              </button>
              <button className="flex items-center gap-2 border-b-2 border-transparent text-slate-500 pb-3 pt-4 font-black text-sm uppercase tracking-wider hover:text-primary transition-all">
                <span className="material-symbols-outlined text-lg">terminal</span>
                Parsed Clean Text
              </button>
            </div>
            
            <div className="p-8 min-h-[850px] bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-10">
              <div className="max-w-2xl mx-auto w-full bg-white dark:bg-slate-900 p-12 shadow-2xl rounded-sm border border-slate-200 dark:border-primary/5 relative">
                <div className="border-b-2 border-primary pb-5 flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none mb-1">{candidate.name}</h2>
                    <p className="text-slate-500 font-bold text-[11px] tracking-widest uppercase">{candidate.email || "alex.rivera.dev@email.com"} | {candidate.phone || "+1 (555) 012-3456"}</p>
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="text-[11px] font-black text-primary uppercase border-b border-primary/20 mb-3 pb-1 tracking-[0.2em]">Executive Summary</h3>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                      {candidate.summary || candidate.parsedResume?.summary || 'No summary available.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[11px] font-black text-primary uppercase border-b border-primary/20 mb-5 pb-1 tracking-[0.2em]">Professional Experience</h3>
                    <div className="flex flex-col gap-8">
                      {(candidate.experienceTimeline || candidate.parsedResume?.experienceTimeline || [
                        {
                          role: "Staff Software Engineer",
                          company: "TechScale Solutions",
                          duration: "2020 - Present",
                          description: "Led the migration from monolithic architecture to microservices using Kubernetes. Optimized database queries reducing latency by 45% for the core API. Mentored a team of 6 junior and mid-level developers."
                        },
                        {
                          role: "Full Stack Developer",
                          company: "InnovateX",
                          duration: "2017 - 2020",
                          description: "Developed and launched a real-time analytics dashboard used by 10k+ clients. Implemented CI/CD pipelines reducing deployment time by 60%."
                        }
                      ]).map((item: any, idx: number) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{item.role} | {item.company}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">
                              {item.duration}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-[11px] font-black text-primary uppercase border-b border-primary/20 mb-3 pb-1 tracking-[0.2em]">Education</h3>
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm">B.S. Computer Science</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stanford University</span>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column: AI Insights */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <Card className="overflow-hidden shadow-2xl dark:bg-slate-900 border-primary/20 border-2 rounded-xl">
            <div className="bg-primary p-4 flex items-center gap-3">
               <span className="material-symbols-outlined text-white text-2xl">psychology</span>
               <h3 className="text-white font-black uppercase tracking-[0.1em] text-sm">TalentNode AI Analysis</h3>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skills vs. Role Requirements</h4>
                <RadarChart />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate Fit Summary</h4>
                <div className="p-4 bg-primary/5 dark:bg-primary/20 rounded-xl border-l-4 border-primary shadow-inner">
                  <p className="text-sm leading-relaxed italic text-slate-700 dark:text-slate-300 font-bold">
                    "{candidate.parsedResume?.aiAnalysis || `${candidate.name} is a high-confidence match (94%) for the Senior Software Engineer position. Their experience with large-scale architectural migrations aligns perfectly with our upcoming infrastructure roadmap. Strong technical leadership indicators suggest they can immediately contribute to mentoring initiatives.`}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm font-black">check_circle</span>
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {(candidate.parsedResume?.reasons || ["Distributed Systems", "K8s & Docker Exp.", "Mentorship History"]).slice(0, 3).map((reason: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-black text-slate-700 dark:text-slate-300">
                        <span className="material-symbols-outlined text-emerald-500 text-sm font-black mt-0.5">check</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm font-black">warning</span>
                    Missing/Gap
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-[11px] font-black text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-amber-500 text-sm font-black mt-0.5">priority_high</span>
                      <span>No Python listed</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] font-black text-slate-700 dark:text-slate-300">
                      <span className="material-symbols-outlined text-amber-500 text-sm font-black mt-0.5">priority_high</span>
                      <span>Machine Learning</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10 flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center group">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
                  <svg className="size-32 transform -rotate-90 relative z-10">
                    <circle className="text-slate-100 dark:text-slate-800" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="12"></circle>
                    <circle 
                      className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] progress-ring__circle" 
                      cx="64" cy="64" 
                      fill="transparent" 
                      r="58" 
                      stroke="currentColor" 
                      strokeDasharray="364.42" 
                      strokeDashoffset={364.42 - (364.42 * (candidate.parsedResume?.score || 94) / 100)} 
                      strokeLinecap="round" 
                      strokeWidth="12"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{candidate.parsedResume?.score || 94}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">High Confidence Match</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Based on 12+ matching key criteria</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Version History */}
          <VersionHistoryPanel candidateId={candidate._id} />
        </div>
      </div>
    </div>
  );
};
