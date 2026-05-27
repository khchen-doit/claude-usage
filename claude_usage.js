const fs = require('fs');
const path = require('path');
const os = require('os');

function getSnapshotPath() {
  const localPath = path.join(os.homedir(), '.claude', 'usage_snapshot.json');
  try {
    if (fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')) {
      // Native WSL2 Claude Code writes snapshot to Linux home — prefer that
      if (fs.existsSync(localPath)) return localPath;
      // Windows Claude Code accessed from WSL2 terminal — snapshot is on Windows side
      const { execSync } = require('child_process');
      const winUser = execSync('cmd.exe /c echo %USERNAME%', { encoding: 'utf8' }).trim();
      return `/mnt/c/Users/${winUser}/.claude/usage_snapshot.json`;
    }
  } catch {}
  return localPath;
}

const SNAPSHOT_PATH = getSnapshotPath();

function formatResetIn(resets_at) {
  if (resets_at == null) return 'N/A';
  const diffMs = resets_at * 1000 - Date.now();
  if (diffMs <= 0) return '0:00';
  const totalMins = Math.floor(diffMs / 60000);
  const h = Math.floor(totalMins / 60);
  const m = String(totalMins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function formatResetDay(resets_at) {
  if (resets_at == null) return 'N/A';
  const date = new Date(resets_at * 1000);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${day} ${h % 12 || 12}:${m} ${ampm}`;
}

try {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  const fh = snapshot.five_hour;
  const sd = snapshot.seven_day;

  const fhPct = fh?.used_percentage ?? '?';
  const sdPct = sd?.used_percentage ?? '?';

  console.log(
    `Usage ${fhPct}%, Resets in ${formatResetIn(fh?.resets_at)}` +
    `  |  Weekly ${sdPct}%, Resets ${formatResetDay(sd?.resets_at)}`
  );
} catch {
  console.log('No snapshot yet — run Claude Code once to populate data.');
}
