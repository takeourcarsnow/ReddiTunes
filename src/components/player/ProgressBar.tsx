'use client';

import { useRef, useCallback } from 'react';

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

export function ProgressBar({ progress, duration, onSeek }: ProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const calculatePosition = useCallback((clientX: number): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const percent = calculatePosition(e.clientX);
    onSeek((percent / 100) * duration);
  }, [calculatePosition, duration, onSeek]);

  return (
    <div
      ref={containerRef}
      className="relative h-2 cursor-pointer bg-terminal-border"
      onClick={handleClick}
    >
      <div
        className="absolute inset-y-0 left-0 bg-terminal-accent"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
