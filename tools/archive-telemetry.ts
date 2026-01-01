#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_HISTORY = 'docs/analysis/reports/telemetry-history.json';
const DEFAULT_ARCHIVE = 'docs/analysis/reports/archive';
const DEFAULT_MIN = 50;

interface CliArgs {
  label: string;
  history: string;
  archive: string;
  min: number;
  dryRun: boolean;
}

export interface ArchiveTelemetryOptions {
  label?: string;
  history?: string;
  archive?: string;
  min?: number;
  dryRun?: boolean;
  cwd?: string;
  fsModule?: typeof fs;
}

export interface ArchiveTelemetryResult {
  skipped: boolean;
  reason?: 'empty-history' | 'below-threshold';
  count?: number;
  archivePath?: string;
  historyPath?: string;
  dryRun?: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    label: 'telemetry',
    history: DEFAULT_HISTORY,
    archive: DEFAULT_ARCHIVE,
    min: DEFAULT_MIN,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];

    switch (flag) {
      case '--label':
      case '-l':
        if (next) args.label = next;
        break;
      case '--history':
        if (next) args.history = next;
        break;
      case '--archive':
        if (next) args.archive = next;
        break;
      case '--min':
        if (next && !Number.isNaN(Number(next))) {
          args.min = Math.max(1, Number(next));
        }
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      default:
        break;
    }
  }

  return args;
}

export function formatTimestamp(date: Date = new Date()): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}-${pad(
    date.getMinutes(),
  )}-${pad(date.getSeconds())}`;
}

export function sanitizeLabel(label: string | null | undefined): string {
  return (label || 'telemetry').replace(/[^a-zA-Z0-9-_]/g, '_');
}

export function archiveTelemetry(options: ArchiveTelemetryOptions = {}): ArchiveTelemetryResult {
  const {
    label = 'telemetry',
    history = DEFAULT_HISTORY,
    archive = DEFAULT_ARCHIVE,
    min = DEFAULT_MIN,
    dryRun = false,
    cwd = path.resolve(__dirname, '..'),
    fsModule = fs,
  } = options;

  const effectiveMin = Number.isFinite(min) && min > 0 ? min : DEFAULT_MIN;
  const historyPath = path.resolve(cwd, history);

  if (!fsModule.existsSync(historyPath)) {
    throw new Error(`[ARCHIVE][ERROR] Telemetry file not found: ${historyPath}`);
  }

  const raw = fsModule.readFileSync(historyPath, 'utf8').trim();
  if (!raw || raw === '[]' || raw === '{}') {
    return { skipped: true, reason: 'empty-history' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[ARCHIVE][ERROR] Cannot parse telemetry history JSON: ${message}`);
  }

  const count = Array.isArray(parsed) ? parsed.length : 1;
  if (count < effectiveMin) {
    return { skipped: true, reason: 'below-threshold', count };
  }

  const archiveDir = path.resolve(cwd, archive);
  if (!dryRun) {
    try {
      fsModule.mkdirSync(archiveDir, { recursive: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`[ARCHIVE][ERROR] Cannot access archive directory: ${archiveDir} (${message})`);
    }
  }
  const archiveName = `${formatTimestamp()}-${sanitizeLabel(label)}.json`;
  const archivePath = path.join(archiveDir, archiveName);

  if (!dryRun) {
    fsModule.writeFileSync(archivePath, raw, 'utf8');
    fsModule.writeFileSync(historyPath, '[]\n', 'utf8');
  }

  return {
    skipped: false,
    count,
    archivePath,
    historyPath,
    dryRun,
  };
}

export function main(argv: string[] = process.argv): void {
  let result: ArchiveTelemetryResult;
  let args: CliArgs;
  try {
    args = parseArgs(argv);
    result = archiveTelemetry(args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
    return;
  }

  if (result.skipped) {
    if (result.reason === 'below-threshold') {
      console.log(`[ARCHIVE][SKIP] Telemetry history has ${result.count || 0} run(s); minimum is ${args.min}.`);
    } else {
      console.log('[ARCHIVE][SKIP] Telemetry history is empty. Nothing to archive.');
    }
    return;
  }

  if (result.dryRun) {
    console.log(`[ARCHIVE][DRY-RUN] Would archive ${result.count} run(s) from ${result.historyPath} to ${result.archivePath}`);
  } else {
    console.log(`[ARCHIVE] Archived ${result.count} run(s) to ${result.archivePath}`);
  }
}

if (require.main === module) {
  main();
}
