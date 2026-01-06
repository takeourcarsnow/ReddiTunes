'use client';

import { Track } from '@/types';
import { usePlayerStore } from '@/stores';
import { truncateText } from '@/lib/utils';
import { Play, Pause, X } from 'lucide-react';

interface PlaylistItemProps {
  track: Track;
  index: number;
  isActive: boolean;
  onPlay: () => void;
  onRemove: () => void;
}

export function PlaylistItem({
  track,
  index,
  isActive,
  onPlay,
  onRemove,
}: PlaylistItemProps) {
  const { isPlaying } = usePlayerStore();
  const isCurrentlyPlaying = isActive && isPlaying;

  return (
    <div
      className={`group flex items-center gap-1.5 p-1.5 font-mono text-[11px] border-b border-terminal-border/50 hover:bg-terminal-hover ${
        isActive ? 'bg-terminal-accent/10' : ''
      }`}
    >
      {/* Index / Play button */}
      <button onClick={onPlay} className="w-6 h-6 flex items-center justify-center shrink-0">
        {isActive ? (
          isCurrentlyPlaying ? (
            <span className="text-terminal-accent">▶</span>
          ) : (
            <Pause className="w-3 h-3 text-terminal-accent" />
          )
        ) : (
          <>
            <span className="group-hover:hidden text-terminal-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Play className="w-3 h-3 hidden group-hover:block" />
          </>
        )}
      </button>

      {/* Track info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onPlay}>
        <div className={`truncate ${isActive ? 'text-terminal-accent' : 'text-terminal-text'}`}>
          {truncateText(track.title, 40)}
        </div>
        {track.artist && (
          <div className="text-terminal-muted truncate text-[10px]">{track.artist}</div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
