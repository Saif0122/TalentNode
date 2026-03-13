'use client';
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useUserProfile, useUpdateProfile, useUpdatePassword, useUpdateNotificationSettings } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
];

export default function SettingsPage() {
  const { data: profileObj, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const updateNotifications = useUpdateNotificationSettings();

  const user = profileObj?.data || {};

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState<any>({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        company: user.company || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        preferredLanguage: user.preferredLanguage || 'en',
        timezone: user.timezone || 'UTC'
      });
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    updateProfile.mutate(formData, {
      onSuccess: () => setMessage({ type: 'success', text: 'Profile updated successfully!' }),
      onError: (err: any) => setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed' })
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }
    updatePassword.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      },
      onError: (err: any) => setMessage({ type: 'error', text: err.response?.data?.error || 'Password update failed' })
    });
  };

  const handleToggleNotification = (key: string) => {
    const currentPrefs = user.notificationPreferences || {};
    const updatedPrefs = { ...currentPrefs, [key]: !currentPrefs[key] };
    
    updateNotifications.mutate({ notificationPreferences: updatedPrefs }, {
      onSuccess: () => setMessage({ type: 'success', text: 'Notification preferences updated!' })
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex flex-col p-8 w-full max-w-5xl mx-auto items-center justify-center">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col p-8 w-full max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your profile, security preferences, and account configuration.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                    activeTab === tab.id 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
            
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={cn("p-4 rounded-xl mb-6 text-sm font-medium border", 
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200')}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {activeTab === 'profile' && (
              <motion.form 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onSubmit={handleProfileSubmit} 
                className="space-y-6"
              >
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden text-2xl font-black text-slate-400">
                    {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                    <p className="text-sm text-slate-500 mb-3">PNG, JPG under 5MB</p>
                    <div className="flex gap-3">
                      <button type="button" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors">Upload</button>
                      <button type="button" className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-semibold transition-colors">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" value={formData.email || ''} disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-medium text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
                    <input type="text" value={formData.jobTitle || ''} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company</label>
                    <input type="text" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                    <textarea rows={4} value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={updateProfile.isPending} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50">
                    {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Change Password</h3>
                  <p className="text-sm text-slate-500 mb-4">Update your password associated with this account.</p>
                  
                  {user?.provider === 'google' ? (
                    <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-500 text-sm font-medium flex gap-3 items-start">
                      <span className="material-symbols-outlined shrink-0 text-xl">info</span>
                      <p>Your account is authenticated via Google Workspace. Password changes must be managed through Google.</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                        <input type="password" required value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input type="password" required minLength={6} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input type="password" required minLength={6} value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm" />
                      </div>
                      <button type="submit" disabled={updatePassword.isPending} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 mt-2">
                         {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">Alert Preferences</h3>
                  <p className="text-sm text-slate-500 mb-6">Choose what you want to be notified about.</p>

                  <div className="space-y-4">
                    {[
                      { id: 'emailAlerts', title: 'Email Alerts', description: 'Receive daily digests of new candidates.' },
                      { id: 'pushNotifications', title: 'Push Notifications', description: 'Mute all pop-up toast overlays in the app.' },
                      { id: 'jobUpdates', title: 'Job Lifecycle Updates', description: 'Alerts when a job post expires or receives a candidate.' },
                      { id: 'marketingEmails', title: 'Marketing Content', description: 'Tips, trends, and product updates from TalentNode.' }
                    ].map(pref => {
                       const isChecked = user?.notificationPreferences?.[pref.id] ?? true;
                       return (
                         <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800">
                           <div>
                             <p className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{pref.title}</p>
                             <p className="text-xs text-slate-500">{pref.description}</p>
                           </div>
                           <button 
                             onClick={() => handleToggleNotification(pref.id)}
                             className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0", isChecked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700")}
                           >
                              <div className={cn("size-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm", isChecked ? "left-6" : "left-1")} />
                           </button>
                         </div>
                       )
                    })}
                  </div>
                 </div>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
