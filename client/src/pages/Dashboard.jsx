import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  FolderCheck,
  Clock,
  Activity,
  PlusCircle,
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DocumentCard from '../components/DocumentCard';
import { Link } from 'react-router-dom';

const cn = (...inputs) => twMerge(clsx(inputs));

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('/api/documents');
        setDocuments(res.data);
      } catch (err) {
        console.error('Failed to fetch docs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const stats = {
    total: documents.length,
    upcoming: documents.filter(doc => doc.status === 'Upcoming').length,
    overdue: documents.filter(doc => doc.status === 'Overdue').length,
    safe: documents.filter(doc => doc.status === 'Safe').length,
  };

  const criticalItems = documents.filter(doc => doc.status === 'Overdue').slice(0, 3);
  const upcomingItems = documents.filter(doc => doc.status === 'Upcoming').slice(0, 3);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-3">
        <Activity size={32} className="text-brand-primary animate-spin" />
        <p className="text-neutral-secondary font-medium text-sm">Accessing Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="heading-xl">Welcome back, <span className="text-brand-primary capitalize">{JSON.parse(localStorage.getItem('user'))?.name || 'User'}</span></h1>
          <p className="text-sm text-neutral-secondary mt-1">Easily monitor and manage your secure vault records.</p>
        </div>
        <Link to="/add-document" className="btn btn-primary gap-2">
          <PlusCircle size={18} />
          Add Document
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Documents', value: stats.total, icon: FolderCheck, color: 'text-brand-primary', bg: 'bg-brand-light dark:bg-brand-primary/10' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-warning-text', bg: 'bg-warning-bg dark:bg-warning-text/10' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-danger-text', bg: 'bg-danger-bg dark:bg-danger-text/10' },
          { label: 'Safe', value: stats.safe, icon: ShieldCheck, color: 'text-success-text', bg: 'bg-success-bg dark:bg-success-text/10' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center shrink-0", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-secondary mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-neutral-primary leading-none">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-brand-primary rounded-xl p-6 text-white overflow-hidden relative group shadow-soft-lg">
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                 <div>
                    <h3 className="text-lg font-bold">Vault Security</h3>
                    <p className="text-sm text-white/80 mt-2 leading-relaxed">Your documents are safe and currently being monitored for expiration.</p>
                 </div>
                 <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                    <span>Status: Optimal</span>
                    <div className="w-2 h-2 rounded-full bg-success-bg animate-pulse" />
                 </div>
              </div>
              <ShieldCheck className="absolute -right-8 -bottom-8 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform duration-700" />
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-secondary uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} className="text-danger-text" />
                Urgent Action
              </h3>
              <div className="space-y-3">
                 {criticalItems.length > 0 ? criticalItems.map(item => (
                   <Link to={`/documents`} key={item._id} className="flex items-center justify-between p-4 card hover:border-brand-primary transition-colors group">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="status-dot status-danger shrink-0" />
                       <p className="text-sm font-medium text-neutral-primary truncate">{item.name}</p>
                     </div>
                     <ChevronRight size={14} className="text-neutral-secondary group-hover:text-brand-primary transition-colors" />
                   </Link>
                 )) : (
                   <p className="text-xs text-neutral-secondary italic py-2">No urgent documents.</p>
                 )}
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-secondary uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-warning-text" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                 {upcomingItems.length > 0 ? upcomingItems.map(item => (
                   <Link to={`/documents`} key={item._id} className="flex items-center justify-between p-4 card hover:border-brand-primary transition-colors group">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="status-dot status-warning shrink-0" />
                       <p className="text-sm font-medium text-neutral-primary truncate">{item.name}</p>
                     </div>
                     <ChevronRight size={14} className="text-neutral-secondary group-hover:text-brand-primary transition-colors" />
                   </Link>
                 )) : (
                   <p className="text-xs text-neutral-secondary italic py-2">No upcoming deadlines.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Recent Items Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between card p-4">
              <div className="flex items-center gap-3 flex-1">
                 <Search size={18} className="text-neutral-secondary" />
                 <input type="text" placeholder="Search your vault..." className="text-sm text-neutral-primary bg-transparent outline-none w-full placeholder:text-neutral-secondary" />
              </div>
              <Link to="/documents" className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap ml-4">View All</Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.slice(0, 4).map(doc => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
              {documents.length === 0 && (
                <div className="col-span-full py-20 card border-dashed flex flex-col items-center justify-center gap-4 text-center p-8">
                   <div className="w-16 h-16 bg-neutral-bg rounded-lg flex items-center justify-center text-neutral-secondary">
                      <FolderCheck size={32} />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-neutral-primary">Vault is empty</h4>
                      <p className="text-xs text-neutral-secondary mt-1">Get started by adding your first document.</p>
                   </div>
                   <Link to="/add-document" className="btn btn-primary mt-2">
                     Add First Document
                   </Link>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
