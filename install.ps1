# Sets up claude-usage: shell integration + statusLine + Stop hook in ~/.claude/settings.json

$ProjectDir = $PSScriptRoot
$DotClaude  = "$HOME\.claude"

New-Item -ItemType Directory -Force $DotClaude | Out-Null
$ProjectDir | Out-File "$DotClaude\claude_usage_path" -Encoding utf8 -NoNewline

node "$ProjectDir\setup_settings.js" $ProjectDir

Write-Host ""
Write-Host "Add to PowerShell profile ($PROFILE) for shell display before each 'claude' invocation:"
Write-Host @"
`$_CLAUDE_BIN = (Get-Command claude -ErrorAction SilentlyContinue).Source
function claude {
    node "$ProjectDir\claude_usage.js"
    & `$_CLAUDE_BIN @args
}
"@
Write-Host ""
Write-Host "Restart Claude Code to activate the status line."
