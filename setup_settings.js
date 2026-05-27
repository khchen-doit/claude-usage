#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const pluginDir = process.argv[2];
if (!pluginDir) {
  console.error('Usage: node setup_settings.js <plugin-dir>');
  process.exit(1);
}

const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}

const normalizedDir = pluginDir.replace(/\\/g, '/');

settings.statusLine = {
  type: 'command',
  command: `node ${normalizedDir}/claude_statusline.js`,
  refreshInterval: 30,
};

if (!settings.hooks) settings.hooks = {};
if (!settings.hooks.Stop) settings.hooks.Stop = [];

const hookCmd = `node ${normalizedDir}/claude_usage_hook.js`;
const alreadyAdded = settings.hooks.Stop.some(
  entry => entry.hooks && entry.hooks.some(h => h.command === hookCmd)
);

if (!alreadyAdded) {
  settings.hooks.Stop.push({
    matcher: '',
    hooks: [{ type: 'command', command: hookCmd }],
  });
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
console.log(`Configured statusLine and Stop hook in ${settingsPath}`);
