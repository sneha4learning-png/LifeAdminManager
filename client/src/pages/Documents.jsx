import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  FolderDown,
  ChevronDown,
  SearchIcon,
  FilterIcon,
  ChevronRight,
  ArrowRight,
  Activity,
  Trash2,
  Edit,
  Pencil,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DocumentCard from '../components/DocumentCard';
import { Link } from 'react-router-dom';

const cn = (...inputs) => twMerge(clsx(inputs));

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('grid');
  const [editingDoc, setEditingDoc] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

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

  const handleEditDoc = (doc) => {
    setEditingDoc({
      ...doc,
      expiryDate: new Date(doc.expiryDate).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleUpdateDoc = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/documents/${editingDoc._id}`, editingDoc);
      setDocuments(documents.map(d => d._id === editingDoc._id ? res.data : d));
      setShowEditModal(false);
      setEditingDoc(null);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d._id !== id));
      try {
        await axios.delete(`/api/documents/${id}`);
      } catch (err) {
        console.error('Remote delete failed, record kept locally:', err);
      }
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'Completed') return doc.completed && matchesSearch;
    const matchesFilter = filter === 'All' || doc.category === filter || doc.status === filter;
    return matchesSearch && matchesFilter && !doc.completed; // Hide completed in other filters
  });

  const categories = ['All', 'ID', 'Finance', 'Bills', 'Completed', 'Other'];
  const statuses = ['Overdue', 'Upcoming', 'Safe'];

  if (loading) return (
    <div className="flex items-center justify-center p-20 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <Activity size={32} className="text-brand-primary animate-spin" />
        <p className="text-neutral-secondary font-medium text-sm">Loading your documents...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="heading-xl">My Documents</h1>
          <p className="text-sm text-neutral-secondary mt-1">All your important documents in one secure place.</p>
        </div>
        <Link to="/add-document" className="btn btn-primary gap-2">
           <PlusCircle size={18} />
           Add Document
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 card p-3">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <p className="text-xs font-bold text-neutral-secondary px-3 uppercase tracking-widest">Filter:</p>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all border",
                filter === cat 
                  ? "bg-brand-primary text-white border-brand-primary shadow-soft-md" 
                  : "bg-transparent text-neutral-secondary border-neutral-border hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
          <div className="w-px h-6 bg-neutral-border mx-2 hidden sm:block" />
          <div className="flex items-center gap-2">
             {statuses.map(status => (
                <button
                   key={status}
                   onClick={() => setFilter(status)}
                   className={cn(
                      "p-2 rounded-lg border transition-all",
                      filter === status ? "bg-black/5 dark:bg-white/5 border-brand-primary" : "bg-transparent border-neutral-border hover:bg-black/5 dark:hover:bg-white/5"
                   )}
                   title={status}
                >
                   <div className={cn(
                      "status-dot",
                      status === 'Overdue' ? 'status-danger' : (status === 'Upcoming' ? 'status-warning' : 'status-success')
                   )} />
                </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-border">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-xs text-neutral-primary placeholder:text-neutral-secondary/50"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-neutral-bg rounded-lg border border-neutral-border">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-2 rounded-md transition-all", view === 'grid' ? "bg-neutral-card text-brand-primary shadow-soft-md" : "text-neutral-secondary hover:text-neutral-primary")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-md transition-all", view === 'list' ? "bg-neutral-card text-brand-primary shadow-soft-md" : "text-neutral-secondary hover:text-neutral-primary")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Content */}
      {filteredDocs.length > 0 ? (
        <div className={cn(
          view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        )}>
          {filteredDocs.map(doc => (
            view === 'grid' ? (
              <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} onEdit={() => handleEditDoc(doc)} onRefresh={fetchDocs} />
            ) : (
              <div key={doc._id} className={cn("card p-4 flex items-center justify-between group", doc.completed && "opacity-60")}>
                 <div className="flex items-center gap-6 min-w-0 flex-1">
                    <div className={cn(
                       "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs shadow-soft-sm",
                       doc.completed ? "bg-success-bg text-brand-primary" : (doc.status === 'Overdue' ? 'bg-danger-bg text-danger-text border border-danger-text/10' : (doc.status === 'Upcoming' ? 'bg-warning-bg text-warning-text border border-warning-text/10' : 'bg-success-bg text-success-text border border-success-text/10'))
                    )}>
                       {doc.completed ? <CheckCircle2 size={24} /> : doc.category.slice(0,3).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-bold text-neutral-primary group-hover:text-brand-primary transition-colors truncate">{doc.name}</h4>
                       <p className="text-[10px] font-bold text-neutral-secondary mt-0.5 uppercase tracking-widest flex items-center gap-2">
                         <Calendar size={10} />
                         Expires {new Date(doc.expiryDate).toLocaleDateString()}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 ml-6">
                    <div className="flex flex-col items-end whitespace-nowrap hidden md:block">
                       <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          doc.status === 'Overdue' ? 'text-danger-text' : (doc.status === 'Upcoming' ? 'text-warning-text' : 'text-success-text')
                       )}>{doc.status}</p>
                       <p className="text-[9px] font-bold text-neutral-secondary uppercase tracking-tighter">Document Status</p>
                    </div>
                    <div className="flex items-center gap-1">
                       <button onClick={() => handleEditDoc(doc)} className="p-2 text-neutral-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all" title="Edit"><Pencil size={16} /></button>
                       <button onClick={() => handleDelete(doc._id)} className="p-2 text-neutral-secondary hover:text-danger-text hover:bg-danger-bg rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                       <ChevronRight size={18} className="text-neutral-secondary group-hover:text-brand-primary ml-1" />
                    </div>
                 </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center gap-6 card border-dashed">
          <div className="w-16 h-16 bg-neutral-bg rounded-xl flex items-center justify-center text-neutral-secondary/30">
            <LayoutGrid size={32} />
          </div>
          <div>
             <h3 className="text-lg font-bold text-neutral-primary">No matching records found</h3>
             <p className="text-sm text-neutral-secondary mt-1 max-w-sm mx-auto">Try adjusting your search query or clear the active filters.</p>
          </div>
          <button 
            onClick={() => { setSearch(''); setFilter('All'); }}
            className="text-brand-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2"
          >
            Clear Filters <ArrowRight size={14} />
          </button>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && editingDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-primary/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="bg-neutral-card w-full max-w-md rounded-2xl shadow-soft-xl relative z-10 overflow-hidden border border-neutral-border animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 border-b border-neutral-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="text-brand-primary" size={20} />
                <h3 className="font-bold text-neutral-primary">Modify Document</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-[10px] font-bold text-neutral-secondary hover:text-neutral-primary uppercase tracking-widest">Close</button>
            </div>
            
            <form onSubmit={handleUpdateDoc} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Document Name</label>
                <input 
                  autoFocus required type="text" 
                  className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-sm font-medium"
                  value={editingDoc.name}
                  onChange={e => setEditingDoc({...editingDoc, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-xs font-bold"
                    value={editingDoc.category}
                    onChange={e => setEditingDoc({...editingDoc, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'All' && c !== 'Completed').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Expiry Date</label>
                  <input 
                    type="date" required
                    className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-xs font-medium"
                    value={editingDoc.expiryDate}
                    onChange={e => setEditingDoc({...editingDoc, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Reminder (Days Before)</label>
                <input 
                  type="number" required min="1" max="365"
                  className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-sm font-medium"
                  value={editingDoc.reminderDaysBefore}
                  onChange={e => setEditingDoc({...editingDoc, reminderDaysBefore: e.target.value})}
                />
                <p className="text-[10px] text-neutral-secondary/60 mt-2 ml-1 leading-relaxed">
                  Set an earlier warning (e.g. 14 or 30 days) or keep the standard 3-day reminder for critical entries.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-3 rounded-xl border border-neutral-border text-[10px] font-bold text-neutral-secondary uppercase tracking-widest hover:bg-neutral-bg transition-all">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1 py-3.5 shadow-soft-md font-bold uppercase tracking-widest text-[10px]">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Documents;
