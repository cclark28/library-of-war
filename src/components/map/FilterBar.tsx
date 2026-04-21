'use client';

import type { MapFilters, WarEra, ServiceBranch, CasualtyStatus } from '@/types/soldier';

const ERAS: { value: WarEra | 'all'; label: string }[] = [
  { value: 'all', label: 'All Eras' },
  { value: 'wwi', label: 'WWI' },
  { value: 'wwii', label: 'WWII' },
  { value: 'korea', label: 'Korea' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'gulf', label: 'Gulf War' },
  { value: 'iraq', label: 'Iraq' },
  { value: 'afghanistan', label: 'Afghanistan' },
];

const BRANCHES: { value: ServiceBranch | 'all'; label: string }[] = [
  { value: 'all', label: 'All Branches' },
  { value: 'army', label: 'Army' },
  { value: 'navy', label: 'Navy' },
  { value: 'marines', label: 'Marines' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'special_forces', label: 'Special Forces' },
];

const STATUSES: { value: CasualtyStatus | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: '' },
  { value: 'kia', label: 'KIA', color: 'text-red-400' },
  { value: 'mia', label: 'MIA', color: 'text-yellow-400' },
  { value: 'wia', label: 'WIA', color: 'text-blue-400' },
  { value: 'pow', label: 'POW', color: 'text-orange-400' },
];

interface FilterBarProps {
  filters: MapFilters;
  onChange: (f: MapFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = (key: keyof MapFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-neutral-950/90 border border-neutral-800 rounded-full backdrop-blur-sm">
      {/* Search */}
      <input
        type="text"
        placeholder="Search name, location…"
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
        className="bg-transparent text-neutral-300 text-xs placeholder-neutral-600 outline-none w-40 font-mono"
      />

      <div className="w-px h-4 bg-neutral-700" />

      {/* Era */}
      <select
        value={filters.era}
        onChange={(e) => set('era', e.target.value)}
        className="bg-transparent text-neutral-300 text-xs outline-none cursor-pointer font-mono"
      >
        {ERAS.map((e) => (
          <option key={e.value} value={e.value} className="bg-neutral-900">
            {e.label}
          </option>
        ))}
      </select>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Branch */}
      <select
        value={filters.branch}
        onChange={(e) => set('branch', e.target.value)}
        className="bg-transparent text-neutral-300 text-xs outline-none cursor-pointer font-mono"
      >
        {BRANCHES.map((b) => (
          <option key={b.value} value={b.value} className="bg-neutral-900">
            {b.label}
          </option>
        ))}
      </select>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Status */}
      <div className="flex gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => set('status', s.value)}
            className={`text-xs font-mono transition-opacity ${
              filters.status === s.value
                ? `opacity-100 ${s.color || 'text-neutral-200'}`
                : 'opacity-40 text-neutral-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
