import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Eye,
  EyeOff
} from 'lucide-react';
import Logo from '../components/Logo';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Register = () => {
  const { register: authRegister } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError(null);
    const result = await authRegister(data.name, data.email, data.password);
    if (result.success) {
      navigate('/');
    } else {
      setAuthError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col md:flex-row relative overflow-hidden transition-colors duration-200 text-neutral-primary">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

      {/* Left Panel: Branding & Features (Desktop) */}
      <div className="hidden lg:flex w-2/5 xl:w-1/2 bg-brand-primary relative p-16 flex-col justify-between overflow-hidden group shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent opacity-90" />
         
         <div className="relative z-10 flex flex-col h-full">
            <Link to="/" className="group inline-block">
               <Logo className="scale-110 origin-left" light={true} />
            </Link>
            
            <div className="mt-24 space-y-10">
               <h2 className="text-5xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                 Secure Your <br />
                 <span className="text-white underline decoration-white/30 underline-offset-8">Digital Assets.</span>
               </h2>
               <p className="text-xl text-white/80 font-medium max-w-lg leading-relaxed">
                 Join thousands who trust this platform to manage their life administration efficiently and securely.
               </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-8">
               {[
                 { icon: ShieldCheck, title: "Zero Knowledge", text: "End-to-end security" },
                 { icon: Zap, title: "Smart Alerts", text: "Predictive tracking" },
                 { icon: CheckCircle2, title: "Audit Ready", text: "Compliance logs" },
                 { icon: Clock, title: "Time Saver", text: "Automated tasks" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col gap-3 group/item">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover/item:bg-white group-hover/item:text-brand-primary transition-all duration-300">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest leading-none">{item.title}</h4>
                      <p className="text-xs text-white/60 font-medium mt-1.5">{item.text}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="relative z-10 flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] border-t border-white/10 pt-8 mt-12">
               <span>Production v2.0.0</span>
               <div className="w-2 h-2 rounded-full bg-success-bg shadow-sm" />
               <span>Gateway Open</span>
            </div>
         </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative z-10 bg-neutral-bg">
        <div className="w-full max-w-sm space-y-12">
          
          <div className="text-left space-y-4">
             <div className="lg:hidden mb-10">
                <Logo className="scale-125 origin-left" light={false} />
             </div>
             <h1 className="text-3xl font-bold text-neutral-primary tracking-tight">
               Create <span className="text-brand-primary">Vault</span>
             </h1>
             <p className="text-neutral-secondary font-medium text-sm">Initialize your secure document repository</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input 
                    type="text" 
                    {...register('name', { required: 'Full name is required' })}
                    placeholder="Enter your name"
                    className="input-field pl-12 w-full px-6 py-3 rounded-lg bg-neutral-bg border border-neutral-border transition-all outline-none font-medium text-neutral-primary placeholder:text-neutral-secondary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                {errors.name && <p className="text-danger-text text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    placeholder="name@company.com"
                    className="input-field pl-12 w-full px-6 py-3 rounded-lg bg-neutral-bg border border-neutral-border transition-all outline-none font-medium text-neutral-primary placeholder:text-neutral-secondary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                {errors.email && <p className="text-danger-text text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest">{errors.email.message}</p>}
              </div>



              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary ml-1">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12 w-full px-6 py-3 rounded-lg bg-neutral-bg border border-neutral-border transition-all outline-none font-medium text-neutral-primary placeholder:text-neutral-secondary focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-secondary/50 hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-danger-text text-[10px] font-bold mt-1 ml-4 uppercase tracking-widest">{errors.password.message}</p>}
              </div>
            </div>

            {authError && (
              <div className="p-4 bg-danger-bg border border-danger-text/10 rounded-lg text-danger-text text-xs font-bold flex items-center gap-3">
                <AlertCircle size={20} />
                {authError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-3.5 gap-3 bg-brand-primary text-white rounded-lg font-bold flex items-center justify-center transition-all hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Vault...' : 'Create Account'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center font-bold text-neutral-secondary text-sm">
            Already have a key? <Link to="/login" className="text-brand-primary hover:underline underline-offset-4 font-bold ml-1">Authorize Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
