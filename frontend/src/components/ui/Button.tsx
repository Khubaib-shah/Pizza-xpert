import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium uppercase tracking-wider transition-all rounded-xl focus:outline-none';

  const variants = {
    primary: 'bg-cheese text-black hover:bg-yellow-400',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
    danger: 'bg-burgundy text-white hover:bg-red-500 border border-cheese/30 hover:border-red-500/50',
    outline: 'bg-charcoal border border-white/5 text-cheese hover:bg-cheese hover:text-black hover:border-transparent',
    ghost: 'text-cream/50 hover:text-white bg-transparent hover:bg-white/5',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-1',
    md: 'text-xs px-4 py-2',
    lg: 'text-sm px-6 py-3',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
