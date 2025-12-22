#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { label: 'telemetry', history: 'docs/analysis/reports/telemetry-history.json' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--label' || a === '-l') && argv[i + 1]) {
      args.label = argv[++i];
    } else if (a === '--history' && argv[i + 1]) {
      args.history = argv[++i];
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const root = path.resolve(__dirname, '..');
  const historyPath = path.resolve(root, args.history);
  if (!fs.existsSync(historyPath)) {
    console.error(`[ARCHIVE][ERROR] Telemetry file not found: ${historyPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(historyPath, 'utf8').trim();
  if (!raw || raw === '[]' || raw === '{}') {
    console.log('[ARCHIVE] Telemetry history is empty. Nothing to archive.');
    process.exit(0);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('[ARCHIVE][ERROR] Cannot parse telemetry history JSON:', e.message);
    process.exit(1);
  }
  const count = Array.isArray(parsed) ? parsed.length : 1;
  const archiveDir = path.resolve(root, 'docs/analysis/reports/archive');
  fs.mkdirSync(archiveDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeLabel = args.label.replace(/[^a-zA-Z0-9-_]/g, '_');
  const archiveName = `${stamp}-${safeLabel}.json`;
  const archivePath = path.join(archiveDir, archiveName);
  fs.writeFileSync(archivePath, raw, 'utf8');
  fs.writeFileSync(historyPath, '[]\n', 'utf8');
  console.log(`[ARCHIVE] Archived ${count} run(s) to ${archivePath}`);
}

main();
