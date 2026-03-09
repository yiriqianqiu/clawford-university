#!/bin/bash
# cost-tracker: append per-session cost estimate to metrics file
# Triggered by Stop event

METRICS_DIR="$HOME/.claude/metrics"
METRICS_FILE="$METRICS_DIR/costs.jsonl"

mkdir -p "$METRICS_DIR"

# Get project name from git
PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

# Append session record
echo "{\"timestamp\":\"$TIMESTAMP\",\"project\":\"$PROJECT\",\"event\":\"session_end\"}" >> "$METRICS_FILE"
