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
  Trash2
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await axios.delete(`/api/documents/${id}`);
        fetchDocs();
      } catch (err) {
        alert('Failed to delete document');
      }
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || doc.category === filter || doc.status === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'ID', 'Finance', 'Bills', 'Other'];
  const statuses = ['Overdue', 'Upcoming', 'Safe'];

  if (loading) return (
    <div className="flex items-center justify-center p-20 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <Activity size={32} className="text-brand-primary animate-spin" />
        <p className="text-neutral-secondary font-medium text-sm">Accessing Vault Records...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="heading-xl">My Documents</h1>
          <p className="text-sm text-neutral-secondary mt-1">Manage and organize all your vault records in one place.</p>
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
              <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} onEdit={() => {}} />
            ) : (
              <div key={doc._id} className="card p-4 flex items-center justify-between group">
                 <div className="flex items-center gap-6 min-w-0 flex-1">
                    <div className={cn(
                       "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs",
                       doc.status === 'Overdue' ? 'bg-danger-bg text-danger-text' : (doc.status === 'Upcoming' ? 'bg-warning-bg text-warning-text' : 'bg-success-bg text-success-text')
                    )}>
                       {doc.category.slice(0,3)}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-bold text-neutral-primary group-hover:text-brand-primary transition-colors truncate">{doc.name}</h4>
                       <p className="text-xs text-neutral-secondary mt-0.5">Expires {new Date(doc.expiryDate).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 ml-6">
                    <div className="flex flex-col items-end whitespace-nowrap hidden sm:block">
                       <p className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          doc.status === 'Overdue' ? 'text-danger-text' : (doc.status === 'Upcoming' ? 'text-warning-text' : 'text-success-text')
                       )}>{doc.status}</p>
                       <p className="text-[10px] text-neutral-secondary">Status Monitoring</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 transition-all">
                       <button onClick={() => handleDelete(doc._id)} className="p-2 text-neutral-secondary hover:text-danger-text hover:bg-danger-bg rounded-lg transition-all" title="Delete"><Trash2 size={18} /></button>
                       <ChevronRight size={18} className="text-neutral-secondary group-hover:text-brand-primary" />
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
    </div>
  );
};


export default Documents;
