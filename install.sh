#!/usr/bin/env bash
# Sets up claude-usage: shell integration + statusLine in ~/.claude/settings.json
# (the Stop hook is auto-registered by the plugin; setup_settings.js installs the
#  runtime scripts to a stable ~/.claude/claude-usage dir so paths survive updates)
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOTCLAUDE="$HOME/.claude"

mkdir -p "$DOTCLAUDE"
cp "$PROJECT_DIR/claude_bashrc.sh" "$DOTCLAUDE/"
echo "$PROJECT_DIR" > "$DOTCLAUDE/claude_usage_path"

node "$PROJECT_DIR/setup_settings.js" "$PROJECT_DIR"

echo ""
echo "Add to ~/.bashrc or ~/.zshrc for shell display before each 'claude' invocation:"
echo "  . ~/.claude/claude_bashrc.sh"
echo ""
echo "Restart Claude Code to activate the status line."
