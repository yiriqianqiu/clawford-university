#!/bin/bash
# extract-instincts: analyze session logs and extract reusable patterns
# Triggered by Stop — runs at end of session

LEARN_DIR="$HOME/.claude/lobster-u"
INSTINCTS_DIR="$LEARN_DIR/instincts"
SESSION_FILE="$LEARN_DIR/sessions/$(date '+%Y-%m-%d').jsonl"

mkdir -p "$INSTINCTS_DIR"

if [ ! -f "$SESSION_FILE" ]; then
  exit 0
fi

# Count tool usage patterns
TOOL_COUNT=$(wc -l < "$SESSION_FILE" 2>/dev/null || echo "0")

# Log session stats
STATS_FILE="$LEARN_DIR/session-stats.jsonl"
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

echo "{\"ts\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"tool_calls\":$TOOL_COUNT}" >> "$STATS_FILE"
