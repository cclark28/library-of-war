#!/bin/bash
# Removes the Library of War launchd agents

LAUNCH_AGENTS="$HOME/Library/LaunchAgents"

for PLIST_NAME in "com.libraryofwar.nightly" "com.libraryofwar.nightly-retry"; do
  DST="$LAUNCH_AGENTS/${PLIST_NAME}.plist"
  if [ -f "$DST" ]; then
    launchctl unload "$DST" 2>/dev/null || true
    rm "$DST"
    echo "  ✓ Removed $PLIST_NAME"
  else
    echo "  ↷ Not installed: $PLIST_NAME"
  fi
done

echo "  Done."
