#!/bin/bash
# quality-gate: auto-format and typecheck after file edits
# Triggered by PostToolUse on Edit/Write

FILE="$CLAUDE_TOOL_ARG_FILE_PATH"

if [ -z "$FILE" ]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  ts|tsx)
    # Run prettier if available
    if command -v npx &>/dev/null && [ -f "$(git rev-parse --show-toplevel 2>/dev/null)/node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE" 2>/dev/null
    fi
    # Run typecheck
    if [ -f "$(git rev-parse --show-toplevel 2>/dev/null)/tsconfig.json" ]; then
      npx tsc --noEmit --pretty 2>&1 | head -20
    fi
    ;;
  js|jsx)
    if command -v npx &>/dev/null && [ -f "$(git rev-parse --show-toplevel 2>/dev/null)/node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE" 2>/dev/null
    fi
    ;;
  sol)
    if command -v npx &>/dev/null && [ -f "$(git rev-parse --show-toplevel 2>/dev/null)/node_modules/.bin/prettier" ]; then
      npx prettier --write "$FILE" --plugin prettier-plugin-solidity 2>/dev/null
    fi
    ;;
esac
