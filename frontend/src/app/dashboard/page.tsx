'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';
import { CandidateList } from '@/components/candidate/CandidateList';
import { Sparkline } from '@/components/visualization/Sparkline';
import { useCandidates } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, trend, sparkline }: any) => (
  <Card className="p-6 flex justify-between items-end dark:bg-slate-900 border-slate-100 dark:border-primary/10">
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-500 font-bold uppercase tracking-tight">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
      <p className="text-xs text-emerald-600 flex items-center gap-1 font-black">
        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'wght' 700" }}>trending_up</span> {trend}
      </p>
    </div>
    <Sparkline 
      data={sparkline.values} 
      color={sparkline.barColor} 
      className={sparkline.bgColor}
    />
  </Card>
);

const MatchScoreRing = ({ score }: { score: number }) => {
  const getScoreInfo = (s: number) => {
    if (s >= 95) return { color: "text-emerald-500", label: "Excellent Match", labelColor: "text-emerald-600 dark:text-emerald-400", glow: true };
    if (s >= 85) return { color: "text-amber-500", label: "Strong Match", labelColor: "text-amber-600 dark:text-amber-400", glow: false };
    return { color: "text-indigo-400", label: "Good Match", labelColor: "text-indigo-600 dark:text-indigo-400", glow: false };
  };

  const info = getScoreInfo(score);

  return (
    <div className="flex items-center gap-3">
      <div className={cn("relative flex items-center justify-center size-12", info.glow && "animate-pulse-glow")}>
        <svg className="size-full">
          <circle className="text-slate-100 dark:text-slate-800" cx="24" cy="24" fill="transparent" r="18" stroke="currentColor" strokeWidth="3"></circle>
          <circle 
            className={cn("progress-ring__circle", info.color)} 
            cx="24" cy="24" 
            fill="transparent" 
            r="18" 
            stroke="currentColor" 
            strokeDasharray="113.1" 
            strokeDashoffset={113.1 - (113.1 * score / 100)} 
            strokeLinecap="round" 
            strokeWidth="3"
          ></circle>
        </svg>
        <span className={cn("absolute text-[10px] font-black", info.labelColor)}>{score}%</span>
      </div>
      <div className="hidden xl:block">
        <p className={cn("text-[10px] font-black uppercase tracking-tighter", info.labelColor)}>{info.label}</p>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates({ limit: 5 });
  const { data: jobsData, isLoading: jobsLoading } = useJobs();

  const candidates = candidatesData?.data?.candidates || [];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto w-full px-4 sm:px-0">
        {/* Breadcrumbs & Greeting */}
        <div className="flex flex-col gap-1">
          <nav className="flex text-[10px] uppercase tracking-widest text-slate-400 gap-2 items-center mb-2 font-black">
            <span>Recruiter Portal</span>
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'wght' 700" }}>chevron_right</span>
            <span className="text-primary font-black">Dashboard</span>
          </nav>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Welcome back, Sarah.</h2>
          <p className="text-slate-500 font-bold uppercase tracking-tight text-xs">Here's what's happening with your pipeline today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Active Jobs" 
            value={jobsData?.data?.length || 0} 
            trend="+2% this week" 
            sparkline={{ values: [30, 50, 70, 50, 80, 100], bgColor: 'bg-emerald-100/50', barColor: 'bg-emerald-400' }} 
          />
          <StatCard 
            title="Resumes Parsed Today" 
            value="1,402" 
            trend="+15% vs yesterday" 
            sparkline={{ values: [20, 40, 30, 70, 50, 100], bgColor: 'bg-blue-100/50', barColor: 'bg-blue-400' }} 
          />
          <StatCard 
            title="High-Match Candidates" 
            value="28" 
            trend="+5% new matches" 
            sparkline={{ values: [60, 30, 50, 70, 100, 80], bgColor: 'bg-ai-accent/10', barColor: 'bg-ai-accent' }} 
          />
        </div>

        {/* AI Action Center Widget */}
        <div className="bg-gradient-to-r from-ai-accent/10 to-primary/10 border border-ai-accent/20 rounded-2xl p-1 shadow-2xl shadow-primary/5 group transition-all hover:scale-[1.01]">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[calc(1rem-1px)] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="size-14 bg-ai-accent rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-ai-accent/40 rotate-3 group-hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Insights Action Center</h4>
                <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-medium">
                  AI has identified <span className="font-black text-ai-accent">5 top candidates</span> for the <span className="font-black text-slate-900 dark:text-slate-100 italic underline decoration-ai-accent/30 underline-offset-4">Senior React Developer</span> role with match scores over 95%.
                </p>
              </div>
            </div>
            <Button variant="ai" className="px-10 py-4 rounded-xl shadow-xl shadow-ai-accent/20 h-auto text-xs font-black uppercase tracking-widest flex items-center gap-3">
              Review Now
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          </div>
        </div>

        {/* Recent Pipeline Activity Table */}
        <Card className="overflow-hidden border-slate-100 dark:border-primary/10 dark:bg-slate-900 shadow-sm rounded-2xl">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
            <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Recent Pipeline Activity</h4>
            <Button variant="ghost" size="sm" className="text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5">View All Candidates</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Parsed Date</th>
                  <th className="px-6 py-4">AI Match</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {candidatesLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold italic">Scaling intelligence...</td></tr>
                ) : (
                  candidates.map((candidate: any) => (
                    <tr key={candidate._id} className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-all group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 text-[10px] border border-primary/5 shadow-inner transition-transform group-hover:scale-110">
                            {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{candidate.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{candidate.location || "Remote"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">Senior Engineering Lead</p>
                      </td>
                      <td className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase">2 mins ago</td>
                      <td className="px-6 py-5">
                        <MatchScoreRing score={candidate.parsedResume?.score || 95} />
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="success" className="px-2 py-0.5 h-auto text-[9px] font-black uppercase tracking-tighter">Parsing Success</Badge>
                      </td>
                      <td className="px-6 py-5 text-right px-8">
                        <button className="text-slate-400 hover:text-primary transition-all active:scale-90">
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
