'use client';

import { useEffect, useRef } from 'react';
import { usePlaylistStore, usePlayerStore } from '@/stores';
import { TerminalWindow } from '@/components/terminal';
import { PlaylistItem } from './PlaylistItem';
import { Button, Loading } from '@/components/ui';
import { ListMusic, Trash2, RefreshCw } from 'lucide-react';

export function Playlist() {
  const {
    queue,
    queueIndex,
    activePlaylist,
    isLoading,
    setQueueIndex,
    removeTrackFromQueue,
    clearQueue,
    refreshPlaylist,
    loadMoreTracks,
    isShuffled,
  } = usePlaylistStore();

  const { setCurrentTrack, currentTrack, setIsPlaying } = usePlayerStore();
  const activeItemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Show full queue (no paging)
  const visibleTracks = queue; // All queued tracks

  // Sync current track with queue index - single source of truth
  useEffect(() => {
    const track = queue[queueIndex];
    if (track && track.id !== currentTrack?.id) {
      setCurrentTrack(track);
    }
  }, [queueIndex, queue, currentTrack?.id, setCurrentTrack]);



  const handlePlayTrack = (index: number) => {
    // Set queue index and request playback
    setQueueIndex(index);
    setIsPlaying(true);
  }; 

  return (
    <TerminalWindow
      ref={containerRef}
      tabIndex={0}
      title={`[QUEUE] ${queue.length} tracks${isShuffled ? ' [S]' : ''}`}
      className="h-full flex flex-col"
      headerActions={
        <div className="flex items-center gap-0.5">
          {queue.length > 0 && (
            <>
              <button
                onClick={() => activePlaylist && refreshPlaylist(activePlaylist.id)}
                disabled={isLoading || !activePlaylist}
                className="p-0.5 text-terminal-muted hover:text-terminal-accent disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={clearQueue}
                className="p-0.5 text-terminal-muted hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}

          {activePlaylist && (
            <Button size="sm" onClick={() => loadMoreTracks(20)} disabled={isLoading} className="ml-1">
              Load more
            </Button>
          )}
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loading text="Loading" />
          </div>
        ) : queue.length === 0 ? (
          <div className="p-4 text-center">
            <ListMusic className="w-8 h-8 mx-auto mb-2 text-terminal-muted" />
            <p className="font-mono text-xs text-terminal-muted">No tracks</p>
          </div>
        ) : (
          <div>
            {visibleTracks.map((track, index) => {
              const globalIndex = index;
              return (
                <div key={track.id} ref={globalIndex === queueIndex ? activeItemRef : undefined}>
                  <PlaylistItem
                    track={track}
                    index={globalIndex}
                    isActive={globalIndex === queueIndex}
                    onPlay={() => handlePlayTrack(globalIndex)}
                    onRemove={() => removeTrackFromQueue(track.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>


    </TerminalWindow>
  );
}
