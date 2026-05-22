const fs = require('fs');

let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
if (!raw.trim()) process.exit(0);

let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

function bar(pct, width = 10) {
  const n = pct == null ? 0 : Math.round(Math.min(100, Math.max(0, pct)) / 100 * width);
  return '█'.repeat(n) + '░'.repeat(width - n);
}

function color(pct, text) {
  if (pct == null) return text;
  const c = pct < 50 ? 32 : pct < 80 ? 33 : 31; // green / yellow / red
  return `\x1b[${c}m${text}\x1b[0m`;
}

function resetIn(ts) {
  if (!ts) return null;
  const diff = ts * 1000 - Date.now();
  if (diff <= 0) return 'ready';
  const m = Math.floor(diff / 60000);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

const fh = data?.rate_limits?.five_hour;
const sd = data?.rate_limits?.seven_day;
const fhPct = fh?.used_percentage ?? null;
const sdPct = sd?.used_percentage ?? null;

if (fhPct == null && sdPct == null) process.exit(0);

function resetDay(ts) {
  if (!ts) return null;
  const d = new Date(ts * 1000);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  const h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}

const fhReset = resetIn(fh?.resets_at);
const sdReset = resetDay(sd?.resets_at);

const fhPctInt = fhPct != null ? Math.round(fhPct) : null;
const sdPctInt = sdPct != null ? Math.round(sdPct) : null;

const fhStr = color(fhPct, `5h ${bar(fhPct)} ${fhPctInt ?? '?'}%`)
            + (fhReset ? color(fhPct, ` ${fhReset}`) : '');
const sdStr = color(sdPct, `7d ${bar(sdPct)} ${sdPctInt ?? '?'}%`)
            + (sdReset ? color(sdPct, ` ${sdReset}`) : '');

const line = `${fhStr}  │  ${sdStr}`;

// Right-align by stripping ANSI codes to measure visible length
const visLen = line.replace(/\x1b\[[0-9;]*m/g, '').length;
const pad = Math.max(0, (process.stdout.columns || 80) - visLen - 1);
process.stdout.write(' '.repeat(pad) + line + '\n');
