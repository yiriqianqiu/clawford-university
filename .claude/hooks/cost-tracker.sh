#!/bin/bash
# session-tracker: record session metadata on stop

METRICS_DIR="$HOME/.claude/metrics"
METRICS_FILE="$METRICS_DIR/sessions.jsonl"

mkdir -p "$METRICS_DIR"

ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
PROJECT=$(basename "$ROOT" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Git diff stats
FILES_CHANGED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
LINES_ADDED=$(git diff --numstat 2>/dev/null | awk '{s+=$1} END {print s+0}')

# Tool call count from suggest-compact counter
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty' 2>/dev/null)
COUNTER_FILE="/tmp/claude-compact-counter-${SESSION_ID:-$(date '+%Y%m%d')}"
TOOL_CALLS=$(cat "$COUNTER_FILE" 2>/dev/null || echo "0")

echo "{\"ts\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"branch\":\"$BRANCH\",\"files_changed\":$FILES_CHANGED,\"lines_added\":$LINES_ADDED,\"tool_calls\":$TOOL_CALLS}" >> "$METRICS_FILE"
