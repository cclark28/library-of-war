'use client';

import type { Soldier } from '@/types/soldier';

const STATUS_LABELS: Record<string, string> = {
  kia: 'Killed in Action',
  mia: 'Missing in Action',
  wia: 'Wounded in Action',
  pow: 'Prisoner of War',
};

const STATUS_COLORS: Record<string, string> = {
  kia: 'text-red-400 border-red-400/30',
  mia: 'text-yellow-400 border-yellow-400/30',
  wia: 'text-blue-400 border-blue-400/30',
  pow: 'text-orange-400 border-orange-400/30',
};

interface SoldierPanelProps {
  soldier: Soldier | null;
  onClose: () => void;
}

export default function SoldierPanel({ soldier, onClose }: SoldierPanelProps) {
  return (
    <div
      className={`
        absolute top-0 right-0 bottom-0 z-20
        w-full max-w-sm
        bg-neutral-950/95 border-l border-neutral-800
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${soldier ? 'translate-x-0' : 'translate-x-full'}
        /* Mobile: full width bottom sheet */
        md:max-w-sm
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
        <span className="text-neutral-500 text-xs tracking-widest uppercase font-mono">
          Service Record
        </span>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-200 transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {soldier && (
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Photo */}
          {soldier.photo_url ? (
            <div className="w-full aspect-square bg-neutral-900 rounded overflow-hidden">
              <img
                src={soldier.photo_url}
                alt={`${soldier.first_name} ${soldier.last_name}`}
                className="w-full h-full object-cover grayscale"
              />
              {soldier.photo_credit && (
                <p className="text-neutral-600 text-xs mt-1 font-mono">
                  {soldier.photo_credit}
                </p>
              )}
            </div>
          ) : (
            <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-neutral-700 text-3xl">✦</span>
            </div>
          )}

          {/* Name + rank */}
          <div>
            <h2 className="text-neutral-100 text-xl font-light tracking-wide">
              {soldier.first_name} {soldier.last_name}
            </h2>
            <p className="text-neutral-500 text-sm font-mono mt-1">
              {soldier.rank} · {soldier.branch.replace('_', ' ').toUpperCase()}
            </p>
          </div>

          {/* Status badge */}
          <div
            className={`inline-block px-3 py-1 border rounded text-xs font-mono uppercase tracking-widest ${
              STATUS_COLORS[soldier.status]
            }`}
          >
            {STATUS_LABELS[soldier.status]}
          </div>

          {/* Details grid */}
          <dl className="space-y-3">
            <Row label="Date" value={new Date(soldier.date_of_casualty).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
            {soldier.age_at_casualty && (
              <Row label="Age" value={String(soldier.age_at_casualty)} />
            )}
            <Row label="Location" value={soldier.battle_location} />
            {soldier.unit && <Row label="Unit" value={soldier.unit} />}
            {soldier.hometown_city && (
              <Row
                label="Hometown"
                value={`${soldier.hometown_city}${soldier.hometown_state ? `, ${soldier.hometown_state}` : ''}`}
              />
            )}
            {soldier.service_number && (
              <Row label="Service No." value={soldier.service_number} />
            )}
          </dl>

          {/* Source link */}
          {soldier.source_url && (
            <a
              href={soldier.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 text-xs font-mono underline hover:text-neutral-300 transition-colors"
            >
              {soldier.source_label || 'View source'} ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="text-neutral-600 text-xs font-mono uppercase tracking-wider w-24 shrink-0">
        {label}
      </dt>
      <dd className="text-neutral-300 text-xs font-mono">{value}</dd>
    </div>
  );
}
