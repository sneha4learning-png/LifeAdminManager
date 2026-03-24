import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus, 
  Calendar, 
  Tag, 
  Bell, 
  StickyNote, 
  ChevronLeft,
  X,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const AddDocument = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/documents', data);
      navigate('/documents');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Back & Title */}
      <div className="flex flex-col gap-4">
        <Link to="/documents" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-secondary hover:text-brand-primary transition-colors">
          <ChevronLeft size={16} />
          Back to Documents
        </Link>
        <div className="flex items-center justify-between">
           <h1 className="heading-xl">Add New Document</h1>
           <div className="hidden sm:flex items-center gap-2 text-brand-primary bg-brand-light dark:bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-brand-primary/10">
             <ShieldCheck size={14} />
             <p className="text-[10px] font-bold uppercase tracking-widest">Secure Entry</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card p-6 md:p-10 space-y-8">
              {/* Field 1: Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-secondary flex items-center gap-2 uppercase tracking-widest">
                  <Target size={14} />
                  Document Name
                </label>
                <input 
                  {...register('name', { required: 'Document label is required' })}
                  placeholder="e.g. Passport 2024"
                  className={cn(
                    "input-field",
                    errors.name && "border-danger-text focus:ring-danger-text/10 focus:border-danger-text"
                  )}
                />
                {errors.name && <p className="text-[10px] text-danger-text font-medium mt-1 uppercase tracking-widest">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field 2: Category */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-secondary flex items-center gap-2 uppercase tracking-widest">
                    <Tag size={14} />
                    Category
                  </label>
                  <select 
                    {...register('category', { required: 'Category is required' })}
                    className="input-field cursor-pointer appearance-none"
                  >
                    <option value="Other">Other</option>
                    <option value="ID">Identity Card / Passport</option>
                    <option value="Finance">Financial Document</option>
                    <option value="Bills">Bills & Receipts</option>
                  </select>
                </div>

                {/* Field 3: Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-secondary flex items-center gap-2 uppercase tracking-widest">
                    <Calendar size={14} />
                    Expiry Date
                  </label>
                  <input 
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('expiryDate', { required: 'Expiry date is required' })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Field 4: Alert Lead Time */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-secondary flex items-center gap-2 uppercase tracking-widest">
                  <Bell size={14} />
                  Reminder (Days Before)
                </label>
                <div className="flex items-center gap-4">
                   <input 
                    type="number"
                    min="1"
                    defaultValue={3}
                    {...register('reminderDaysBefore', { 
                      required: 'Required', 
                      min: { value: 1, message: 'Minimum 1 day' },
                      valueAsNumber: true
                    })}
                    className={cn(
                        "w-20 px-4 py-2.5 rounded-lg bg-brand-light dark:bg-brand-primary/10 border border-brand-primary/20 text-lg font-bold text-brand-primary text-center outline-none focus:ring-2 focus:ring-brand-primary/20",
                        errors.reminderDaysBefore && "border-danger-text"
                    )}
                  />
                  <div>
                    <p className="text-xs text-neutral-secondary">Set an earlier warning (e.g. 14 or 30 days) or keep the standard 3-day reminder.</p>
                    {errors.reminderDaysBefore && <p className="text-[10px] text-danger-text font-bold mt-1 uppercase tracking-widest">{errors.reminderDaysBefore.message}</p>}
                  </div>
                </div>
              </div>

              {/* Field 5: Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-secondary flex items-center gap-2 uppercase tracking-widest">
                  <StickyNote size={14} />
                  Additional Notes
                </label>
                <textarea 
                  {...register('notes')}
                  rows="3"
                  placeholder="Add any extra details here..."
                  className="input-field resize-none h-32"
                ></textarea>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-danger-bg border border-danger-text/10 rounded-lg text-danger-text text-xs font-bold flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary gap-2"
              >
                {loading ? 'Saving...' : 'Add Document'}
                {!loading && <ArrowRight size={18} />}
              </button>
              <Link to="/documents" className="btn btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
           <div className="p-6 bg-brand-accent rounded-xl text-white relative overflow-hidden group shadow-soft-lg">
              <div className="relative z-10 space-y-4">
                 <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-brand-accent transition-all duration-300">
                    <Sparkles size={18} />
                 </div>
                 <h4 className="text-xs font-bold uppercase tracking-widest">Quick Tip</h4>
                 <p className="text-sm font-medium leading-relaxed">It's common to set reminders 14-30 days in advance for passports to allow enough renewal time.</p>
              </div>
              <Zap size={100} className="absolute -right-8 -bottom-8 text-white/5 opacity-50 transition-transform duration-700" />
           </div>

           <div className="p-6 card space-y-4 border-dashed">
              <h4 className="text-xs font-bold text-neutral-primary uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-primary" />
                Data Security
              </h4>
              <ul className="space-y-3">
                {["Encrypted Storage", "Automated Expiry Checks", "Private Vault Protocol"].map((text, i) => (
                   <li key={i} className="flex items-center gap-3 text-xs font-medium text-neutral-secondary">
                     <div className="w-1 h-1 rounded-full bg-brand-primary shrink-0" />
                     {text}
                   </li>
                ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};


export default AddDocument;
