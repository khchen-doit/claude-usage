const fs = require('fs');
const path = require('path');
const os = require('os');

const SNAPSHOT_PATH = path.join(os.homedir(), '.claude', 'usage_snapshot.json');

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);
    const rateLimits = data?.rate_limits;
    if (!rateLimits) return;

    const snapshot = {
      updated_at: Math.floor(Date.now() / 1000),
      five_hour: rateLimits.five_hour ?? null,
      seven_day: rateLimits.seven_day ?? null,
    };

    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
  } catch {}
});
