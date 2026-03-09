#!/bin/bash
# Save session summary on conversation end

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
NOTES_FILE="$ROOT/.claude/session-notes.md"

if [ -z "$ROOT" ]; then
  exit 0
fi

cd "$ROOT" 2>/dev/null || exit 0

if [ ! -f "$NOTES_FILE" ]; then
  echo "# Session Notes" > "$NOTES_FILE"
  echo "" >> "$NOTES_FILE"
fi

echo "" >> "$NOTES_FILE"
echo "---" >> "$NOTES_FILE"
echo "## $(date '+%Y-%m-%d %H:%M') Session End" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

echo "### Recent Commits" >> "$NOTES_FILE"
git log --oneline -5 2>/dev/null >> "$NOTES_FILE" || echo "No commits yet" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

UNCOMMITTED=$(git diff --name-only 2>/dev/null)
if [ -n "$UNCOMMITTED" ]; then
  echo "### Uncommitted Changes" >> "$NOTES_FILE"
  echo "$UNCOMMITTED" >> "$NOTES_FILE"
  echo "" >> "$NOTES_FILE"
fi

# Trim to 200 lines
LINES=$(wc -l < "$NOTES_FILE")
if [ "$LINES" -gt 200 ]; then
  tail -100 "$NOTES_FILE" > "$NOTES_FILE.tmp"
  mv "$NOTES_FILE.tmp" "$NOTES_FILE"
fi
