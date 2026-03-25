import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Tag, 
  Trash2, 
  AlertCircle,
  Clock,
  Filter,
  CheckCircle,
  MoreVertical,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Tasks = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    category: 'General'
  });

  useEffect(() => {
    fetchTasks();
    if (location.search.includes('new=true')) {
      setShowAddModal(true);
    }
  }, [location]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(`/api/tasks/${id}/toggle`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, res.data]);
      setShowAddModal(false);
      setNewTask({ title: '', dueDate: '', priority: 'Medium', category: 'General' });
    } catch (err) {
      console.error('Add failed', err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getPriorityColor = (p) => {
    switch (p) {
      case 'High': return 'text-danger-text bg-danger-bg dark:bg-danger-text/20';
      case 'Medium': return 'text-warning-text bg-warning-bg dark:bg-warning-text/20';
      case 'Low': return 'text-success-text bg-success-bg dark:bg-success-text/20';
      default: return 'text-neutral-secondary bg-neutral-bg';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <Activity className="text-brand-primary animate-spin" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-border">
        <div>
          <h1 className="heading-xl">My <span className="text-brand-primary">Reminders</span></h1>
          <p className="text-sm text-neutral-secondary mt-1">Manage your daily tasks and life events securely.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary gap-2 shadow-soft-lg group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          New Reminder
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-neutral-card border border-neutral-border rounded-xl w-fit shrink-0">
          {[
            { id: 'all', label: 'All', icon: CheckCircle2 },
            { id: 'pending', label: 'Pending', icon: Clock },
            { id: 'completed', label: 'Done', icon: CheckCircle }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                filter === f.id 
                  ? "bg-brand-primary text-white shadow-soft-sm" 
                  : "text-neutral-secondary hover:text-neutral-primary"
              )}
            >
              <f.icon size={14} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-neutral-secondary">
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-primary" /> {tasks.filter(t => !t.completed).length} Pending</span>
          <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success-text" /> {tasks.filter(t => t.completed).length} Completed</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div 
            key={task._id} 
            className={cn(
              "card p-4 flex items-center gap-4 group transition-all duration-300",
              task.completed && "opacity-60 bg-neutral-bg/50 grayscale-[0.3]"
            )}
          >
            <button 
              onClick={() => handleToggle(task._id)}
              className={cn(
                "shrink-0 transition-all transform hover:scale-110 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5",
                task.completed ? "text-success-text" : "text-neutral-secondary/50 hover:text-brand-primary"
              )}
              title={task.completed ? "Mark as Pending" : "Mark as Done"}
            >
              {task.completed ? <CheckCircle2 size={24} fill="currentColor" className="text-white" /> : <Circle size={24} />}
            </button>

            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "text-sm font-bold text-neutral-primary truncate",
                task.completed && "line-through text-neutral-secondary"
              )}>
                {task.title}
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                  <Tag size={12} />
                  {task.category}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                  getPriorityColor(task.priority)
                )}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleToggle(task._id)}
                className={cn(
                  "p-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  task.completed ? "bg-success-bg/20 text-success-text" : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white"
                )}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button 
                onClick={() => handleDelete(task._id)}
                className="p-2 text-neutral-secondary hover:text-danger-text transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 card border-dashed border-2 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-neutral-bg rounded-2xl flex items-center justify-center text-neutral-secondary shadow-inner">
                <Clock size={40} className="opacity-20 translate-y-1" />
             </div>
             <div>
                <h4 className="text-base font-bold text-neutral-primary">Nothing on your list</h4>
                <p className="text-sm text-neutral-secondary mt-1 max-w-xs mx-auto">Click "New Reminder" to start tracking your daily tasks and life events.</p>
             </div>
             <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm px-6"
             >
                Add Your First Task
             </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-neutral-primary/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="bg-neutral-card w-full max-w-md rounded-2xl shadow-soft-xl relative z-10 overflow-hidden border border-neutral-border animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 border-b border-neutral-border flex items-center justify-between">
              <h3 className="font-bold text-neutral-primary">Create New Reminder</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-secondary hover:text-neutral-primary p-1">Close</button>
            </div>
            
            <form onSubmit={handleAddTask} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">What needs doing?</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="Task title..."
                  className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm font-medium"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Due Date</label>
                  <input 
                    type="date" 
                    required
                    className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-xs font-medium"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Priority</label>
                  <select 
                    className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-xs font-bold"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest ml-1">Category (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Work, Home, Bank..."
                  className="input-field w-full px-4 py-3 rounded-xl bg-neutral-bg border border-neutral-border outline-none focus:border-brand-primary transition-all text-sm font-medium"
                  value={newTask.category}
                  onChange={e => setNewTask({...newTask, category: e.target.value})}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full py-3.5 mt-4 shadow-soft-md">
                Save Reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
