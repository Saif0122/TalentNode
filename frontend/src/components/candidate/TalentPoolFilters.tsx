'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FilterGroupProps {
  title: string;
  icon: string;
  children?: React.ReactNode;
  active?: boolean;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, icon, children, active }) => (
  <div className="flex flex-col">
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg cursor-pointer group transition-colors",
      active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-slate-50 dark:hover:bg-slate-800"
    )}>
      <div className="flex items-center gap-3">
        <span className={cn(
          "material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors",
          active && "text-primary filled-icon"
        )}>
          {icon}
        </span>
        <p className={cn("text-sm font-medium", active && "font-bold")}>{title}</p>
      </div>
      <span className="material-symbols-outlined text-sm text-slate-400">
        {active ? 'expand_more' : 'chevron_right'}
      </span>
    </div>
    {active && children && (
      <div className="px-3 py-2 flex flex-wrap gap-2 mb-2 animate-in fade-in slide-in-from-top-1">
        {children}
      </div>
    )}
  </div>
);

interface TalentPoolFiltersProps {
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
}

export const TalentPoolFilters: React.FC<TalentPoolFiltersProps> = ({ selectedSkills, onToggleSkill }) => {
  const commonSkills = ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'TypeScript'];
  
  return (
    <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col mb-6">
          <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            AI Filters
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Intelligent candidate refinement</p>
        </div>
        
        <div className="flex flex-col gap-1">
          <FilterGroup title="Skills" icon="memory" active>
            {commonSkills.map(skill => (
              <button 
                key={skill} 
                onClick={() => onToggleSkill(skill)}
                className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded border transition-all active:scale-95",
                  selectedSkills.includes(skill) 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-primary/50"
                )}
              >
                {skill}
              </button>
            ))}
          </FilterGroup>
          <FilterGroup title="Experience" icon="work" />
          <FilterGroup title="Education" icon="school" />
          <FilterGroup title="Location" icon="location_on" />
          <FilterGroup title="Match Confidence" icon="radar" />
        </div>

        <button className="w-full mt-6 flex items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
          Apply Intelligence
        </button>
      </div>
    </aside>
  );
};
