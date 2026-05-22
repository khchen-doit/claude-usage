#!/usr/bin/env bash
# Optional: sets up shell integration so usage is shown when you type `claude` in terminal.
# The plugin itself (statusLine inside Claude Code) is configured via /claude-usage:setup.

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOTCLAUDE="$HOME/.claude"

mkdir -p "$DOTCLAUDE"
cp "$PROJECT_DIR/claude_bashrc.sh" "$DOTCLAUDE/"
echo "$PROJECT_DIR" > "$DOTCLAUDE/claude_usage_path"

echo "Shell integration installed."
echo ""
echo "Add to ~/.bashrc:"
echo "  . ~/.claude/claude_bashrc.sh"
