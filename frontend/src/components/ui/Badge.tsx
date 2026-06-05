import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline';
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  const baseStyles = 'px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase whitespace-nowrap shrink-0 inline-flex items-center justify-center';

  const variants = {
    success: 'bg-green-500/10 text-emerald-500 border border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    neutral: 'bg-zinc-600/10 text-zinc-400 border border-transparent',
    outline: 'bg-transparent text-cheese border border-cheese/30',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
}
