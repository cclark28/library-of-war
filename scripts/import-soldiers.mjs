#!/usr/bin/env node
/**
 * Hallowed Ground — Soldier Import Script
 * ----------------------------------------
 * Imports soldiers from a CSV file OR Google Sheet into Supabase
 * with full duplicate detection.
 *
 * Duplicate check (in order):
 *   1. last_name + first_name + date_of_casualty + rank + branch + battle_location
 *   2. If date_of_birth present: last_name + first_name + date_of_birth + branch
 *
 * Usage:
 *   # From local CSV
 *   node scripts/import-soldiers.mjs --file=./supabase/seed/vietnam.csv [--dry-run] [--batch=100]
 *
 *   # From Google Sheet (sheet must be "Anyone with link can view")
 *   node scripts/import-soldiers.mjs --sheet=SHEET_ID [--tab=0] [--dry-run]
 *   node scripts/import-soldiers.mjs --sheet=https://docs.google.com/spreadsheets/d/SHEET_ID/...
 *
 *   # From named tab (gid number from the sheet URL after #gid=)
 *   node scripts/import-soldiers.mjs --sheet=SHEET_ID --tab=1234567890
 *
 * Google Sheet column headers (row 1) must match exactly:
 *   last_name, first_name, rank, branch, status, era,
 *   date_of_casualty, date_of_birth, age_at_casualty,
 *   battle_location, battle_lat, battle_lng,
 *   unit, service_number, source_url, source_label, notes
 *
 * Outputs:
 *   import-report-{timestamp}.json     — full results
 *   import-duplicates-{timestamp}.csv  — rows skipped as dupes
 */

import fs   from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// ── Args ──────────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...rest] = a.replace(/^--/, '').split('=');
    return [k, rest.join('=') || true];
  })
);

const FILE     = args.file;
const SHEET    = args.sheet;
const TAB      = args.tab ?? '0';
const DRY_RUN  = args['dry-run'] === true || args['dry-run'] === 'true';
const BATCH_SZ = parseInt(args.batch ?? '100', 10);

if (!FILE && !SHEET) {
  console.error([
    'Usage:',
    '  Local CSV:    node scripts/import-soldiers.mjs --file=./path/to/file.csv',
    '  Google Sheet: node scripts/import-soldiers.mjs --sheet=SHEET_ID_OR_URL',
    '  Options:      [--tab=GID] [--dry-run] [--batch=100]',
  ].join('\n'));
  process.exit(1);
}

// ── Resolve Google Sheet CSV export URL ───────────────────────────────────────
function sheetToCsvUrl(input, gid = '0') {
  // Accept full URL or bare sheet ID
  let id = input;
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) id = match[1];
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

// ── Load raw CSV from file or Google Sheet ────────────────────────────────────
async function loadCSV() {
  if (FILE) {
    return fs.readFileSync(path.resolve(FILE), 'utf8');
  }

  const url = sheetToCsvUrl(SHEET, TAB);
  console.log(`  Fetching sheet: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'Google Sheet is not public. Set sharing to "Anyone with the link can view" and try again.'
      );
    }
    throw new Error(`Google Sheets fetch failed: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

// ── Supabase ──────────────────────────────────────────────────────────────────
const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const IMPORT_SECRET     = process.env.SUPABASE_IMPORT_SECRET;

if (!SUPABASE_URL || !SUPABASE_URL.includes('supabase')) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL not set. Add real value to .env.local');
  process.exit(1);
}

if (!DRY_RUN && !IMPORT_SECRET) {
  console.error('❌  SUPABASE_IMPORT_SECRET not set. Add it to .env.local (see .env.local.example)');
  process.exit(1);
}

// Anon key is sufficient — writes go through bulk_import_soldiers() RPC (SECURITY DEFINER)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── CSV parser (no dependencies) ──────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return lines.slice(1).map(line => {
    const values = [];
    let cur = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { values.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    values.push(cur.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

// ── Normalise a CSV row → Supabase record ─────────────────────────────────────
const VALID_BRANCHES = ['army','navy','marines','air_force','coast_guard','special_forces'];
const VALID_STATUSES = ['kia','mia','wia','pow'];
const VALID_ERAS     = ['wwi','wwii','korea','vietnam','gulf','iraq','afghanistan'];

function normalise(row, lineNum) {
  const errors = [];

  const last_name  = (row.last_name  || '').trim();
  const first_name = (row.first_name || '').trim();
  const branch     = (row.branch     || '').trim().toLowerCase().replace(/\s+/g,'_');
  const status     = (row.status     || '').trim().toLowerCase();
  const era        = (row.era        || '').trim().toLowerCase();
  const battle_location = (row.battle_location || '').trim();

  if (!last_name)  errors.push('missing last_name');
  if (!first_name) errors.push('missing first_name');
  if (!VALID_BRANCHES.includes(branch)) errors.push(`invalid branch: "${branch}"`);
  if (!VALID_STATUSES.includes(status)) errors.push(`invalid status: "${status}"`);
  if (!VALID_ERAS.includes(era))        errors.push(`invalid era: "${era}"`);
  if (!battle_location)                 errors.push('missing battle_location');

  const date_of_casualty = (row.date_of_casualty || '').trim();
  if (!date_of_casualty || isNaN(Date.parse(date_of_casualty))) {
    errors.push(`invalid date_of_casualty: "${date_of_casualty}"`);
  }

  const battle_lat = parseFloat(row.battle_lat);
  const battle_lng = parseFloat(row.battle_lng);
  if (isNaN(battle_lat) || isNaN(battle_lng)) errors.push('invalid lat/lng');

  if (errors.length) return { ok: false, errors, lineNum, row };

  return {
    ok: true,
    record: {
      last_name,
      first_name,
      rank:             (row.rank || '').trim() || null,
      branch,
      status,
      era,
      date_of_casualty,
      date_of_birth:    row.date_of_birth?.trim()     || null,
      age_at_casualty:  row.age_at_casualty?.trim()
                          ? parseInt(row.age_at_casualty, 10) : null,
      battle_location,
      battle_lat,
      battle_lng,
      unit:             row.unit?.trim()             || null,
      service_number:   row.service_number?.trim()   || null,
      source_url:       row.source_url?.trim()       || null,
      source_label:     row.source_label?.trim()     || null,
      notes:            row.notes?.trim()            || null,
    }
  };
}

// ── Dedup key ─────────────────────────────────────────────────────────────────
function dedupKey(r) {
  return [
    r.last_name.toLowerCase(),
    r.first_name.toLowerCase(),
    r.date_of_casualty,
    (r.rank || '').toLowerCase(),
    r.branch,
    r.battle_location.toLowerCase(),
  ].join('|');
}

// ── Batch insert via RPC (SECURITY DEFINER bypasses RLS) ─────────────────────
async function insertBatch(records) {
  const { data, error } = await supabase.rpc('bulk_import_soldiers', {
    p_records:       records,
    p_import_secret: IMPORT_SECRET,
  });

  if (error) throw new Error(error.message);
  // data = { inserted: N, skipped: N, errors: N }
  return data?.inserted ?? 0;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  console.log(`\n✦ Hallowed Ground — Soldier Import`);
  console.log(`  Source:  ${FILE ? FILE : `Google Sheet (tab ${TAB})`}`);
  console.log(`  Mode:    ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`  Batch:   ${BATCH_SZ}\n`);

  // Load CSV from file or Google Sheet
  const raw = await loadCSV();
  const rows = parseCSV(raw);
  console.log(`  Rows in file: ${rows.length}`);

  // Normalise
  const valid   = [];
  const invalid = [];
  rows.forEach((row, i) => {
    const result = normalise(row, i + 2); // +2 for header + 1-index
    if (result.ok) valid.push(result.record);
    else invalid.push(result);
  });

  console.log(`  Valid rows:   ${valid.length}`);
  console.log(`  Invalid rows: ${invalid.length}`);

  if (invalid.length) {
    console.log('\n  ⚠  Invalid rows (skipped):');
    invalid.slice(0, 10).forEach(e =>
      console.log(`     Line ${e.lineNum}: ${e.errors.join(', ')}`)
    );
    if (invalid.length > 10) console.log(`     ... and ${invalid.length - 10} more`);
  }

  // Local dedup (within this file)
  const seen     = new Map();
  const localDup = [];
  const unique   = [];

  for (const rec of valid) {
    const key = dedupKey(rec);
    if (seen.has(key)) {
      localDup.push({ ...rec, _dup_of_key: key });
    } else {
      seen.set(key, true);
      unique.push(rec);
    }
  }

  console.log(`\n  In-file duplicates removed: ${localDup.length}`);
  console.log(`  Unique records to process:  ${unique.length}`);

  if (DRY_RUN) {
    console.log('\n  ✓ Dry run complete — no records written.\n');
    writeReport(ts, unique, localDup, invalid, 0, 0);
    return;
  }

  // Check against existing DB records in batches
  console.log('\n  Checking against database…');
  const dbDupes  = [];
  const toInsert = [];

  // Pull distinct keys from DB for the names in our set (chunked to avoid huge queries)
  // Use original-case names for the DB query (DB stores mixed case, .in() is case-sensitive)
  const names = [...new Set(unique.map(r => r.last_name))];
  const CHUNK = 200;
  const existingKeys = new Set();

  for (let i = 0; i < names.length; i += CHUNK) {
    const chunk = names.slice(i, i + CHUNK);
    const { data } = await supabase
      .from('soldiers')
      .select('last_name,first_name,date_of_casualty,rank,branch,battle_location')
      .in('last_name', chunk);

    if (data) {
      data.forEach(r => existingKeys.add(dedupKey(r)));
    }
  }

  for (const rec of unique) {
    if (existingKeys.has(dedupKey(rec))) {
      dbDupes.push(rec);
    } else {
      toInsert.push(rec);
    }
  }

  console.log(`  Already in database:   ${dbDupes.length}`);
  console.log(`  New records to insert: ${toInsert.length}`);

  if (toInsert.length === 0) {
    console.log('\n  ✓ Nothing new to insert.\n');
    writeReport(ts, unique, localDup, invalid, dbDupes.length, 0);
    return;
  }

  // Insert in batches
  let inserted = 0;
  let failed   = 0;
  console.log('\n  Inserting…');

  for (let i = 0; i < toInsert.length; i += BATCH_SZ) {
    const batch = toInsert.slice(i, i + BATCH_SZ);
    process.stdout.write(`  Batch ${Math.floor(i / BATCH_SZ) + 1}/${Math.ceil(toInsert.length / BATCH_SZ)} (${batch.length} rows)… `);
    try {
      const count = await insertBatch(batch);
      inserted += count;
      console.log(`✓ ${count} inserted`);
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
      failed += batch.length;
    }
  }

  console.log(`\n  ════════════════════════════════`);
  console.log(`  Inserted:          ${inserted}`);
  console.log(`  DB duplicates:     ${dbDupes.length}`);
  console.log(`  In-file dupes:     ${localDup.length}`);
  console.log(`  Invalid rows:      ${invalid.length}`);
  console.log(`  Failed (errors):   ${failed}`);
  console.log(`  ════════════════════════════════\n`);

  writeReport(ts, unique, [...localDup, ...dbDupes], invalid, dbDupes.length, inserted);
}

function writeReport(ts, unique, allDupes, invalid, dbDupes, inserted) {
  const report = {
    timestamp: new Date().toISOString(),
    file: FILE,
    dry_run: DRY_RUN,
    totals: {
      unique_in_file: unique.length,
      duplicates_removed: allDupes.length,
      db_duplicates: dbDupes,
      invalid_rows: invalid.length,
      inserted,
    },
    invalid_rows: invalid,
  };
  const reportPath = `import-report-${ts}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`  Report: ${reportPath}`);

  if (allDupes.length) {
    const headers = Object.keys(allDupes[0]).join(',');
    const rows    = allDupes.map(r => Object.values(r).map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(','));
    const dupePath = `import-duplicates-${ts}.csv`;
    fs.writeFileSync(dupePath, [headers, ...rows].join('\n'));
    console.log(`  Duplicates log: ${dupePath}`);
  }
  console.log('');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
