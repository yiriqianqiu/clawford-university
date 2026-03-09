#!/bin/bash
# Save session summary on conversation end
# Appends timestamp + recent git log to session notes

NOTES_FILE="$(git rev-parse --show-toplevel 2>/dev/null)/.claude/session-notes.md"

# Create file if not exists
if [ ! -f "$NOTES_FILE" ]; then
  echo "# Session Notes" > "$NOTES_FILE"
  echo "" >> "$NOTES_FILE"
fi

# Append session end marker with timestamp
echo "" >> "$NOTES_FILE"
echo "---" >> "$NOTES_FILE"
echo "## $(date '+%Y-%m-%d %H:%M') Session End" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

# Append recent git changes
echo "### Recent Commits" >> "$NOTES_FILE"
git log --oneline -5 2>/dev/null >> "$NOTES_FILE" || echo "No commits yet" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

# Append changed files
echo "### Modified Files" >> "$NOTES_FILE"
git diff --name-only HEAD~1 2>/dev/null >> "$NOTES_FILE" || echo "N/A" >> "$NOTES_FILE"
echo "" >> "$NOTES_FILE"

# Keep file under 200 lines (trim old entries)
LINES=$(wc -l < "$NOTES_FILE")
if [ "$LINES" -gt 200 ]; then
  tail -100 "$NOTES_FILE" > "$NOTES_FILE.tmp"
  mv "$NOTES_FILE.tmp" "$NOTES_FILE"
fi
