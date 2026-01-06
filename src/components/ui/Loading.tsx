'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  text?: string;
}

export function Loading({ text = 'Loading' }: LoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs text-terminal-accent">
      {text}{dots}
    </div>
  );
}
