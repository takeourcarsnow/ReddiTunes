'use client';

import { ThemeToggle } from '@/components/ui';
import { MUSIC_NOTES } from '@/constants/ascii';
import { useEffect, useState } from 'react';
import { Github, Radio } from 'lucide-react';

export function TerminalHeader() {
  const [time, setTime] = useState('');
  const [noteIndex, setNoteIndex] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNoteIndex((prev) => (prev + 1) % MUSIC_NOTES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-terminal-border bg-terminal-header">
      <div className="container mx-auto px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-terminal-accent" />
            <h1 className="font-mono text-sm sm:text-base text-terminal-accent font-bold tracking-wider">
              <span className="hidden sm:inline">YTTERM</span>
              <span className="sm:hidden">YT</span>
              <span className="text-terminal-muted ml-1 font-normal text-xs">v1.0</span>
            </h1>
            <span className="text-terminal-accent animate-pulse">
              {MUSIC_NOTES[noteIndex]}
            </span>
          </div>

          {/* Center - Title */}
          <div className="hidden md:block text-center">
            <span className="font-mono text-xs text-terminal-muted">
              ══════ REDDIT RADIO ══════
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-terminal-muted hidden sm:block">
              [{time}]
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded border border-terminal-border hover:bg-terminal-hover transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-terminal-muted hover:text-terminal-accent" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
