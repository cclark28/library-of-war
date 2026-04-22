#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Hallowed Ground — Supabase Database Backup
# Run manually or via cron weekly.
#
# Usage:
#   ./scripts/backup-db.sh
#
# Requires:
#   - pg_dump installed (brew install libpq)
#   - .env.local with NEXT_PUBLIC_SUPABASE_URL set
#   - Supabase project NOT paused
#
# Backups are saved to: ./backups/soldiers-YYYY-MM-DD.sql
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load env
if [ -f "$PROJECT_DIR/.env.local" ]; then
  set -a && source "$PROJECT_DIR/.env.local" && set +a
fi

# Extract host from Supabase URL: https://xsmfoollwkfscaqcyhkq.supabase.co
SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
if [ -z "$SUPABASE_URL" ]; then
  echo "❌  NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
  exit 1
fi
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | cut -d. -f1)
DB_HOST="db.${PROJECT_REF}.supabase.co"

# Output
BACKUP_DIR="$PROJECT_DIR/backups"
mkdir -p "$BACKUP_DIR"
FILENAME="soldiers-$(date +%Y-%m-%d).sql"
OUT="$BACKUP_DIR/$FILENAME"

echo "✦  Hallowed Ground — Database Backup"
echo "   Host:   $DB_HOST"
echo "   Output: $OUT"
echo ""

# pg_dump — prompts for password (from Supabase dashboard → Database → Connection info)
# Or set PGPASSWORD env var
PGPASSWORD="${SUPABASE_DB_PASSWORD:-}" \
pg_dump \
  --host="$DB_HOST" \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --schema=public \
  --table=soldiers \
  --data-only \
  --format=plain \
  --no-owner \
  --no-privileges \
  > "$OUT"

SIZE=$(du -sh "$OUT" | cut -f1)
echo "✓  Backup complete: $FILENAME ($SIZE)"
echo ""
echo "   To restore:"
echo "   psql -h $DB_HOST -U postgres -d postgres < $OUT"
