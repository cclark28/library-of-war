'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// MapLibre is browser-only — must be loaded with ssr: false
const HallowedGroundMap = dynamic(
  () => import('@/components/map/HallowedGroundMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-dvh flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-neutral-500 text-sm tracking-widest uppercase font-mono">
            Loading map
          </p>
        </div>
      </div>
    ),
  }
);

export default function TheFallenPage() {
  return (
    <Suspense>
      <HallowedGroundMap />
    </Suspense>
  );
}
