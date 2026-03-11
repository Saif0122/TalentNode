'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Resumes', icon: 'description', href: '/resumes/upload' },
  { label: 'Jobs', icon: 'work', href: '/jobs' },
  { label: 'Candidates', icon: 'group', href: '/candidates' },
  { label: 'Talent Pool', icon: 'person_add', href: '/talent-pool' },
  { label: 'Analytics', icon: 'analytics', href: '/analytics' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark flex flex-col h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl">hub</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-primary dark:text-slate-100">TalentNode</h1>
          <p className="text-xs text-slate-500">Recruiter Portal</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-sm" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5"
              )}
            >
              <span className={cn("material-symbols-outlined", isActive && "filled-icon")}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-primary/10">
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/5 transition-all duration-200"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 bg-primary/5 m-4 rounded-xl border border-primary/10">
        <p className="text-xs font-bold text-primary dark:text-primary uppercase tracking-wider mb-2">Pro Plan</p>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-3/4 animate-pulse-slow"></div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 font-medium">750/1000 AI Credits used</p>
      </div>
    </aside>
  );
};
