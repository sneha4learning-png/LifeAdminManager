import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  History,
  LayoutDashboard,
  Moon,
  Sun,
  CheckCircle2,
  Calendar,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

const cn = (...inputs) => twMerge(clsx(inputs));

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'Premium Member' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Reminders', path: '/tasks', icon: CheckCircle2 },
    { name: 'My Documents', path: '/documents', icon: FileText },
    { name: 'Add Reminder', path: '/tasks/new', icon: PlusCircle },
    { name: 'Add Document', path: '/add-document', icon: PlusCircle },
    { name: 'Audit Logs', path: '/audit', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-dual-theme overflow-hidden font-sans transition-colors duration-200">
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent z-[100]" />
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 sidebar-premium z-20 transition-colors duration-200">
        <div className="p-6">
           <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
              <Logo className="scale-90 origin-left" light={true} />
           </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 opacity-50">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group relative",
                  isActive 
                    ? "nav-item-active-dual" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 shadow-none"
                )}
              >
                <item.icon size={18} className={cn("transition-transform", isActive ? "stroke-[2.5px]" : "stroke-[1.5px] opacity-70 group-hover:opacity-100")} />
                <span className={cn("text-sm font-semibold", !isActive && "tracking-wide")}>{item.name}</span>
                {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xs shrink-0 capitalize">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate capitalize">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate opacity-70">{user.role}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-danger-text transition-all group"
           >
             <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
             <span>Sign Out Vault</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 header-dual flex items-center justify-between px-6 sticky top-0 z-30 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4 min-w-0">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden p-2.5 bg-neutral-bg border border-neutral-border text-brand-primary rounded-xl shadow-soft-sm shrink-0"
             >
               <Menu size={22} />
             </button>
             <div className="flex items-center gap-3 min-w-0">
                <div className="h-4 w-1 bg-brand-primary rounded-full shrink-0" />
                <h2 className="text-sm font-bold text-neutral-primary uppercase tracking-widest truncate">Vault <span className="text-brand-primary">Active</span></h2>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
               onClick={toggleDarkMode}
               className="p-2 text-neutral-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
               title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <button className="relative p-2 text-neutral-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-danger-text rounded-full border-2 border-neutral-card" />
             </button>
             <button className="p-2 text-neutral-secondary hover:text-neutral-primary hover:bg-neutral-bg rounded-lg transition-all">
               <Settings size={20} />
             </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 sidebar-premium shadow-soft-xl flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="scale-75 origin-left" light={true} />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-2"><X size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 opacity-50">Vault Menu</p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                    location.pathname === item.path 
                      ? "nav-item-active-dual" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xs shrink-0 capitalize">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate capitalize">{user.name}</p>
                    <p className="text-[10px] font-medium text-slate-400 truncate opacity-70">{user.role}</p>
                  </div>
               </div>
               <button 
                 onClick={() => {
                   setIsMobileMenuOpen(false);
                   handleLogout();
                 }}
                 className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-danger-text transition-all group"
               >
                 <LogOut size={18} className="text-danger-text" />
                 <span>Sign Out Vault</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Layout;
