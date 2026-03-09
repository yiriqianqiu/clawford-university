#!/bin/bash
# auto-tmux-dev: detect dev server commands and suggest tmux
# Triggered by PreToolUse on Bash
# Data comes via stdin as JSON

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

if echo "$COMMAND" | grep -qE '(npm run dev|pnpm dev|yarn dev|next dev|vite|nuxt dev)'; then
  if command -v tmux &>/dev/null; then
    PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "dev")
    SESSION_NAME="${PROJECT}-dev"

    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
      echo "Dev server already running in tmux session: $SESSION_NAME" >&2
    else
      echo "Tip: use tmux to run dev server: tmux new-session -d -s $SESSION_NAME '$COMMAND'" >&2
    fi
  fi
fi
