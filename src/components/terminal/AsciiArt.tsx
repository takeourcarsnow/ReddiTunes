'use client';

import { LOGO_ASCII_SMALL, MUSIC_NOTES } from '@/constants/ascii';
import { useEffect, useState } from 'react';

export function AsciiLogo({ animated = false }: { animated?: boolean }) {
  const [noteIndex, setNoteIndex] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setNoteIndex((prev) => (prev + 1) % MUSIC_NOTES.length);
    }, 500);
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <div className="font-mono text-terminal-accent">
      <pre className="text-[8px] sm:text-xs leading-tight whitespace-pre">
        {LOGO_ASCII_SMALL}
      </pre>
      {animated && (
        <div className="text-center text-terminal-muted text-xs mt-1">
          {MUSIC_NOTES[noteIndex]} Now Playing {MUSIC_NOTES[(noteIndex + 2) % MUSIC_NOTES.length]}
        </div>
      )}
    </div>
  );
}

export function AsciiDivider({ char = '─', className = '' }: { char?: string; className?: string }) {
  return (
    <div className={`font-mono text-terminal-border overflow-hidden ${className}`}>
      {char.repeat(100)}
    </div>
  );
}

export function AsciiBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 border border-terminal-border pointer-events-none" />
      <div className="absolute top-0 left-2 px-1 bg-terminal-bg -translate-y-1/2">
        <span className="font-mono text-xs text-terminal-muted">╣</span>
      </div>
      <div className="absolute top-0 right-2 px-1 bg-terminal-bg -translate-y-1/2">
        <span className="font-mono text-xs text-terminal-muted">╠</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
