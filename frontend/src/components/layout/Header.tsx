'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
// Material Symbols are loaded via Google Fonts in globals.css

export const Header = () => {
  const { user } = useAuth();
  const { data: notificationsData } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative text-slate-500 hover:text-primary transition-all active:scale-95 flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 500" }}>notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllRead.mutate()}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-20">notifications_paused</span>
                      <p className="text-sm font-medium">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.map((notif: any) => (
                        <div 
                          key={notif._id} 
                          className={cn(
                            "p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 items-start group", 
                            !notif.read ? "bg-primary/[0.02]" : "opacity-75"
                          )}
                        >
                          <div className={cn(
                            "size-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                            notif.type === 'success' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10" :
                            notif.type === 'error' ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10" :
                            "bg-primary/10 text-primary"
                          )}>
                            <span className="material-symbols-outlined text-sm">
                              {notif.type === 'success' ? 'check_circle' : notif.type === 'error' ? 'error' : 'info'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-bold text-slate-900 dark:text-white mb-1", !notif.read && "font-black")}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2 block">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {!notif.read && (
                            <button 
                              onClick={() => markAsRead.mutate(notif._id)}
                              className="size-2 bg-primary rounded-full mt-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Mark as read"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-primary/20"></div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{user?.name || 'Guest User'}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.role || 'Visitor'}</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
            {/* Fallback avatar generator based on user name */}
            {user?.name ? (
               <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-black ring-2 ring-primary/10 relative z-10 transition-transform group-hover:scale-105 shadow-md shadow-primary/20">
                 {user.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
               </div>
            ) : (
               <img 
                 className="size-10 rounded-full object-cover ring-2 ring-primary/10 relative z-10 transition-transform group-hover:scale-105" 
                 alt="Guest"
                 src="https://ui-avatars.com/api/?name=Guest+User&background=6366f1&color=fff"
               />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
