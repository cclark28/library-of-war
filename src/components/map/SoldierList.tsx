'use client';

import { useEffect, useMemo } from 'react';
import type { MapFilters, Soldier, ServiceBranch, CasualtyStatus } from '@/types/soldier';

const STATUS_DOT: Record<CasualtyStatus, string> = {
  kia: 'bg-red-400',
  mia: 'bg-yellow-400',
  wia: 'bg-blue-400',
  pow: 'bg-orange-400',
};

const STATUS_LABEL: Record<CasualtyStatus, string> = {
  kia: 'KIA',
  mia: 'MIA',
  wia: 'WIA',
  pow: 'POW',
};

const STATUS_COLOR: Record<CasualtyStatus, string> = {
  kia: 'text-red-500 border-red-400',
  mia: 'text-yellow-600 border-yellow-400',
  wia: 'text-blue-500 border-blue-400',
  pow: 'text-orange-500 border-orange-400',
};

const BRANCHES: { value: ServiceBranch | 'all'; label: string }[] = [
  { value: 'all',            label: 'All Branches' },
  { value: 'army',           label: 'Army' },
  { value: 'navy',           label: 'Navy' },
  { value: 'marines',        label: 'Marines' },
  { value: 'air_force',      label: 'Air Force' },
  { value: 'coast_guard',    label: 'Coast Guard' },
  { value: 'special_forces', label: 'Special Forces' },
];

// WIA and POW pills only appear when records of that type exist in the current view
const ALWAYS_SHOWN: CasualtyStatus[] = ['kia', 'mia'];

interface SoldierListProps {
  soldiers:       Soldier[];
  selectedSoldier: Soldier | null;
  filters:         MapFilters;
  onFilterChange:  (f: MapFilters) => void;
  onSelect:        (s: Soldier) => void;
}

export default function SoldierList({
  soldiers,
  selectedSoldier,
  filters,
  onFilterChange,
  onSelect,
}: SoldierListProps) {
  const set = (key: keyof MapFilters, value: string) =>
    onFilterChange({ ...filters, [key]: value });

  const clearFilters = () =>
    onFilterChange({ ...filters, branch: 'all', status: 'all', search: '' });

  const hasActiveFilters =
    filters.branch !== 'all' || filters.status !== 'all' || filters.search.trim() !== '';

  const hasWia = soldiers.some((s) => s.status === 'wia');
  const hasPow = soldiers.some((s) => s.status === 'pow');
  const visibleStatuses: CasualtyStatus[] = [
    ...ALWAYS_SHOWN,
    ...(hasWia ? (['wia'] as CasualtyStatus[]) : []),
    ...(hasPow ? (['pow'] as CasualtyStatus[]) : []),
  ];

  // Auto-reset status filter when the selected status disappears from the current view
  useEffect(() => {
    if (
      filters.status !== 'all' &&
      !visibleStatuses.includes(filters.status as CasualtyStatus)
    ) {
      onFilterChange({ ...filters, status: 'all' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soldiers]);

  // Memoized sort — avoids re-sorting on every render
  const sortedSoldiers = useMemo(
    () => [...soldiers].sort((a, b) => a.last_name.localeCompare(b.last_name)),
    [soldiers]
  );

  return (
    <aside className="flex flex-col w-64 shrink-0 border-r border-rule bg-paper min-h-0">

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="shrink-0 p-3 border-b border-rule space-y-2.5">

        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-mist">
            Filters
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[8px] font-mono tracking-[0.1em] uppercase text-accent hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search name, unit, location…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="w-full border border-rule px-2 py-1.5 text-[10px] font-mono text-ink placeholder-mist bg-paper focus:outline-none focus:border-ink transition-colors"
        />

        {/* Branch */}
        <select
          value={filters.branch}
          onChange={(e) => set('branch', e.target.value)}
          className="w-full border border-rule px-2 py-1.5 text-[10px] font-mono text-ink bg-paper focus:outline-none focus:border-ink transition-colors cursor-pointer"
        >
          {BRANCHES.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>

        {/* Status pills */}
        <div>
          <div className="text-[8px] font-mono tracking-[0.15em] uppercase text-mist mb-1.5">
            Status
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => set('status', 'all')}
              className={`text-[8px] font-mono tracking-[0.1em] uppercase px-2 py-0.5 border transition-colors ${
                filters.status === 'all'
                  ? 'border-ink text-ink'
                  : 'border-rule text-mist hover:border-ink hover:text-ink'
              }`}
            >
              All
            </button>
            {visibleStatuses.map((s) => (
              <button
                key={s}
                onClick={() => set('status', s)}
                className={`text-[8px] font-mono tracking-[0.1em] uppercase px-2 py-0.5 border transition-colors ${
                  filters.status === s
                    ? `${STATUS_COLOR[s]} bg-ghost`
                    : 'border-rule text-mist hover:border-ink'
                }`}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── List header ──────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-rule bg-ghost">
        <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-mist">
          {soldiers.length.toLocaleString()} records
        </span>
        <span className="text-[8px] font-mono text-mist">Name A–Z</span>
      </div>

      {/* ── Scrollable list ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {soldiers.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[9px] font-mono text-mist leading-5">
              No records in current view.<br />Pan or zoom the map.
            </p>
          </div>
        ) : (
          sortedSoldiers.map((s) => {
              const isSelected = selectedSoldier?.id === s.id;
              return (
                <button
                  key={s.id}
                  id={`soldier-row-${s.id}`}
                  onClick={() => onSelect(s)}
                  className={`w-full text-left flex items-start gap-2 px-3 py-2 border-b border-rule/50 hover:bg-ghost transition-colors ${
                    isSelected ? 'bg-ghost border-l-2 border-l-accent' : ''
                  }`}
                >
                  {/* Status dot */}
                  <span
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[s.status]}`}
                  />
                  <div className="min-w-0">
                    <p className="font-headline font-bold text-[11px] text-ink truncate leading-tight">
                      {s.last_name}, {s.first_name}
                    </p>
                    <p className="text-[9px] font-mono text-mist mt-0.5 truncate">
                      {s.rank} · {s.branch.replace('_', ' ').toUpperCase()} ·{' '}
                      {STATUS_LABEL[s.status]}{' '}
                      {new Date(s.date_of_casualty).getFullYear()}
                    </p>
                  </div>
                </button>
              );
            })
        )}
      </div>

    </aside>
  );
}
