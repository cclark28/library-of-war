'use client';

import type { RefObject } from 'react';
import type maplibregl from 'maplibre-gl';

interface MapControlsProps {
  map:          RefObject<maplibregl.Map | null>;
  isDark:       boolean;
  onToggleDark: () => void;
}

export default function MapControls({ map, isDark, onToggleDark }: MapControlsProps) {
  const zoom = (dir: 1 | -1) => {
    if (!map.current) return;
    map.current.easeTo({ zoom: map.current.getZoom() + dir });
  };

  const btnClass =
    'w-8 h-8 bg-paper/90 border border-rule text-ink text-sm hover:border-ink transition-colors flex items-center justify-center backdrop-blur-sm font-mono';

  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5">
      <button onClick={() => zoom(1)}  className={btnClass} aria-label="Zoom in">+</button>
      <button onClick={() => zoom(-1)} className={btnClass} aria-label="Zoom out">−</button>
      <button
        onClick={onToggleDark}
        className={`${btnClass} text-xs`}
        aria-label="Toggle map style"
        title={isDark ? 'Switch to light map' : 'Switch to dark map'}
      >
        {isDark ? '☀' : '☾'}
      </button>
    </div>
  );
}
