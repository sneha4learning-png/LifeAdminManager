import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  LayoutDashboard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Logo from '../components/Logo';

const cn = (...inputs) => twMerge(clsx(inputs));

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/');
    } else {
      setAuthError(result.message);
    }
    setLoading(false);
  };

  const handleAutoFill = () => {
    setValue('email', 'admin@lifeadmin.com', { shouldValidate: true });
    setValue('password', '1234', { shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col md:flex-row relative overflow-hidden font-sans transition-colors duration-200 text-neutral-primary">
      
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neutral-border/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none" />

      {/* Left Panel: Branding */}
      <div className="hidden lg:flex w-[40%] bg-brand-primary relative p-12 flex-col justify-between overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent opacity-90" />
         
         <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="group inline-block">
               <Logo className="scale-110 origin-left" light={true} />
            </Link>
            
            <div className="mt-auto mb-auto space-y-8">
               <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
                 Manage Your <br />
                 <span className="text-white underline decoration-white/30 underline-offset-8">Critical Documents</span>
               </h2>
               <p className="text-lg text-white/80 font-medium max-w-sm leading-relaxed">
                 The enterprise solution for tracking renewals, expirations, and essential records with automated smart alerts.
               </p>
               
               <div className="grid grid-cols-1 gap-6 pt-8">
                 {[
                   { icon: ShieldCheck, title: "Secure Storage", text: "Encrypted data protection" },
                   { icon: Clock, title: "Smart Alerts", text: "Automated renewal reminders" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">{item.title}</h4>
                        <p className="text-xs text-white/60 font-medium mt-1.5">{item.text}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] pt-8 border-t border-white/10">
               <span>Corporate Standard 2026</span>
               <div className="w-2 h-2 rounded-full bg-success-bg shadow-sm" />
            </div>
         </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16 relative z-10 bg-neutral-bg">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="space-y-4">
             <div className="lg:hidden mb-10">
                <Logo className="scale-125 origin-left" light={false} />
             </div>
             <h1 className="text-3xl font-bold text-neutral-primary tracking-tight">
               Welcome <span className="text-brand-primary">Back</span>
             </h1>
              <p className="text-neutral-secondary font-medium text-sm">Sign in to your secure vault</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type="email" 
                    {...register('email', { required: 'Email is required' })}
                    placeholder="name@company.com"
                    className="input-field pl-12"
                  />
                </div>
                {errors.email && <p className="text-danger-text text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 group-focus-within:text-brand-primary transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register('password', { required: 'Password is required' })}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-danger-text text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest">{errors.password.message}</p>}
              </div>
            </div>

            {authError && (
              <div className="p-4 bg-danger-bg border border-danger-text/10 rounded-lg text-danger-text text-xs font-bold flex items-center gap-3">
                <AlertCircle size={18} />
                {authError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-3.5 gap-3"
            >
              {loading ? 'Logging in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="pt-8 space-y-4">
             <button 
              type="button"
              onClick={handleAutoFill}
              className="w-full py-3 rounded-lg border border-neutral-border bg-neutral-card text-neutral-primary font-bold text-[11px] flex items-center justify-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-soft-md uppercase tracking-widest"
             >
               <Zap size={14} className="text-brand-primary" fill="currentColor" />
               Developer Quick Access
             </button>
             
             <p className="text-center font-bold text-neutral-secondary text-xs tracking-wide">
                Don't have an account? <Link to="/register" className="text-brand-primary hover:underline underline-offset-4 font-bold">Register</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Login;
