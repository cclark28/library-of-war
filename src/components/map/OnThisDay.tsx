'use client';

import { useEffect, useState } from 'react';
import { getOnThisDay } from '@/lib/soldiers';
import type { Soldier } from '@/types/soldier';

export default function OnThisDay() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOnThisDay()
      .then(setSoldiers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Don't render if no matches
  if (!loading && soldiers.length === 0) return null;

  const today = new Date();
  const label = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="absolute bottom-20 left-4 z-10 w-64">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-950/90 border border-amber-900/40 rounded text-left backdrop-blur-sm hover:border-amber-700/60 transition-colors"
      >
        <span className="text-amber-500 text-xs">✦</span>
        <div className="flex-1 min-w-0">
          <p className="text-amber-500 text-[10px] tracking-widest uppercase font-mono">
            On This Day
          </p>
          <p className="text-neutral-400 text-[10px] font-mono truncate">
            {loading ? 'Loading…' : `${soldiers.length} fallen · ${label}`}
          </p>
        </div>
        <span className="text-neutral-600 text-xs">{open ? '▴' : '▾'}</span>
      </button>

      {/* Panel */}
      {open && soldiers.length > 0 && (
        <div className="mt-1 bg-neutral-950/95 border border-neutral-800 rounded overflow-y-auto max-h-72">
          {soldiers.slice(0, 12).map((s) => (
            <div
              key={s.id}
              className="px-3 py-2 border-b border-neutral-800/60 last:border-0 hover:bg-neutral-900/60 transition-colors cursor-default"
            >
              <p className="text-neutral-200 text-xs font-mono">
                {s.first_name} {s.last_name}
              </p>
              <p className="text-neutral-500 text-[10px] font-mono mt-0.5">
                {s.rank} · {new Date(s.date_of_casualty).getFullYear()} · {s.battle_location}
              </p>
            </div>
          ))}
          {soldiers.length > 12 && (
            <div className="px-3 py-2 text-neutral-600 text-[10px] font-mono">
              +{soldiers.length - 12} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}
