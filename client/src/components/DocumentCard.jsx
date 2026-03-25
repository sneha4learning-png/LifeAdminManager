import React from 'react';
import axios from 'axios';
import { 
  Calendar, 
  BellRing, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const DocumentCard = ({ document, onEdit, onDelete, onRefresh }) => {
  const { name, category, expiryDate, reminderDaysBefore, status, notes, completed } = document;
  
  const getStatusStyles = () => {
    switch (status) {
      case 'Safe': return { bg: 'bg-success-bg text-success-text border-success-text/10', icon: ShieldCheck };
      case 'Upcoming': return { bg: 'bg-warning-bg text-warning-text border-warning-text/10', icon: Clock };
      case 'Overdue': return { bg: 'bg-danger-bg text-danger-text border-danger-text/10', icon: AlertCircle };
      default: return { bg: 'bg-neutral-bg text-neutral-secondary border-neutral-border', icon: ShieldCheck };
    }
  };

  const styles = getStatusStyles();
  const dateStr = new Date(expiryDate).toLocaleDateString();

  const handleTestReminder = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/documents/test-reminder/${document._id}`);
      if (res.data.previewUrl) {
        window.open(res.data.previewUrl, '_blank');
        alert('Success! I have opened a preview of your professional email in a new tab. A real copy has also been sent to your inbox.');
      } else {
        alert(res.data.message || 'Check your inbox! Your test reminder is on its way.');
      }
    } catch (err) {
      alert('We encountered an issue sending the reminder. Please verify your email configuration in settings.');
    }
  };

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    try {
      await axios.patch(`/api/documents/${document._id}`);
      onRefresh?.();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  return (
    <div className={cn(
      "card group flex flex-col h-full relative overflow-hidden transition-all duration-300",
      completed && "opacity-60 grayscale-[0.3] bg-neutral-bg/50"
    )}>
       {/* Card Header & Status */}
       <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 border-b border-neutral-border shrink-0">
          <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", styles.bg)}>
            <styles.icon size={12} />
            {completed ? 'COMPLETED' : status}
          </div>
          <div className="flex items-center gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit?.(document); }}
                className="p-1.5 text-neutral-secondary hover:text-brand-primary hover:bg-neutral-card rounded-md transition-colors"
                title="Edit"
              >
                <Edit2 size={14} />
              </button>
          </div>
       </div>
 
       {/* Card Content */}
       <div className="p-4 flex-1 space-y-4">
          <div className="space-y-1">
             <h3 className="text-sm font-bold text-neutral-primary group-hover:text-brand-primary transition-colors truncate">
               {name}
             </h3>
             <p className="text-[10px] font-medium text-neutral-secondary uppercase tracking-widest">{category}</p>
          </div>
 
          <div className="space-y-3 pt-3 border-t border-neutral-border">
             <div className="flex items-center gap-3">
                <Calendar size={14} className="text-neutral-secondary/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-primary">{dateStr}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Clock size={14} className="text-neutral-secondary/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-secondary">{reminderDaysBefore} Days Prior Alert</p>
                </div>
             </div>
          </div>
       </div>

       {/* Action Bar - Fixed Responsive Issues */}
       <div className="p-3 bg-neutral-bg/30 border-t border-neutral-border flex flex-wrap gap-2 mt-auto">
          <button 
              onClick={handleToggleComplete}
              className={cn(
                "py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-soft-sm flex items-center justify-center gap-1.5 flex-1 min-w-[80px]",
                completed ? "text-success-text bg-success-bg/30" : "text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white"
              )}
            >
              {completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
              {completed ? "Finished" : "Done"}
          </button>
          
          <button 
              onClick={handleTestReminder}
              className="py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-soft-sm flex items-center justify-center gap-1.5 flex-1 min-w-[80px] text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white"
            >
              <BellRing size={12} />
              Test Email
          </button>

          <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(document._id); }}
              className="py-2 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-soft-sm flex items-center justify-center gap-1.5 flex-1 min-w-[80px] text-danger-text bg-danger-bg/10 hover:bg-danger-text hover:text-white"
            >
              <Trash2 size={12} />
              Delete
          </button>
       </div>
    </div>
  );
};


export default DocumentCard;
