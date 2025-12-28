#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_HISTORY = 'docs/analysis/reports/telemetry-history.json';
const DEFAULT_ARCHIVE = 'docs/analysis/reports/archive';
const DEFAULT_MIN = 50;

function parseArgs(argv) {
  const args = {
    label: 'telemetry',
    history: DEFAULT_HISTORY,
    archive: DEFAULT_ARCHIVE,
    min: DEFAULT_MIN,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--label' || a === '-l') && argv[i + 1]) {
      args.label = argv[++i];
    } else if (a === '--history' && argv[i + 1]) {
      args.history = argv[++i];
    } else if (a === '--archive' && argv[i + 1]) {
      args.archive = argv[++i];
    } else if (a === '--min' && argv[i + 1]) {
      args.min = Number(argv[++i]);
    } else if (a === '--dry-run') {
      args.dryRun = true;
    }
  }
  if (!Number.isFinite(args.min) || args.min < 1) {
    args.min = DEFAULT_MIN;
  }
  return args;
}

function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function sanitizeLabel(label) {
  return (label || 'telemetry').replace(/[^a-zA-Z0-9-_]/g, '_');
}

function archiveTelemetry(options = {}) {
  const {
    label = 'telemetry',
    history = DEFAULT_HISTORY,
    archive = DEFAULT_ARCHIVE,
    min = DEFAULT_MIN,
    dryRun = false,
    cwd = path.resolve(__dirname, '..'),
    fsModule = fs,
  } = options;

  const historyPath = path.resolve(cwd, history);
  if (!fsModule.existsSync(historyPath)) {
    throw new Error(`[ARCHIVE][ERROR] Telemetry file not found: ${historyPath}`);
  }
  const raw = fsModule.readFileSync(historyPath, 'utf8').trim();
  if (!raw || raw === '[]' || raw === '{}') {
    return { skipped: true, reason: 'empty-history' };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`[ARCHIVE][ERROR] Cannot parse telemetry history JSON: ${e.message}`);
  }
  const count = Array.isArray(parsed) ? parsed.length : 1;
  if (count < min) {
    return { skipped: true, reason: 'below-threshold', count };
  }

  const archiveDir = path.resolve(cwd, archive);
  if (!dryRun) {
    try {
      fsModule.mkdirSync(archiveDir, { recursive: true });
    } catch (e) {
      throw new Error(`[ARCHIVE][ERROR] Cannot access archive directory (${archiveDir}): ${e.message}`);
    }
  }
  const archiveName = `${formatTimestamp()}-${sanitizeLabel(label)}.json`;
  const archivePath = path.join(archiveDir, archiveName);

  if (!dryRun) {
    fsModule.writeFileSync(archivePath, raw, 'utf8');
    fsModule.writeFileSync(historyPath, '[]\n', 'utf8');
  }
  return { skipped: false, count, archivePath, historyPath, dryRun };
}

function main() {
  let result;
  let args;
  try {
    args = parseArgs(process.argv);
    result = archiveTelemetry(args);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  if (result.skipped) {
    if (result.reason === 'below-threshold') {
      console.log(`[ARCHIVE][SKIP] Telemetry history has ${result.count || 0} run(s); minimum is ${args.min}.`);
    } else {
      console.log('[ARCHIVE][SKIP] Telemetry history is empty. Nothing to archive.');
    }
  } else if (result.dryRun) {
    console.log(`[ARCHIVE][DRY-RUN] Would archive ${result.count} run(s) from ${result.historyPath} to ${result.archivePath}`);
  } else {
    console.log(`[ARCHIVE] Archived ${result.count} run(s) to ${result.archivePath}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { archiveTelemetry, parseArgs, formatTimestamp, sanitizeLabel };
