#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { archiveTelemetry, ArchiveTelemetryOptions } from '../archive-telemetry';

const DEFAULT_HISTORY = 'docs/analysis/reports/telemetry-history.json';
const DEFAULT_METRICS_OUT = 'docs/analysis/metrics-summary.md';
const DEFAULT_ARCHIVE_DIR = 'docs/analysis/reports/archive';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export interface CliArgs {
  game: string;
  customPath: string | null;
  runId: string | null;
  history: string | null;
  log: string | null;
  out: string | null;
  limit: number | null;
  autoArchive: number | null;
  archiveLabel: string | null;
  archiveDir: string | null;
  archiveDryRun: boolean;
  extraValidatorArgs: string[];
}

export interface ValidateMetricsDeps {
  spawnSyncFn?: typeof spawnSync;
  archiveTelemetryFn?: (options: ArchiveTelemetryOptions) => unknown;
  fsModule?: typeof fs;
  now?: () => Date;
}

export interface RunValidateMetricsOptions {
  rootDir?: string;
  deps?: ValidateMetricsDeps;
}

export interface ValidateMetricsResult {
  validatorStatus: number;
  metricsStatus: number | null;
  archiveTriggered: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    customPath: null,
    runId: null,
    history: null,
    log: null,
    out: null,
    limit: null,
    autoArchive: null,
    archiveLabel: null,
    archiveDir: null,
    archiveDryRun: false,
    extraValidatorArgs: [],
  };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--':
        args.extraValidatorArgs.push(...argv.slice(i + 1));
        i = argv.length;
        break;
      case '--game':
      case '-g':
        if (next) {
          args.game = next;
          i += 1;
        }
        break;
      case '--path':
      case '-p':
        if (next) {
          args.customPath = next;
          i += 1;
        }
        break;
      case '--run-id':
      case '-r':
        if (next) {
          args.runId = next;
          i += 1;
        }
        break;
      case '--history':
        if (next) {
          args.history = next;
          i += 1;
        }
        break;
      case '--log':
        if (next) {
          args.log = next;
          i += 1;
        }
        break;
      case '--out':
        if (next) {
          args.out = next;
          i += 1;
        }
        break;
      case '--limit':
        if (next) {
          args.limit = Number(next);
          i += 1;
        }
        break;
      case '--auto-archive':
        if (next) {
          args.autoArchive = Number(next);
          i += 1;
        }
        break;
      case '--archive-label':
        if (next) {
          args.archiveLabel = next;
          i += 1;
        }
        break;
      case '--archive-dir':
        if (next) {
          args.archiveDir = next;
          i += 1;
        }
        break;
      case '--dry-run':
        args.archiveDryRun = true;
        break;
      default:
        args.extraValidatorArgs.push(flag);
        break;
    }
  }
  return args;
}

function getHistoryEntries(historyPath: string, fsModule: typeof fs): number {
  try {
    const raw = fsModule.readFileSync(historyPath, 'utf8').trim();
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === 'object') return 1;
    return 0;
  } catch {
    return 0;
  }
}

function runNpmScript(
  scriptName: string,
  scriptArgs: string[],
  root: string,
  spawnFn: typeof spawnSync,
): number {
  const result = spawnFn(npmCommand, ['run', scriptName, '--', ...scriptArgs], {
    stdio: 'inherit',
    cwd: root,
  });
  if (result.error) {
    throw result.error;
  }
  return result.status ?? 0;
}

function generateRunId(now: () => Date): string {
  return `dev-${now().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
}

export function runValidateMetrics(
  args: CliArgs,
  options: RunValidateMetricsOptions = {},
): ValidateMetricsResult {
  const root = options.rootDir ?? path.resolve(__dirname, '..', '..');
  const deps = options.deps ?? {};
  const fsModule = deps.fsModule ?? fs;
  const spawnFn = deps.spawnSyncFn ?? spawnSync;
  const archiveFn = deps.archiveTelemetryFn ?? archiveTelemetry;
  const nowFn = deps.now ?? (() => new Date());

  const historyPath = path.resolve(root, args.history ?? DEFAULT_HISTORY);
  const logPath = path.resolve(root, args.log ?? args.history ?? DEFAULT_HISTORY);
  const metricsOutPath = path.resolve(root, args.out ?? DEFAULT_METRICS_OUT);
  const archiveDir = path.resolve(root, args.archiveDir ?? DEFAULT_ARCHIVE_DIR);
  const gamePath =
    args.customPath && args.customPath.trim().length > 0
      ? path.resolve(root, args.customPath)
      : path.join(root, 'games', args.game);
  const runId = args.runId || generateRunId(nowFn);

  let archiveTriggered = false;
  if (Number.isFinite(args.autoArchive) && (args.autoArchive as number) > 0) {
    const entries = getHistoryEntries(historyPath, fsModule);
    if (entries >= (args.autoArchive as number)) {
      archiveFn({
        label: args.archiveLabel || `auto-${runId}`,
        history: path.relative(root, historyPath),
        archive: path.relative(root, archiveDir),
        min: 1,
        dryRun: args.archiveDryRun,
        cwd: root,
        fsModule,
      });
      archiveTriggered = true;
    }
  }

  const validatorArgs = ['--path', gamePath, '--log', logPath, '--run-id', runId, ...args.extraValidatorArgs];
  const validatorStatus = runNpmScript('validate', validatorArgs, root, spawnFn);
  if (validatorStatus !== 0) {
    return { validatorStatus, metricsStatus: null, archiveTriggered };
  }

  const metricsArgs = ['--history', historyPath, '--out', metricsOutPath];
  if (Number.isFinite(args.limit) && args.limit !== null) {
    metricsArgs.push('--limit', String(args.limit));
  }
  const metricsStatus = runNpmScript('metrics:report', metricsArgs, root, spawnFn);

  return { validatorStatus, metricsStatus, archiveTriggered };
}

export function main(argv: string[] = process.argv): void {
  let result: ValidateMetricsResult;
  try {
    const args = parseArgs(argv);
    result = runValidateMetrics(args);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[VALIDATE:METRICS][ERROR]', message);
    process.exit(1);
    return;
  }

  if (result.validatorStatus !== 0) {
    process.exit(result.validatorStatus);
    return;
  }
  if (result.metricsStatus && result.metricsStatus !== 0) {
    process.exit(result.metricsStatus);
    return;
  }
  process.exit(0);
}

if (require.main === module) {
  main();
}
