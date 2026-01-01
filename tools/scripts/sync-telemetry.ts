#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_SOURCE = 'docs/analysis/reports/central-upload';

interface CliArgs {
  source: string;
  dest: string;
  dryRun: boolean;
}

export interface SyncTelemetryOptions {
  cwd?: string;
  sourceDir?: string;
  dest: string;
  dryRun?: boolean;
  spawnFn?: typeof spawnSync;
  logger?: Pick<typeof console, 'log' | 'error'>;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { source: DEFAULT_SOURCE, dest: '', dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--source' && argv[i + 1]) {
      args.source = argv[++i];
    } else if (flag === '--dest' && argv[i + 1]) {
      args.dest = argv[++i];
    } else if (flag === '--dry-run') {
      args.dryRun = true;
    } else {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }
  if (!args.dest) {
    throw new Error('Missing --dest <path|s3://bucket/folder>');
  }
  return args;
}

function copyRecursive(
  srcDir: string,
  destDir: string,
  dryRun: boolean,
  logger: Pick<typeof console, 'log'>
): void {
  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, dryRun, logger);
    } else if (dryRun) {
      logger.log(`[SYNC][DRY-RUN] ${srcPath} -> ${destPath}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

export function syncTelemetry(options: SyncTelemetryOptions): void {
  const {
    cwd = path.resolve(__dirname, '..', '..'),
    sourceDir = DEFAULT_SOURCE,
    dest,
    dryRun = false,
    spawnFn = spawnSync,
    logger = console,
  } = options;

  const sourceDirAbs = path.resolve(cwd, sourceDir);

  if (!fs.existsSync(sourceDirAbs)) {
    throw new Error(`Source directory not found: ${sourceDirAbs}`);
  }

  const sourceStats = fs.readdirSync(sourceDirAbs);
  if (!sourceStats.length) {
    logger.log('[SYNC][SKIP] Source directory is empty.');
    return;
  }

  if (dest.startsWith('s3://')) {
    const args = ['s3', 'sync', sourceDirAbs, dest, '--delete'];
    if (dryRun) {
      args.push('--dryrun');
    }
    const aws = spawnFn('aws', args, { stdio: 'inherit' });
    if (aws.status !== 0) {
      throw new Error(`aws s3 sync failed with code ${aws.status}`);
    }
    logger.log(`[SYNC] Uploaded telemetry bundle to ${dest}${dryRun ? ' (dry-run)' : ''}`);
    return;
  }

  const destDir = path.isAbsolute(dest) ? dest : path.resolve(cwd, dest);
  copyRecursive(sourceDirAbs, destDir, dryRun, logger);
  logger.log(`[SYNC] Files copied to ${destDir}${dryRun ? ' (dry-run)' : ''}`);
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    syncTelemetry({ sourceDir: args.source, dest: args.dest, dryRun: args.dryRun });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[SYNC][ERROR]', message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
