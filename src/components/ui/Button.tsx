'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center font-mono border transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-terminal-bg border-terminal-border text-terminal-text hover:bg-terminal-hover hover:border-terminal-accent':
            variant === 'default',
          'bg-terminal-accent border-terminal-accent text-terminal-bg hover:brightness-110':
            variant === 'primary',
          'bg-transparent border-transparent text-terminal-text hover:bg-terminal-hover':
            variant === 'ghost',
          'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30':
            variant === 'danger',
        },
        {
          'px-2 py-1 text-xs': size === 'sm',
          'px-3 py-1.5 text-sm': size === 'md',
          'px-4 py-2 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
