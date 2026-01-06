'use client';

import { useEffect, useState, useRef } from 'react';
import { usePlayerStore } from '@/stores';

interface VisualizerProps {
  barCount?: number;
}

export function Visualizer({ barCount = 24 }: VisualizerProps) {
  const { isPlaying } = usePlayerStore();
  const [bars, setBars] = useState<number[]>(() => Array(barCount).fill(0));
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (time - lastTime < 100) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      if (isPlaying) {
        setBars(prev => prev.map((_, i) => {
          const wave = Math.sin(time / 300 + i * 0.4) * 0.4 + 0.5;
          return wave + Math.random() * 0.2;
        }));
      } else {
        setBars(prev => prev.map(b => Math.max(0, b - 0.1)));
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-end justify-center gap-0.5 h-6">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="w-1 bg-terminal-accent"
          style={{
            height: `${Math.max(2, bar * 100)}%`,
            opacity: isPlaying ? 0.5 + bar * 0.5 : 0.2,
          }}
        />
      ))}
    </div>
  );
}
