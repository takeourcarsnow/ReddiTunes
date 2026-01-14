'use client';

import { useHistoryStore } from '@/stores';
import { usePlaylistStore } from '@/stores/playlistStore';
import { usePlayerStore } from '@/stores/playerStore';
import { TerminalWindow } from '@/components/terminal';
import { Play, Trash2 } from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';

export function PlaylistHistory() {
  const { entries, removeEntry, clear } = useHistoryStore();
  const { addTrackToQueue, setQueueIndex } = usePlaylistStore();
  const { setIsPlaying } = usePlayerStore();

  if (entries.length === 0) return null;

  return (
    <TerminalWindow title="[HISTORY]" className="h-full" headerActions={
      entries.length > 0 && (
        <div className="flex items-center gap-0.5">
          <button onClick={() => clear()} className="p-0.5 text-terminal-muted hover:text-red-400" title="Clear history">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )
    }>
      <div className="p-2 space-y-1 overflow-y-auto">
        {entries.slice(0, 20).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-1.5 p-1.5 border border-terminal-border hover:border-terminal-accent group"
          >
            <img src={`https://img.youtube.com/vi/${entry.track.youtubeId}/mqdefault.jpg`} alt="thumb" className="w-6 h-4 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] text-terminal-text truncate">{entry.track.title}</div>
              <div className="font-mono text-[10px] text-terminal-muted">{entry.track.artist || (entry.track.redditUrl ? 'reddit' : 'YouTube')} • {getTimeAgo(entry.playedAt)}</div>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => {
                  addTrackToQueue(entry.track);
                  // set queue index to last appended
                  const qlen = usePlaylistStore.getState().queue.length;
                  setQueueIndex(qlen - 1);
                  setIsPlaying(true);
                }}
                className="p-1 hover:text-terminal-accent"
              >
                <Play className="w-3 h-3" />
              </button>
              <button
                onClick={() => removeEntry(entry.id)}
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
