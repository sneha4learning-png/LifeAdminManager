import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Lock, 
  Target, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Settings = () => {
  const [formData, setFormData] = useState({
    targetEmail: ''
  });
  const [profileName, setProfileName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          axios.get('/api/settings'),
          axios.get('/api/auth/me')
        ]);
        setFormData({ 
          targetEmail: settingsRes.data.targetEmail || '',
          emailUser: settingsRes.data.emailUser || ''
        });
        setProfileName(profileRes.data.name || '');
      } catch (err) {
        console.error('Failed to load profile settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setMessage(null);
    try {
      await axios.put('/api/auth/profile', { name: profileName });
      // Update local storage so sidebar/dashboard update immediately
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.name = profileName;
        localStorage.setItem('user', JSON.stringify(user));
      }
      setMessage({ type: 'success', text: 'Profile updated successfully! Your new name is now active.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please check your internet connection and try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await axios.post('/api/settings', formData);
      setMessage({ type: 'success', text: 'Notification settings updated! We\'ll send reminders to ' + formData.targetEmail });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update notification settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-neutral-secondary animate-pulse">Loading your profile and settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="heading-xl">Profile & Notifications</h1>
        <p className="text-sm text-neutral-secondary mt-1">Manage your personal information and how you receive alerts.</p>
      </div>

      {/* Identity Profile Section */}
      <form onSubmit={handleProfileSubmit} className="card p-8 flex flex-col md:flex-row items-center gap-8 border-b-4 border-b-brand-primary/20">
        <div className="w-20 h-20 rounded-2xl bg-brand-primary flex items-center justify-center text-white text-3xl font-bold uppercase shadow-soft-lg shrink-0">
          {profileName.charAt(0)}
        </div>
        <div className="flex-1 space-y-4 w-full">
           <div className="space-y-1">
             <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Full Name</label>
             <div className="flex flex-col sm:flex-row items-center gap-3">
               <input 
                 type="text" 
                 value={profileName}
                 onChange={(e) => setProfileName(e.target.value)}
                 className="input-field flex-1 h-12 text-lg font-bold capitalize"
                 placeholder="Your Name"
                 required
               />
               <button 
                type="submit" 
                disabled={profileSaving}
                className="btn btn-primary h-12 px-6 whitespace-nowrap gap-2"
               >
                 <Save size={18} />
                 {profileSaving ? 'Saving...' : 'Update Name'}
               </button>
             </div>
           </div>
           <p className="text-xs text-neutral-secondary flex items-center gap-2">
             <Mail size={12} />
             Registered Login: <strong>{JSON.parse(localStorage.getItem('user'))?.email}</strong>
           </p>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-neutral-border pb-4">
                 <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                    <Target size={18} />
                 </div>
                 <div>
                    <h2 className="font-bold text-neutral-primary uppercase tracking-widest text-xs">Notification Settings</h2>
                    <p className="text-[10px] text-neutral-secondary mt-0.5">Where should we send your reminder emails?</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1 flex items-center gap-2">
                         Email for Notifications
                         <div className="group relative">
                           <AlertCircle size={12} className="text-neutral-secondary/50 cursor-help" />
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-neutral-primary text-white text-[9px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                             Enter the email address where you want to receive reminders.
                           </div>
                         </div>
                       </label>
                       <div className="relative max-w-md">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-secondary/50" />
                          <input 
                            type="email" 
                            className="input-field w-full pl-10 h-11"
                            placeholder="alerts-receiver@your-email.com"
                            value={formData.targetEmail}
                            onChange={(e) => setFormData({...formData, targetEmail: e.target.value})}
                            required
                          />
                       </div>
                    </div>
                    <p className="text-xs text-neutral-secondary leading-relaxed bg-neutral-bg p-4 rounded-lg border border-neutral-border italic">
                       Your reminder system is active. Just enter your preferred email address above to start receiving notifications.
                    </p>
                 </div>
              </div>
            </div>

            {message && (
              <div className={cn(
                "p-4 rounded-xl flex items-center gap-3 text-xs font-bold border animate-in slide-in-from-top-2",
                message.type === 'success' ? "bg-success-bg border-success-text/10 text-success-text" : "bg-danger-bg border-danger-text/10 text-danger-text"
              )}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <div className="pt-4 flex justify-end">
               <button 
                type="submit" 
                disabled={saving}
                className="btn btn-primary px-8 gap-2 bg-brand-primary text-white py-3 rounded-lg font-bold"
               >
                 {saving ? 'Saving...' : (
                   <>
                     <Save size={18} />
                     Save Settings
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="card p-6 bg-brand-primary text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">Privacy & Security</h3>
                    <p className="text-xs text-white/70 mt-2 leading-relaxed font-medium">
                       Your information is kept private and secure. We never share your data with third parties.
                    </p>
                 </div>
              </div>
              <SettingsIcon className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
           </div>

           <div className="card p-6 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary">System Status</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Email System', status: formData.emailUser ? 'Active' : 'Offline', ok: !!formData.emailUser },
                   { label: 'Encryption', status: 'Operational', ok: true },
                   { label: 'Recipient Email', status: formData.targetEmail ? 'Verified' : 'Unset', ok: !!formData.targetEmail }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-primary">{item.label}</span>
                      <div className="flex items-center gap-2">
                         <span className={cn("text-[10px] font-bold uppercase", item.ok ? "text-success-text" : "text-danger-text")}>{item.status}</span>
                         <div className={cn("w-1.5 h-1.5 rounded-full", item.ok ? "bg-success-bg shadow-[0_0_8px_rgba(22,163,74,0.5)]" : "bg-danger-bg")} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
