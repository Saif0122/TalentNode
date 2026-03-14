'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import { PipelineFunnel } from '@/components/analytics/PipelineFunnel';
import { SourcePerformance } from '@/components/analytics/SourcePerformance';
import { cn } from '@/lib/utils';
import { useAnalyticsOverview, useAnalyticsConversion, useAnalyticsSources, useAnalyticsTopSkills } from '@/hooks/useAnalytics';

const KPICard = ({ title, value, trend, icon, color, trendColor, loading }: any) => (
  <Card className="p-6 shadow-sm dark:bg-slate-900 border-slate-200 dark:border-slate-800">
    <div className="flex justify-between items-start mb-4">
      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
      <div className={cn("p-2 rounded-lg text-primary bg-primary/10", color)}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
    </div>
    {loading ? (
      <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mb-1"></div>
    ) : (
      <p className="text-3xl font-black mb-1 text-slate-900 dark:text-white">{value}</p>
    )}
    <div className={cn(
      "flex items-center gap-1.5 text-sm font-bold",
      trendColor || (trend?.includes('+') ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")
    )}>
      <span className="material-symbols-outlined text-sm">
        {trend?.includes('-') && !trend?.includes('+') ? 'trending_down' : trend?.includes('+') ? 'trending_up' : 'remove'}
      </span>
      <span>{trend}</span>
    </div>
  </Card>
);

const DIMetric = ({ label, percentage, description, colorClass }: any) => (
  <div className="flex items-center gap-4 group">
    <div className={cn("size-16 rounded-full border-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-300", colorClass || "border-primary")}>
      <span className="text-xs font-black">{percentage}%</span>
    </div>
    <div>
      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{description}</p>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: conversion, isLoading: conversionLoading } = useAnalyticsConversion();
  const { data: sources, isLoading: sourcesLoading } = useAnalyticsSources();
  const { data: topSkills } = useAnalyticsTopSkills();

  const stats = overview?.data || {};

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full space-y-8">
        <header className="flex h-16 w-full items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md rounded-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors group">
              <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-primary transition-colors">calendar_today</span>
              <span className="text-sm font-bold dark:text-slate-200">Last 30 Days</span>
              <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden lg:block">
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
               <input className="h-10 w-64 rounded-lg border-none bg-slate-100 dark:bg-slate-800 pl-10 text-sm focus:ring-2 focus:ring-primary/50" placeholder="Search analytics..." type="text"/>
             </div>
             <Button variant="primary" className="flex items-center gap-2 px-6">
               <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
               Export Report
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Time to Hire" 
            value={`${stats.avgTimeToHire || 0} days`} 
            trend={stats.avgTimeToHire < 20 ? "-2d vs last month" : "+1d vs last month"} 
            icon="schedule" 
            loading={overviewLoading}
          />
          <KPICard 
            title="Offer Acceptance" 
            value={`${stats.offerAcceptanceRate || 0}%`} 
            trend="+5% trend" 
            icon="how_to_reg" 
            loading={overviewLoading}
          />
          <KPICard 
            title="AI Matching Accuracy" 
            value={`${stats.aiAccuracy || 0}%`} 
            trend="Stable performance" 
            icon="psychology" 
            trendColor="text-slate-400 dark:text-slate-500" 
            loading={overviewLoading}
          />
          <KPICard 
            title="Cost per Hire" 
            value={`$${stats.costPerHire?.toLocaleString() || '0'}`} 
            trend="+$150 vs target" 
            icon="payments" 
            color="bg-red-50 text-red-600 dark:bg-red-900/10" 
            trendColor="text-red-600 dark:text-red-400" 
            loading={overviewLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Candidate Pipeline Funnel</h3>
            {conversionLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
              </div>
            ) : (
              <PipelineFunnel data={conversion?.data} />
            )}
          </Card>
          <Card className="p-8 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Source Performance</h3>
            {sourcesLoading ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>)}
              </div>
            ) : (
              <SourcePerformance data={sources?.data} />
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-[#5a36b5] p-1 rounded-2xl shadow-xl shadow-primary/10">
            <div className="bg-white dark:bg-slate-900 h-full w-full rounded-[0.9rem] p-8">
              <div className="flex items-center gap-2 mb-8">
                <div className="size-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Skill Demand Trends</h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-display">
                {(topSkills?.data || []).map((skill: any, idx: number) => (
                  <span 
                    key={skill.name} 
                    className={cn(
                      "transition-all hover:scale-110 cursor-pointer text-display",
                      idx === 0 ? "px-6 py-2.5 bg-primary text-white rounded-full text-xl font-black shadow-lg shadow-primary/20 hover:-rotate-1" :
                      idx === 1 ? "px-8 py-3.5 bg-primary/20 text-primary dark:text-primary rounded-full text-2xl font-black hover:rotate-2 border border-primary/20" :
                      idx === 2 ? "px-7 py-3 bg-primary/80 text-white rounded-full text-lg font-black shadow-md" :
                      "px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    )}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                <span className="font-black text-primary uppercase tracking-tighter mr-2">AI insight:</span> High-priority skills identified across job openings. Demand for "{topSkills?.data?.[0]?.name || 'React'}" has recently grown.
              </p>
            </div>
          </div>
          <Card className="p-8 space-y-8 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">D&I Metrics</h3>
            <DIMetric label="Gender Diversity" percentage={75} description="Pipeline representation" colorClass="border-primary border-r-slate-200 dark:border-r-slate-800" />
            <DIMetric label="Underrepresented" percentage={42} description="Interview stage target" colorClass="border-primary/40 border-t-primary border-l-slate-200 dark:border-l-slate-800" />
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
               <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed uppercase tracking-wider">Anonymized data based on voluntary disclosures and AI demographic estimation.</p>
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Top Performing Recruiters</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All Teams</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Recruiter</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Department</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Screened</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Hires</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Velocity</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                        <div className="h-full w-full bg-blue-200/50 flex items-center justify-center">DC</div>
                      </div>
                      <span className="text-sm font-semibold">David Chen</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Engineering</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">142</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">8</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div className="h-full bg-green-500 w-[90%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">Fast</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">Above Target</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                        <div className="h-full w-full bg-purple-200/50 flex items-center justify-center">ER</div>
                      </div>
                      <span className="text-sm font-semibold">Elena Rodriguez</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Product & Design</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">98</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">5</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div className="h-full bg-blue-500 w-[75%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">Optimal</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">On Track</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                         <div className="h-full w-full bg-orange-200/50 flex items-center justify-center">JM</div>
                      </div>
                      <span className="text-sm font-semibold">Jameson Miller</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">Sales</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">215</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">12</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div className="h-full bg-green-500 w-[95%] rounded-full"></div>
                      </div>
                      <span className="text-xs font-bold">Fast</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">MVP</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
