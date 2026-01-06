'use client';

import { LOADING_FRAMES } from '@/constants/ascii';
import { useEffect, useState } from 'react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = 'Loading', size = 'md' }: LoadingProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % LOADING_FRAMES.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-terminal-accent ${sizeClasses[size]}`}>
      <span className="w-4 text-center">{LOADING_FRAMES[frameIndex]}</span>
      <span>{text}</span>
    </div>
  );
}

export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 bg-terminal-bg/80 flex items-center justify-center z-50">
      <div className="border border-terminal-border bg-terminal-bg p-6">
        <Loading text={text} size="lg" />
      </div>
    </div>
  );
}

export function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-6 text-left">{dots}</span>;
}
