'use client';

import React from 'react';
// Material Symbols are loaded via Google Fonts in globals.css

export const Header = () => {
  return (
    <header className="h-16 border-b border-primary/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 font-medium transition-all" 
            placeholder="Search candidates, jobs, or skills..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-primary transition-all active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 500" }}>notifications</span>
          <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-primary/20"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lead Recruiter</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
            <img 
              className="size-10 rounded-full object-cover ring-2 ring-primary/10 relative z-10 transition-transform group-hover:scale-105" 
              alt="Sarah Jenkins"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrVkY_iigihV26hlfjsgwvPSQZuIIgNlzaWcJN7X2793BpBH2iktUZbWGtbWbGF8wsJ5nE94v8UiygOVea0acivJqEOOdfmjchZYHeS8dHdlttIW7fLNGN2W2w6rjDyzx9k656Mh2Xzy6tPQlHtnBBjl9QtB0zNFuLReE_2Q6MU3Xfr2yAV5bKydQxFMo3tx03KYZNBWcyUF9xyiuRVDuqRXrAFWm8lj5bAD3IWmSB5MtPX0lfVzToyNtp8BcZCu-_-KT9xAqswwHI"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
