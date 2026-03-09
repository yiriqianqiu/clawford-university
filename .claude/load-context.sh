#!/bin/bash
# Load session context on conversation start
# Outputs key project state for Claude to consume

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"

echo "=== Lobster University — Session Context ==="
echo ""

# Current branch and status
echo "## Git Status"
git branch --show-current 2>/dev/null
git log --oneline -3 2>/dev/null || echo "No commits"
echo ""

# Show task progress if session notes exist
if [ -f "$ROOT/.claude/session-notes.md" ]; then
  echo "## Last Session Notes"
  tail -30 "$ROOT/.claude/session-notes.md"
  echo ""
fi

# Show pending TODOs from code
echo "## TODOs in Code"
grep -r "TODO:" "$ROOT/packages" "$ROOT/skills" "$ROOT/apps" --include="*.ts" --include="*.tsx" -l 2>/dev/null | head -10 || echo "None"
echo ""

echo "=== Ready to work ==="
