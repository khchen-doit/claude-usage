---
description: Install the claude-usage statusLine into ~/.claude/settings.json (the Stop hook is auto-registered by the plugin)
allowed-tools: Read, Write
---

# Setup claude-usage

The Stop hook is registered automatically by the plugin (see `hooks/hooks.json`) and
always resolves to the current plugin version via `${CLAUDE_PLUGIN_ROOT}` — it never needs
to be written into settings.json and survives plugin updates and cache cleanup on its own.

This command only configures the **statusLine**, which Claude Code cannot accept from a
plugin and must read from `~/.claude/settings.json`. To keep it safe from cache cleanup, we
copy the statusLine script to a stable location under `~/.claude/claude-usage/` and point
settings.json at that absolute path.

Follow these steps exactly:

1. Determine the user's actual home directory (expand `~` to the full absolute path, e.g.
   `/home/alice` or `C:/Users/alice`). Use this expanded path for all subsequent steps —
   never write `~` literally into settings.json. Use forward slashes in all paths.

2. Read `${CLAUDE_PLUGIN_ROOT}/claude_statusline.js` and write its content to
   `<home>/.claude/claude-usage/claude_statusline.js` (overwrite if it already exists, so
   re-running this command after a plugin update refreshes the stable copy).

3. Read `<home>/.claude/settings.json`. If the file does not exist, start with `{}`.

4. Update the JSON as follows, preserving all other fields:

   **statusLine** (replace entirely):
   ```json
   {
     "type": "command",
     "command": "node <home>/.claude/claude-usage/claude_statusline.js",
     "refreshInterval": 30
   }
   ```

   **hooks.Stop** — clean up legacy entries from older versions of this plugin:
   - If `hooks.Stop` exists, remove any entry whose command contains `claude_usage_hook.js`
     (these were written by older setups and now point at volatile/stale paths). The hook is
     now provided by the plugin itself, so it must NOT be present in settings.json.
   - If removing leaves `hooks.Stop` as an empty array, delete the `hooks.Stop` key. If that
     leaves `hooks` empty, you may delete `hooks` too. Do not touch unrelated hooks.

5. Write the merged result back to `<home>/.claude/settings.json`.

6. Tell the user: "Done. Restart Claude Code to activate the status line. The Stop hook is
   handled automatically by the plugin — no settings.json entry needed."
