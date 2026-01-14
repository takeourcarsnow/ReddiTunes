'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  text?: string;
  showText?: boolean;
}

export function Loading({ text = 'Loading', showText = true }: LoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full border-2 border-terminal-accent border-t-transparent animate-spin" aria-hidden></div>
      {showText && (
        <div className="font-mono text-xs text-terminal-accent">
          {text}{dots}
        </div>
      )}
    </div>
  );
} 
