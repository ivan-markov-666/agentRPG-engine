#!/usr/bin/env node
import { spawnSync, SpawnSyncOptions } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  runId: string | null;
  history: string | null;
  out: string | null;
  limit: number | null;
  autoArchive: number | null;
  archiveLabel: string | null;
  extraValidatorArgs: string[];
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    runId: null,
    history: null,
    out: null,
    limit: null,
    autoArchive: null,
    archiveLabel: null,
    extraValidatorArgs: [],
  };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
        i += 1;
        break;
      case '--run-id':
      case '-r':
        if (next) args.runId = next;
        i += 1;
        break;
      case '--history':
        if (next) args.history = next;
        i += 1;
        break;
      case '--out':
        if (next) args.out = next;
        i += 1;
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
      default:
        args.extraValidatorArgs.push(flag);
        break;
    }
  }
  return args;
}

function runCommand(command: string, args: string[], options?: SpawnSyncOptions): void {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with code ${result.status}`);
  }
}

function getHistoryEntries(historyPath: string): number {
  try {
    const raw = fs.readFileSync(historyPath, 'utf8').trim();
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length;
    if (parsed && typeof parsed === 'object') return 1;
    return 0;
  } catch {
    return 0;
  }
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  const root = path.resolve(__dirname, '..', '..');
  const validatorPath = path.join(root, 'dist', 'cli', 'validate.js');
  const metricsPath = path.join(root, 'tools', 'metrics', 'report.js');
  const archivePath = path.join(root, 'tools', 'archive-telemetry.js');
  const logPath = path.resolve(root, 'docs', 'analysis', 'reports', 'telemetry-history.json');
  const historyPath = path.resolve(root, args.history || 'docs/analysis/reports/telemetry-history.json');
  const outPath = path.resolve(root, args.out || 'docs/analysis/metrics-summary.md');
  const runId = args.runId || `dev-${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}`;
  const validatorArgs = [
    '--path',
    path.join(root, 'games', args.game),
    '--log',
    logPath,
    '--run-id',
    runId,
    ...args.extraValidatorArgs.filter((arg) => arg !== '--run-id' && arg !== '-r'),
  ];

  runCommand('node', [validatorPath, ...validatorArgs]);

  const metricsArgs = ['--history', historyPath, '--out', outPath];
  if (Number.isFinite(args.limit)) {
    metricsArgs.push('--limit', String(args.limit));
  }
  runCommand('node', [metricsPath, ...metricsArgs]);

  if (Number.isFinite(args.autoArchive) && (args.autoArchive ?? 0) > 0) {
    const entries = getHistoryEntries(historyPath);
    if (entries >= (args.autoArchive as number)) {
      const label = args.archiveLabel || `auto-${runId}`;
      runCommand('node', [archivePath, '--label', label, '--history', path.relative(root, historyPath)]);
    }
  }
}

if (require.main === module) {
  main();
}
