---
description: Install claude-usage statusLine and Stop hook into ~/.claude/settings.json
allowed-tools: Read, Write
---

# Setup claude-usage

Add the usage monitor to `~/.claude/settings.json`.

Follow these steps exactly:

1. Read `~/.claude/settings.json`. If the file does not exist, start with `{}`.

2. Merge the following into the existing JSON, preserving all other fields:

   **statusLine** (top-level key):
   ```json
   {
     "type": "command",
     "command": "node ${CLAUDE_PLUGIN_ROOT}/claude_statusline.js",
     "refreshInterval": 30
   }
   ```

   **hooks.Stop** (append this entry if not already present):
   ```json
   {
     "matcher": "",
     "hooks": [
       {
         "type": "command",
         "command": "node ${CLAUDE_PLUGIN_ROOT}/claude_usage_hook.js"
       }
     ]
   }
   ```

3. Write the merged result back to `~/.claude/settings.json`.

4. Tell the user: "Done. Restart Claude Code to activate the status line."
