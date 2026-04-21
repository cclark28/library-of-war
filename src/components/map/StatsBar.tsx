'use client';

import type { Soldier, WarEra } from '@/types/soldier';

const ERA_LABELS: Record<WarEra | 'all', string> = {
  all:         'All Conflicts',
  wwi:         'World War I',
  wwii:        'World War II',
  korea:       'Korean War',
  vietnam:     'Vietnam War',
  gulf:        'Gulf War',
  iraq:        'Iraq War',
  afghanistan: 'Afghanistan',
};

interface StatsBarProps {
  soldiers: Soldier[];
  era:      WarEra | 'all';
}

export default function StatsBar({ soldiers, era }: StatsBarProps) {
  const kia = soldiers.filter((s) => s.status === 'kia').length;
  const mia = soldiers.filter((s) => s.status === 'mia').length;
  const wia = soldiers.filter((s) => s.status === 'wia').length;
  const pow = soldiers.filter((s) => s.status === 'pow').length;

  const years = soldiers
    .map((s) => new Date(s.date_of_casualty).getFullYear())
    .filter(Boolean);
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;
  const dateRange =
    minYear && maxYear
      ? minYear === maxYear
        ? String(minYear)
        : `${minYear}–${maxYear}`
      : '—';

  return (
    <div className="shrink-0 border-t border-rule bg-ghost grid grid-cols-6 divide-x divide-rule">
      <StatCell label="In View" value={soldiers.length.toLocaleString()} />
      <StatCell label="KIA" value={kia.toLocaleString()} valueClass="text-red-500" />
      <StatCell label="MIA" value={mia.toLocaleString()} valueClass="text-yellow-600" />
      <StatCell label="WIA" value={wia.toLocaleString()} valueClass="text-blue-500" />
      <StatCell label="POW" value={pow.toLocaleString()} valueClass="text-orange-500" />
      <StatCell label="Period" value={dateRange} />
    </div>
  );
}

function StatCell({
  label,
  value,
  valueClass = 'text-ink',
}: {
  label:       string;
  value:       string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-3">
      <span className={`font-headline font-bold text-xl leading-none ${valueClass}`}>
        {value}
      </span>
      <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-mist mt-1">
        {label}
      </span>
    </div>
  );
}
