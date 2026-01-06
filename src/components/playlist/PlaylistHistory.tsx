'use client';

import { usePlaylistStore } from '@/stores';
import { TerminalWindow } from '@/components/terminal';
import { Play, Trash2 } from 'lucide-react';
import { GENRES } from '@/constants/genres';

export function PlaylistHistory() {
  const { playlists, loadPlaylistToQueue, deletePlaylist } = usePlaylistStore();

  const getGenreIcon = (genreId: string): string => {
    const genre = GENRES.find((g) => g.id === genreId);
    return genre?.icon || '🎵';
  };

  if (playlists.length === 0) return null;

  return (
    <TerminalWindow title="[HISTORY]" className="h-full">
      <div className="p-2 space-y-1 overflow-y-auto">
        {playlists.slice(0, 5).map((playlist) => (
          <div
            key={playlist.id}
            className="flex items-center gap-1.5 p-1.5 border border-terminal-border hover:border-terminal-accent group"
          >
            <span className="text-sm">{getGenreIcon(playlist.genre)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] text-terminal-text truncate">{playlist.name}</div>
              <div className="font-mono text-[10px] text-terminal-muted">{playlist.tracks.length} tracks</div>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => loadPlaylistToQueue(playlist)}
                className="p-1 hover:text-terminal-accent"
              >
                <Play className="w-3 h-3" />
              </button>
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="p-1 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </TerminalWindow>
  );
}
