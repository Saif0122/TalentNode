'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Badge } from '@/components/ui';
import { useExperiments } from '@/hooks/useExperiments';
import { useJobs } from '@/hooks/useJobs';
import { useCandidates } from '@/hooks/useCandidates';
import { cn } from '@/lib/utils';

export default function ExperimentsPage() {
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const { getExperiments, runExperiment, getComparison } = useExperiments();
  const { data: jobs } = useJobs();
  const { data: candidates } = useCandidates();

  const experiments = getExperiments.data?.data || [];
  const activeExp = getComparison(selectedExperiment || '').data?.data;

  const handleRunExperiment = async (id: string) => {
    try {
      await runExperiment.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full space-y-8">
        <header className="flex h-16 w-full items-center justify-between border-b border-primary/10 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md rounded-xl sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Experimentation Hub</h1>
            <Badge variant="neutral" className="px-3 py-1 bg-primary/10 text-primary">A/B Scoring</Badge>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            New Experiment
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Experiments */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 px-2">History</h3>
            {getExperiments.isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>)}
              </div>
            ) : experiments.map((exp: any) => (
              <Card 
                key={exp._id}
                onClick={() => setSelectedExperiment(exp._id)}
                className={cn(
                  "p-5 cursor-pointer transition-all border-slate-100 dark:border-slate-800 hover:border-primary/30",
                  selectedExperiment === exp._id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20" : "bg-white dark:bg-slate-900"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">{exp.name}</h4>
                  <Badge variant={exp.status === 'Completed' ? 'success' : 'neutral'} className="text-[9px] px-2 py-0">
                    {exp.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">Job: {exp.job?.title || 'Unknown'}</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                  <span>{exp.candidates?.length} Candidates</span>
                  <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Experiment Comparison Tool */}
          <div className="lg:col-span-2">
            {selectedExperiment ? (
              <div className="space-y-6">
                {activeExp ? (
                  <>
                    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-9xl">analytics</span>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">
                          <span className="material-symbols-outlined text-sm">emoji_events</span>
                          Winning Algorithm
                        </div>
                        <h2 className="text-4xl font-black mb-2 tracking-tighter">
                          {activeExp.comparison.winner} <span className="text-slate-500">is the winner</span>
                        </h2>
                        <p className="text-slate-400 font-medium max-w-lg mb-8">
                          Based on {activeExp.comparison.totalCandidates} test cases, Scorer B showed higher overall candidate alignment with specific skill requirements.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-black">Scorer A Avg</p>
                            <p className="text-2xl font-black">{Math.round(activeExp.comparison.averageScoreA)}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-black">Scorer B Avg</p>
                            <p className="text-2xl font-black text-primary">{Math.round(activeExp.comparison.averageScoreB)}%</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 px-2">Side-by-Side Breakdown</h3>
                      <div className="space-y-4">
                        {activeExp.experiment.results.map((res: any) => (
                          <Card key={res.candidate._id} className="p-6 dark:bg-slate-900 border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                {res.candidate.name[0]}
                              </div>
                              <h5 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{res.candidate.name}</h5>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative">
                              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden md:block"></div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-[10px] font-black uppercase text-slate-500">Scorer A</span>
                                  <span className="text-lg font-black">{res.scorerA.score}%</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{res.scorerA.summary}"</p>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                                  <span className="text-[10px] font-black uppercase text-primary">Scorer B</span>
                                  <span className="text-lg font-black text-primary">{res.scorerB.score}%</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{res.scorerB.summary}"</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Card className="p-20 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2">
                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-4xl animate-bounce-slow">science</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Experiment Ready</h3>
                      <p className="text-slate-500 max-w-sm mt-2 font-medium">This experiment has been configured but not executed yet. Run both algorithms to see comparison results.</p>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => handleRunExperiment(selectedExperiment)}
                      disabled={runExperiment.isPending}
                      className="px-12 py-4 h-auto rounded-xl shadow-xl shadow-primary/20 flex items-center gap-3 uppercase text-xs font-black tracking-widest"
                    >
                      {runExperiment.isPending ? 'Executing Algorithms...' : 'Run Analysis'}
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </Button>
                  </Card>
                )}
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold italic">
                Select an experiment from the history to view results comparison.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
