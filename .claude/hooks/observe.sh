#!/bin/bash
# observe: capture tool invocations for continuous learning
# Triggered by PostToolUse — logs every tool use for pattern extraction

LEARN_DIR="$HOME/.claude/lobster-u/sessions"
mkdir -p "$LEARN_DIR"

SESSION_FILE="$LEARN_DIR/$(date '+%Y-%m-%d').jsonl"
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")

# Log tool usage
echo "{\"ts\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"tool\":\"$CLAUDE_TOOL_NAME\"}" >> "$SESSION_FILE"
