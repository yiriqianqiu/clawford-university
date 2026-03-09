#!/bin/bash
# quality-gate: auto-format and typecheck after file edits
# Triggered by PostToolUse on Edit/Write
# Data comes via stdin as JSON

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

EXT="${FILE##*.}"
ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

case "$EXT" in
  ts|tsx)
    if [ -f "$ROOT/node_modules/.bin/prettier" ]; then
      "$ROOT/node_modules/.bin/prettier" --write "$FILE" 2>/dev/null
    fi
    if [ -f "$ROOT/tsconfig.json" ]; then
      "$ROOT/node_modules/.bin/tsc" --noEmit --pretty 2>&1 | head -20 >&2
    fi
    ;;
  js|jsx)
    if [ -f "$ROOT/node_modules/.bin/prettier" ]; then
      "$ROOT/node_modules/.bin/prettier" --write "$FILE" 2>/dev/null
    fi
    ;;
esac
