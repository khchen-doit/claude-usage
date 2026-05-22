# Claude usage display — copy to ~/.claude/ via install.sh, then source from ~/.bashrc:
#   echo '. ~/.claude/claude_bashrc.sh' >> ~/.bashrc

_CLAUDE_USAGE_PATH_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/claude_usage_path"
_CLAUDE_USAGE_JS=""
[ -f "$_CLAUDE_USAGE_PATH_FILE" ] && _CLAUDE_USAGE_JS="$(cat "$_CLAUDE_USAGE_PATH_FILE")/claude_usage.js"

claude() {
    [ -n "$_CLAUDE_USAGE_JS" ] && [ -f "$_CLAUDE_USAGE_JS" ] && node "$_CLAUDE_USAGE_JS"
    command claude "$@"
}
