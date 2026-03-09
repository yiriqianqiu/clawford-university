#!/bin/bash
# Load session context on conversation start
# Uses $CLAUDE_PROJECT_DIR for reliable path resolution

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"

if [ -z "$ROOT" ]; then
  exit 0
fi

echo "=== Lobster University — Session Context ===" >&2
echo "" >&2

echo "## Git Status" >&2
cd "$ROOT" 2>/dev/null
git branch --show-current 2>/dev/null >&2
git log --oneline -3 2>/dev/null >&2 || echo "No commits" >&2
echo "" >&2

if [ -f "$ROOT/.claude/tasks.md" ]; then
  echo "## Task Progress" >&2
  grep -E '^\- \[[ x]\]' "$ROOT/.claude/tasks.md" 2>/dev/null | head -20 >&2
  echo "" >&2
fi

if [ -f "$ROOT/.claude/session-notes.md" ]; then
  echo "## Last Session Notes" >&2
  tail -20 "$ROOT/.claude/session-notes.md" >&2
  echo "" >&2
fi

echo "=== Ready to work ===" >&2
