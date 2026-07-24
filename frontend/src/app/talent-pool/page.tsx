'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TalentPoolFilters } from '@/components/candidate/TalentPoolFilters';
import { useCandidates } from '@/hooks/useCandidates';
import api, { candidateApi } from '@/lib/api';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

const CandidateRow = ({ candidate }: any) => {
  const score = candidate.parsedResume?.score || 94;
  const getScoreBadge = (s: number) => {
    if (s >= 95) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    if (s >= 90) return "bg-primary/10 text-primary";
    return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
  };

  const [currentStatus, setCurrentStatus] = useState(candidate.status || 'Applied');

  const handleStatusChange = async (newStatus: string) => {
    try {
      await candidateApi.toggleStatus(candidate._id, newStatus);
      setCurrentStatus(newStatus);
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center gap-4 group transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 relative">
      <input 
        className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer" 
        type="checkbox"
      />
      <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/10 relative group-hover:scale-105 transition-transform">
        <div className="h-full w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 text-xs">
          {candidate.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{candidate.name}</h4>
          <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded", getScoreBadge(score))}>
            {score}% Match
          </span>
        </div>
        <p className="text-[11px] text-slate-500 truncate font-medium">
          Senior Software Engineer • {candidate.location || "London, UK"} • {candidate.parsedResume?.yearsExperience || 8}+ years exp
        </p>
      </div>
      <div className="hidden md:flex flex-wrap gap-2 max-w-md justify-end">
        {(candidate.skills || ['Python', 'React', 'AWS']).slice(0, 3).map((skill: string) => (
          <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1 ml-4">
        <select 
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg active:scale-90">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </button>
      </div>
    </div>
  );
};

export default function TalentPoolPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    skills: [] as string[],
    experience: '',
    location: '',
  });
  const [globalResults, setGlobalResults] = useState<any>(null);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);

  // Persistence
  React.useEffect(() => {
    const saved = localStorage.getItem('talent-pool-filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSearch(parsed.search || '');
      setFilters(parsed.filters || { skills: [], experience: '', location: '' });
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('talent-pool-filters', JSON.stringify({ search, filters }));
  }, [search, filters]);

  const { data: candidatesData, isLoading } = useCandidates({ 
    search, 
    skills: filters.skills.join(','),
    experience: filters.experience,
    location: filters.location
  });
  
  const candidates = candidatesData?.data?.candidates || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const handleSaveSearch = async () => {
    const name = prompt('Enter a name for this search:');
    if (!name) return;
    try {
      await candidateApi.saveSearch(name, { search, filters });
      alert('Search saved successfully!');
    } catch (err) {
      alert('Failed to save search.');
    }
  };

  const handleBulkMessage = async () => {
    const message = prompt('Enter the message to send to all matching candidates:');
    if (!message) return;
    try {
      await candidateApi.bulkMessage(candidates.map((c: any) => c._id), message);
      alert('Bulk message sent successfully!');
    } catch (err) {
      alert('Failed to send bulk message.');
    }
  };

  const handleGlobalSearch = async () => {
    if (!search) return;
    setIsGlobalSearching(true);
    try {
      const res = await api.get('/search', { params: { q: search } });
      setGlobalResults(res.data.data);
    } catch (err) {
      console.error('Global search failed');
    } finally {
      setIsGlobalSearching(false);
    }
  };

  return (
    <DashboardLayout>
      <main className="flex flex-col lg:flex-row gap-6 max-w-[1440px] mx-auto w-full p-4 lg:p-0">
        <TalentPoolFilters 
          selectedSkills={filters.skills} 
          onToggleSkill={toggleSkill} 
        />
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">TalentPool Global Search</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Querying {candidates.length.toLocaleString()}+ profiles across all enterprise nodes</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveSearch}
                  className="flex items-center gap-2 rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">bookmark</span>
                  Save Search
                </button>
                <button 
                  onClick={handleBulkMessage}
                  className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  Bulk Message
                </button>
              </div>
            </div>

            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="block w-full p-4 pl-12 text-lg text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-primary focus:border-primary dark:bg-slate-900 dark:border-slate-800 dark:placeholder-slate-500 dark:text-white shadow-sm" 
                placeholder="Search by name, role, skill, or AI-powered natural language..." 
                type="text"
                value={search}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                <button 
                  onClick={handleGlobalSearch}
                  disabled={isGlobalSearching}
                  className="h-10 px-4 bg-primary/10 text-primary text-sm font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {isGlobalSearching ? 'Searching...' : 'Global Search'}
                </button>
              </div>
            </div>

            {globalResults && (
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">public</span>
                    Global Discovery Results
                  </h3>
                  <button onClick={() => setGlobalResults(null)} className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px]">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <span className="block font-bold text-slate-900 dark:text-white mb-1">Jobs ({globalResults.jobs.length})</span>
                    {globalResults.jobs.slice(0, 2).map((j: any) => <div key={j._id} className="truncate text-slate-500">{j.title}</div>)}
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <span className="block font-bold text-slate-900 dark:text-white mb-1">Candidates ({globalResults.candidates.length})</span>
                    {globalResults.candidates.slice(0, 2).map((c: any) => <div key={c._id} className="truncate text-slate-500">{c.name}</div>)}
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <span className="block font-bold text-slate-900 dark:text-white mb-1">Interviews ({globalResults.interviews.length})</span>
                    {globalResults.interviews.slice(0, 2).map((i: any) => <div key={i._id} className="truncate text-slate-500">{i.description || 'Schedule'}</div>)}
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
                    <span className="block font-bold text-slate-900 dark:text-white mb-1">Requests ({globalResults.requests.length})</span>
                    {globalResults.requests.slice(0, 2).map((r: any) => <div key={r._id} className="truncate text-slate-500">{r.candidateId?.name || 'Request'}</div>)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Quick Toggles:</span>
              {filters.skills.map(skill => (
                <button 
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="flex items-center gap-1.5 h-8 rounded-full bg-primary/10 text-primary px-3 text-xs font-semibold border border-primary/20 hover:bg-primary/20"
                >
                  {skill} <span className="material-symbols-outlined text-xs">close</span>
                </button>
              ))}
              <button 
                onClick={() => setFilters({ skills: [], experience: '', location: '' })}
                className="text-primary text-xs font-bold hover:underline ml-2 transition-all active:scale-95"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-1">
              {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-bold italic">Querying enterprise nodes...</div>
              ) : candidates.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold">No matching profiles found in the global pool.</div>
              ) : (
                candidates.map((candidate: any) => (
                  <CandidateRow key={candidate._id} candidate={candidate} />
                ))
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">Showing <span className="font-bold text-slate-900 dark:text-slate-100">1-{candidates.length}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{candidates.length.toLocaleString()}</span> profiles</p>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="h-8 w-8 rounded bg-primary text-white text-xs font-bold">1</button>
                <button className="h-8 w-8 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50">2</button>
                <button className="h-8 w-8 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50">3</button>
                <button className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
