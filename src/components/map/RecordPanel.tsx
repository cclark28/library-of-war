'use client';

import type { Soldier, CasualtyStatus, ServiceBranch } from '@/types/soldier';

const STATUS_LABEL: Record<CasualtyStatus, string> = {
  kia: 'Killed in Action',
  mia: 'Missing in Action',
  wia: 'Wounded in Action',
  pow: 'Prisoner of War',
};

const STATUS_COLOR: Record<CasualtyStatus, string> = {
  kia: 'text-red-500 border-red-400',
  mia: 'text-yellow-600 border-yellow-400',
  wia: 'text-blue-500 border-blue-400',
  pow: 'text-orange-500 border-orange-400',
};

const BRANCH_LABEL: Record<ServiceBranch, string> = {
  army:           'U.S. Army',
  navy:           'U.S. Navy',
  marines:        'U.S. Marines',
  air_force:      'U.S. Air Force',
  coast_guard:    'U.S. Coast Guard',
  special_forces: 'Special Forces',
};

interface RecordPanelProps {
  soldier:       Soldier | null;
  soldiers:      Soldier[];
  selectedIndex: number;
  onNavigate:    (dir: 1 | -1) => void;
  onClose:       () => void;
}

export default function RecordPanel({
  soldier,
  soldiers,
  selectedIndex,
  onNavigate,
  onClose,
}: RecordPanelProps) {
  return (
    <aside className="flex flex-col w-72 shrink-0 border-l border-rule bg-paper">

      {/* ── Panel header ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-rule">
        <div>
          <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-accent font-bold">
            Service Record
          </p>
          {soldier && (
            <p className="text-[8px] font-mono text-mist mt-0.5">
              {selectedIndex + 1} of {soldiers.length.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {soldier && (
            <>
              <button
                onClick={() => onNavigate(-1)}
                className="w-6 h-6 border border-rule flex items-center justify-center text-mist hover:text-ink hover:border-ink transition-colors text-sm"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => onNavigate(1)}
                className="w-6 h-6 border border-rule flex items-center justify-center text-mist hover:text-ink hover:border-ink transition-colors text-sm"
                aria-label="Next"
              >
                ›
              </button>
            </>
          )}
          {soldier && (
            <button
              onClick={onClose}
              className="ml-1 w-6 h-6 border border-rule flex items-center justify-center text-mist hover:text-ink hover:border-ink transition-colors text-base leading-none"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Panel body ───────────────────────────────────────────────── */}
      {!soldier ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span className="text-rule text-3xl mb-3">✦</span>
          <p className="text-[9px] font-mono text-mist leading-relaxed tracking-wide">
            Select a marker on the map<br />or a name in the list to view<br />their service record.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">

            {/* Photo placeholder — no photos per brief */}
            <div className="w-full h-28 bg-ghost border border-rule flex items-center justify-center">
              <div className="text-center">
                <span className="text-rule text-2xl">✦</span>
                <p className="text-[8px] font-mono text-mist mt-1 tracking-wide">
                  No Photo Available
                </p>
              </div>
            </div>

            {/* Name + rank */}
            <div className="border-b border-rule pb-3">
              <h2 className="font-headline font-bold text-lg text-ink leading-tight">
                {soldier.last_name}, {soldier.first_name}
              </h2>
              <p className="text-[9px] font-mono text-mist mt-1">
                {soldier.rank} · {BRANCH_LABEL[soldier.branch]}
              </p>
              <span
                className={`inline-block mt-2 text-[8px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 border ${
                  STATUS_COLOR[soldier.status]
                }`}
              >
                {STATUS_LABEL[soldier.status]}
              </span>
            </div>

            {/* Fields */}
            <dl className="space-y-2">
              <Field
                label="Date of Loss"
                value={new Date(soldier.date_of_casualty).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              />
              {soldier.age_at_casualty && (
                <Field label="Age" value={String(soldier.age_at_casualty)} />
              )}
              {soldier.unit && (
                <Field label="Unit" value={soldier.unit} />
              )}
              <Field label="Branch" value={BRANCH_LABEL[soldier.branch]} />
              <Field label="Location" value={soldier.battle_location} />
              {/* DOB if available */}
              {/* Stored as age_at_casualty — derive DOB year if possible */}
              {soldier.age_at_casualty && (
                <Field
                  label="Birth Year (est.)"
                  value={String(
                    new Date(soldier.date_of_casualty).getFullYear() -
                      soldier.age_at_casualty
                  )}
                />
              )}
              {soldier.service_number && (
                <Field label="Service No." value={soldier.service_number} />
              )}
            </dl>

          </div>

          {/* Source link */}
          {soldier.source_url && (
            <div className="px-4 pb-4">
              <div className="border-t border-rule pt-3">
                <a
                  href={soldier.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-mono text-accent hover:underline tracking-wide"
                >
                  ↗ {soldier.source_label || 'View source record'}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

    </aside>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 pb-2 border-b border-rule/40">
      <dt className="text-[8px] font-mono tracking-[0.15em] uppercase text-mist w-20 shrink-0 pt-px">
        {label}
      </dt>
      <dd className="text-[10px] font-mono text-ink leading-tight">{value}</dd>
    </div>
  );
}
