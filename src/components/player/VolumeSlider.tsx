'use client';

import { useRef, useCallback } from 'react';

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
}

export function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateVolume = useCallback((clientX: number): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    onChange(calculateVolume(e.clientX));
  }, [calculateVolume, onChange]);

  return (
    <div
      ref={containerRef}
      className="relative h-1.5 cursor-pointer bg-terminal-border"
      onClick={handleClick}
    >
      <div
        className="absolute inset-y-0 left-0 bg-terminal-accent"
        style={{ width: `${volume}%` }}
      />
    </div>
  );
}
