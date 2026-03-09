#!/bin/bash
# observe: capture tool invocations for continuous learning
# Data comes via stdin as JSON

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)

LEARN_DIR="$HOME/.claude/lobster-u/sessions"
mkdir -p "$LEARN_DIR"

SESSION_FILE="$LEARN_DIR/$(date '+%Y-%m-%d').jsonl"
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

echo "{\"ts\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"tool\":\"$TOOL_NAME\"}" >> "$SESSION_FILE"
