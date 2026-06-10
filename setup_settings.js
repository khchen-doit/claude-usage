#!/usr/bin/env node
'use strict';

// Configures the claude-usage statusLine in ~/.claude/settings.json.
//
// The Stop hook is NOT written here — it is provided by the plugin itself via
// hooks/hooks.json and resolved live through ${CLAUDE_PLUGIN_ROOT} on every launch,
// so it survives plugin updates and cache cleanup. This script also strips any legacy
// Stop-hook entry that older versions wrote into settings.json.
//
// The statusLine cannot be supplied by a plugin, so we copy the script to a stable
// location under ~/.claude/claude-usage/ and point settings.json at that absolute path,
// keeping it independent of the volatile plugin cache.

const fs = require('fs');
const path = require('path');
const os = require('os');

const pluginDir = process.argv[2];
if (!pluginDir) {
  console.error('Usage: node setup_settings.js <plugin-dir>');
  process.exit(1);
}

const stableDir = path.join(os.homedir(), '.claude', 'claude-usage');
fs.mkdirSync(stableDir, { recursive: true });

// Copy the statusLine script to the stable location (overwrite to refresh on re-run).
const stableStatusline = path.join(stableDir, 'claude_statusline.js');
fs.copyFileSync(path.join(pluginDir, 'claude_statusline.js'), stableStatusline);

const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}

settings.statusLine = {
  type: 'command',
  command: `node ${stableStatusline.replace(/\\/g, '/')}`,
  refreshInterval: 30,
};

// Remove legacy Stop-hook entries that referenced claude_usage_hook.js — the hook is now
// plugin-native. Leaving them would double-fire or point at a stale path after cleanup.
if (settings.hooks && Array.isArray(settings.hooks.Stop)) {
  settings.hooks.Stop = settings.hooks.Stop.filter(entry => {
    const hooks = entry && Array.isArray(entry.hooks) ? entry.hooks : [];
    return !hooks.some(h => h.command && h.command.includes('claude_usage_hook.js'));
  });
  if (settings.hooks.Stop.length === 0) delete settings.hooks.Stop;
  if (Object.keys(settings.hooks).length === 0) delete settings.hooks;
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log(`Configured statusLine in ${settingsPath}`);
console.log(`Stable statusLine copied to ${stableStatusline}`);
console.log('Stop hook is provided by the plugin (hooks/hooks.json) — not written to settings.json.');
