#!/bin/bash
# ────────────────────────────────────────────────────────────────
# scripts/install-launchd.sh
#
# Installs the Library of War nightly writer as a macOS launchd agent.
# Runs at 11:00pm every night. Retries every 30 min if credits fail.
#
# Usage: bash scripts/install-launchd.sh
# ────────────────────────────────────────────────────────────────

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"
LOG_DIR="$PROJECT_DIR/logs"

echo ""
echo "  Library of War — launchd Installer"
echo "  ═══════════════════════════════════"
echo ""

# ── Find node ──────────────────────────────────────────────────
NODE_PATH=$(which node 2>/dev/null || echo "")
if [ -z "$NODE_PATH" ]; then
  # Try common nvm / homebrew locations
  for p in "$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | sort -V | tail -1)/bin/node" \
            "/opt/homebrew/bin/node" "/usr/local/bin/node"; do
    [ -x "$p" ] && NODE_PATH="$p" && break
  done
fi

if [ -z "$NODE_PATH" ]; then
  echo "  ✗ Cannot find node. Install Node.js and ensure it's on PATH."
  exit 1
fi

NODE_DIR=$(dirname "$NODE_PATH")
echo "  Node binary : $NODE_PATH"
echo "  Project dir : $PROJECT_DIR"
echo "  Log dir     : $LOG_DIR"
echo ""

# ── Check API key ──────────────────────────────────────────────
if ! grep -q "ANTHROPIC_API_KEY" "$PROJECT_DIR/.env.local" 2>/dev/null; then
  echo "  ⚠ ANTHROPIC_API_KEY not found in .env.local"
  echo "  Add it before the jobs run:"
  echo "    echo 'ANTHROPIC_API_KEY=sk-ant-YOUR_KEY' >> \"$PROJECT_DIR/.env.local\""
  echo ""
fi

# ── Create log directory ───────────────────────────────────────
mkdir -p "$LOG_DIR"
echo "  ✓ Log directory ready: $LOG_DIR"

# ── Process plist templates ────────────────────────────────────
for PLIST_NAME in "com.libraryofwar.nightly" "com.libraryofwar.nightly-retry"; do
  SRC="$PROJECT_DIR/${PLIST_NAME}.plist"
  DST="$LAUNCH_AGENTS/${PLIST_NAME}.plist"

  if [ ! -f "$SRC" ]; then
    echo "  ✗ Template not found: $SRC"
    exit 1
  fi

  # Replace placeholders
  sed \
    -e "s|NODE_PATH_PLACEHOLDER|${NODE_PATH}|g" \
    -e "s|NODE_DIR_PLACEHOLDER|${NODE_DIR}|g" \
    -e "s|PROJECT_PATH_PLACEHOLDER|${PROJECT_DIR}|g" \
    -e "s|HOME_PLACEHOLDER|${HOME}|g" \
    "$SRC" > "$DST"

  echo "  ✓ Installed: $DST"

  # Unload if already running
  launchctl unload "$DST" 2>/dev/null || true

  # Load
  launchctl load "$DST"
  echo "  ✓ Loaded:    $PLIST_NAME"
done

echo ""
echo "  ══════════════════════════════════"
echo "  ✓ Installation complete."
echo ""
echo "  Schedule:"
echo "    • 11:00pm every night → write 5 articles"
echo "    • Every 30 minutes   → retry if credits were exhausted"
echo ""
echo "  Commands:"
echo "    Status:    launchctl list | grep libraryofwar"
echo "    Run now:   launchctl start com.libraryofwar.nightly"
echo "    Uninstall: bash scripts/uninstall-launchd.sh"
echo "    Logs:      tail -f \"$LOG_DIR/nightly-writer.log\""
echo "    Status:    node scripts/nightly-writer.mjs --status"
echo ""
