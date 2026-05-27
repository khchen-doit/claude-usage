# Claude Code Usage Monitor — Rate Limit Tracker Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-brightgreen)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/Claude%20Code-v2.x%2B-blue)](https://claude.ai/code)

A lightweight [Claude Code](https://claude.ai/code) plugin that tracks your **5-hour and weekly rate limit usage** in real time — displayed as a persistent status line at the bottom of the Claude Code interface.

```
5h ███░░░░░░░ 29% ready  │  7d ░░░░░░░░░░ 3% Fri 5:00 AM
```

Color-coded by usage: **green** < 50% · **yellow** 50–80% · **red** > 80%

> Reads data directly from Claude Code — no extra API calls, no token consumption.

---

## Why This Plugin?

Claude Code enforces a **5-hour rolling rate limit** and a **weekly token quota**. Without visibility into your usage, you can't tell how close you are to hitting a limit until Claude actually stops responding.

This plugin surfaces that information as a persistent, color-coded status line so you always know exactly where you stand — without leaving Claude Code or checking a separate dashboard.

---

## Installation

Run these three commands inside Claude Code:

<details>
<summary><strong>⚠️ Linux users: Click here first</strong></summary>

On Linux, `/tmp` is often a separate filesystem (tmpfs), which causes plugin installation to fail with:

```
EXDEV: cross-device link not permitted
```

**Fix**: Set TMPDIR before installing:

```bash
mkdir -p ~/.cache/tmp && TMPDIR=~/.cache/tmp claude
```

Then run the install command below in that session. This is a [Claude Code platform limitation](https://github.com/anthropics/claude-code/issues/14799).

</details>

```
/plugin marketplace add khchen-doit/claude-usage
/plugin install claude-usage
/claude-usage:setup
```

Then **restart Claude Code**. The usage status line appears at the bottom of the interface automatically.

---

## Requirements

- [Claude Code](https://claude.ai/code) v2.x+
- Node.js v18+

---

## How It Works

Claude Code calls `claude_statusline.js` every 30 seconds via the `statusLine` hook, passing rate limit data as JSON on stdin. The script formats usage percentages with ANSI color coding and outputs a right-aligned line — Claude Code renders it below the conversation.

A `Stop` hook saves a local snapshot after each response so `node claude_usage.js` can display the last known rate limit state outside of an active session.

`${CLAUDE_PLUGIN_ROOT}` in the generated config is a Claude Code built-in placeholder that expands to the plugin's install path at runtime — no hardcoded paths, works on any machine.

---

## Project Structure

```
claude-usage/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── setup.md             # /claude-usage:setup command
├── claude_statusline.js     # StatusLine script (run every 30s)
├── claude_usage_hook.js     # Stop hook — saves snapshot after each response
├── claude_usage.js          # Standalone display (outside Claude Code)
├── claude_bashrc.sh         # Optional shell integration
├── install.sh               # Optional shell integration installer (WSL/Linux/macOS)
└── install.ps1              # Optional shell integration installer (Windows)
```

---

## License

MIT
