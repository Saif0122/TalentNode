'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-8 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Settings</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 font-medium">Settings dashboard is currently under development.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
