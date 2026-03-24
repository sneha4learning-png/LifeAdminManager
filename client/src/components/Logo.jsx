import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  ShieldCheck 
} from 'lucide-react';

const cn = (...inputs) => twMerge(clsx(inputs));

const Logo = ({ className, light = false }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
        light 
          ? "bg-white/10 text-white border border-white/20 backdrop-blur-sm" 
          : "bg-brand-primary/10 text-brand-primary border border-brand-primary/10"
      )}>
        <ShieldCheck size={22} className="stroke-[2.5px]" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "text-2xl font-black leading-none tracking-tight",
            light 
              ? "text-white" 
              : "bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent"
          )}>
            Life
          </span>
          <span className={cn(
            "text-2xl font-black leading-none tracking-tight",
            light ? "text-white/80" : "text-neutral-primary"
          )}>
            Admin Project
          </span>
        </div>
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-[0.3em] mt-1.5 leading-none opacity-60",
          light ? "text-white/40" : "text-neutral-secondary"
        )}>
          Master Secure Vault
        </span>
      </div>


    </div>
  );
};


export default Logo;
