#!/bin/bash
# auto-tmux-dev: detect dev server commands and wrap in tmux
# Triggered by PreToolUse on Bash

COMMAND="$CLAUDE_TOOL_ARG_COMMAND"

# Check if command is a dev server
if echo "$COMMAND" | grep -qE '(npm run dev|pnpm dev|yarn dev|next dev|vite|nuxt dev)'; then
  if command -v tmux &>/dev/null; then
    PROJECT=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "dev")
    SESSION_NAME="${PROJECT}-dev"

    # Check if tmux session already exists
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
      echo "Dev server already running in tmux session: $SESSION_NAME"
      echo "Use: tmux attach -t $SESSION_NAME"
    else
      echo "💡 Tip: 建议用 tmux 运行 dev server 避免阻塞"
      echo "Run: tmux new-session -d -s $SESSION_NAME '$COMMAND'"
    fi
  fi
fi
