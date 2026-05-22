# Optional: sets up shell integration so usage is shown when you type `claude` in PowerShell.
# The plugin itself (statusLine inside Claude Code) is configured via /claude-usage:setup.

$ProjectDir = $PSScriptRoot
$DotClaude  = "$HOME\.claude"

New-Item -ItemType Directory -Force $DotClaude | Out-Null
$ProjectDir | Out-File "$DotClaude\claude_usage_path" -Encoding utf8 -NoNewline

Write-Host "Shell integration installed."
Write-Host ""
Write-Host "Add to PowerShell profile ($PROFILE):"
Write-Host @"
`$_CLAUDE_BIN = (Get-Command claude -ErrorAction SilentlyContinue).Source
function claude {
    node "$ProjectDir\claude_usage.js"
    & `$_CLAUDE_BIN @args
}
"@
