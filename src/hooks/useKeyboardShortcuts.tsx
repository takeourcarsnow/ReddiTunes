'use client';

import { useEffect, useCallback } from 'react';
import { usePlayerStore, usePlaylistStore } from '@/stores';

export function useKeyboardShortcuts() {
  const {
    togglePlay,
    toggleMute,
    cycleRepeatMode,
    setVolume,
    volume,
    seekTo,
    progress,
    duration,
  } = usePlayerStore();

  const { nextTrack, previousTrack, toggleShuffle } = usePlaylistStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          togglePlay();
          break;
        case 'arrowright':
          if (event.shiftKey) {
            nextTrack();
          } else {
            seekTo(Math.min(duration, progress + 10));
          }
          break;
        case 'arrowleft':
          if (event.shiftKey) {
            previousTrack();
          } else {
            seekTo(Math.max(0, progress - 10));
          }
          break;
        case 'arrowup':
          event.preventDefault();
          setVolume(Math.min(100, volume + 10));
          break;
        case 'arrowdown':
          event.preventDefault();
          setVolume(Math.max(0, volume - 10));
          break;
        case 'm':
          toggleMute();
          break;
        case 'r':
          cycleRepeatMode();
          break;
        case 's':
          toggleShuffle();
          break;
        case 'n':
          nextTrack();
          break;
        case 'p':
          previousTrack();
          break;
      }
    },
    [
      togglePlay,
      toggleMute,
      cycleRepeatMode,
      setVolume,
      volume,
      seekTo,
      progress,
      duration,
      nextTrack,
      previousTrack,
      toggleShuffle,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
