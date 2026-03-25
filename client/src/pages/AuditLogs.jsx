import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  Trash2, 
  RotateCw, 
  UserCircle,
  FileText,
  CheckCircle2,
  Activity,
  History
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/audit');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action) => {
    if (action.includes('CREATE')) return <PlusCircle size={14} className="text-success-text" />;
    if (action.includes('DELETE')) return <Trash2 size={14} className="text-danger-text" />;
    if (action.includes('LOGIN')) return <UserCircle size={14} className="text-brand-primary" />;
    if (action.includes('TOGGLE')) return <CheckCircle2 size={14} className="text-brand-primary" />;
    return <Activity size={14} className="text-neutral-secondary" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Activity className="text-brand-primary animate-spin" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="heading-xl">Activity <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">History</span></h1>
          <p className="text-sm text-neutral-secondary mt-1">A complete record of all actions taken in your account.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="p-2 text-neutral-secondary hover:text-brand-primary hover:bg-neutral-card transition-all rounded-lg"
          title="Refresh Logs"
        >
          <RotateCw size={20} />
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 bg-neutral-bg/50 border-b border-neutral-border flex items-center justify-between">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-secondary">Recent Activity</span>
           <span className="text-[10px] font-bold text-success-text flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-success-text animate-pulse" />
             Active Tracking
           </span>
        </div>

        <div className="max-h-[600px] overflow-y-auto divide-y divide-neutral-border scrollbar-thin scrollbar-thumb-neutral-secondary/20 hover:scrollbar-thumb-neutral-secondary/40">
          {logs.length > 0 ? logs.map((log) => (
            <div key={log._id} className="p-4 sm:p-6 hover:bg-neutral-bg/30 transition-colors flex gap-4">
               <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-neutral-bg border border-neutral-border flex items-center justify-center text-neutral-secondary">
                    {getIcon(log.action)}
                  </div>
                  <div className="w-px h-full bg-neutral-border mt-2" />
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                     <h4 className="text-sm font-bold text-neutral-primary tracking-tight">{log.details}</h4>
                     <span className="text-[10px] font-bold text-neutral-secondary bg-neutral-bg px-2 py-1 rounded">
                       {new Date(log.createdAt).toLocaleString()}
                     </span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">{log.action}</span>
                     <div className="w-1 h-1 rounded-full bg-neutral-border" />
                     <span className="text-[10px] font-bold text-neutral-secondary">IP: {log.ipAddress || 'Internal'}</span>
                  </div>
               </div>
            </div>
          )) : (
            <div className="py-20 flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 bg-neutral-bg rounded-2xl flex items-center justify-center text-neutral-secondary mb-4 opacity-30">
                  <History size={32} />
               </div>
               <h3 className="text-sm font-bold text-neutral-primary">History is empty</h3>
               <p className="text-xs text-neutral-secondary mt-1">Activity logs will appear here once you start using your account.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-start gap-4">
         <ShieldCheck className="text-brand-primary mt-1 shrink-0" size={20} />
         <div>
            <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">Security Records</h4>
            <p className="text-xs text-neutral-secondary mt-1 leading-relaxed">Every action is recorded with a timestamp for your security. These records cannot be deleted or changed.</p>
         </div>
      </div>
    </div>
  );
};

export default AuditLogs;
