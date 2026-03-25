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
  User,
  History,
  LayoutDashboard,
  Moon,
  Sun,
  CheckCircle2
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
    <div className="flex h-screen bg-neutral-bg overflow-hidden font-sans transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-card border-r border-neutral-border z-20 transition-colors duration-200">
        <div className="p-6">
           <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
              <Logo className="scale-90 origin-left" />
           </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-neutral-secondary uppercase tracking-widest mb-4">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-brand-primary text-white shadow-soft-md" 
                    : "text-neutral-secondary hover:text-neutral-primary hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <item.icon size={18} className={cn("transition-transform", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-border space-y-4">
           <div className="flex items-center gap-3 px-3 py-3 bg-neutral-bg rounded-lg border border-neutral-border">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-xs shrink-0 capitalize">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-primary truncate capitalize">{user.name}</p>
                <p className="text-[10px] font-medium text-neutral-secondary truncate">{user.role}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-2 text-neutral-secondary font-medium text-sm hover:text-danger-text transition-all"
           >
             <LogOut size={16} />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-neutral-card border-b border-neutral-border flex items-center justify-between px-6 sticky top-0 z-30 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4 min-w-0">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden p-2 text-neutral-secondary hover:bg-neutral-bg rounded-lg shrink-0"
             >
               <Menu size={20} />
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
          <div className="fixed inset-y-0 left-0 w-64 bg-neutral-card shadow-soft-lg flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-neutral-border">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="scale-75 origin-left" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-secondary p-2"><X size={24} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path 
                      ? "bg-brand-primary text-white" 
                      : "text-neutral-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-neutral-primary"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};


export default Layout;
