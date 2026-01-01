#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_ARCHIVE = 'docs/analysis/reports/archive';
const DEFAULT_DEST = 'docs/analysis/reports/central-upload';
const DEFAULT_HISTORY = 'docs/analysis/reports/telemetry-history.json';

export interface PublishTelemetryOptions {
  sourceDir?: string;
  destDir?: string;
  includeHistory?: boolean;
  historyFile?: string;
  copyAll?: boolean;
  dryRun?: boolean;
  cwd?: string;
  fsModule?: typeof fs;
}

interface CliArgs {
  sourceDir: string;
  destDir: string;
  includeHistory: boolean;
  historyFile: string;
  copyAll: boolean;
  dryRun: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    sourceDir: DEFAULT_ARCHIVE,
    destDir: DEFAULT_DEST,
    includeHistory: false,
    historyFile: DEFAULT_HISTORY,
    copyAll: false,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--archive-dir':
      case '--source':
        if (next) {
          args.sourceDir = next;
          i += 1;
        }
        break;
      case '--dest':
        if (next) {
          args.destDir = next;
          i += 1;
        }
        break;
      case '--history':
      case '--include-history':
        args.includeHistory = true;
        if (next && !next.startsWith('--')) {
          args.historyFile = next;
          i += 1;
        }
        break;
      case '--all':
        args.copyAll = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      default:
        if (flag.startsWith('--')) {
          throw new Error(`Unknown flag: ${flag}`);
        }
    }
  }
  return args;
}

function getArchiveFiles(dir: string, copyAll: boolean, fsModule: typeof fs): string[] {
  if (!fsModule.existsSync(dir)) return [];
  const files = fsModule.readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.length) return [];
  if (copyAll) {
    return files.map((name) => path.join(dir, name));
  }
  const latest = files
    .map((name) => ({ name, stat: fsModule.statSync(path.join(dir, name)) }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)[0];
  return latest ? [path.join(dir, latest.name)] : [];
}

function copyFile(src: string, destDir: string, dryRun: boolean, fsModule: typeof fs): string {
  const targetPath = path.join(destDir, path.basename(src));
  if (dryRun) return targetPath;
  fsModule.copyFileSync(src, targetPath);
  return targetPath;
}

export interface PublishTelemetryResult {
  copied: string[];
  dryRun: boolean;
  sourceDir: string;
  destDir: string;
  includedHistory: boolean;
}

export function publishTelemetry(options: PublishTelemetryOptions = {}): PublishTelemetryResult {
  const {
    sourceDir = DEFAULT_ARCHIVE,
    destDir = DEFAULT_DEST,
    includeHistory = false,
    historyFile = DEFAULT_HISTORY,
    copyAll = false,
    dryRun = false,
    cwd = path.resolve(__dirname, '..', '..'),
    fsModule = fs,
  } = options;

  const resolvedSource = path.resolve(cwd, sourceDir);
  const resolvedDest = path.resolve(cwd, destDir);

  if (!fsModule.existsSync(resolvedSource)) {
    throw new Error(`[PUBLISH][ERROR] Source archive directory not found: ${resolvedSource}`);
  }

  const filesToCopy = getArchiveFiles(resolvedSource, copyAll, fsModule);

  if (!filesToCopy.length && !includeHistory) {
    return { copied: [], dryRun, destDir: resolvedDest, sourceDir: resolvedSource, includedHistory: false };
  }

  if (!dryRun) {
    try {
      fsModule.mkdirSync(resolvedDest, { recursive: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`[PUBLISH][ERROR] Cannot access destination directory: ${resolvedDest} (${message})`);
    }
  }

  const copied: string[] = [];
  filesToCopy.forEach((filePath) => {
    copied.push(copyFile(filePath, resolvedDest, dryRun, fsModule));
  });

  let historyIncluded = false;
  if (includeHistory) {
    const historyPath = path.resolve(cwd, historyFile);
    if (!fsModule.existsSync(historyPath)) {
      throw new Error(`[PUBLISH][ERROR] History file not found: ${historyPath}`);
    }
    copied.push(copyFile(historyPath, resolvedDest, dryRun, fsModule));
    historyIncluded = true;
  }

  return { copied, dryRun, sourceDir: resolvedSource, destDir: resolvedDest, includedHistory: historyIncluded };
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    const result = publishTelemetry({
      sourceDir: args.sourceDir,
      destDir: args.destDir,
      includeHistory: args.includeHistory,
      historyFile: args.historyFile,
      copyAll: args.copyAll,
      dryRun: args.dryRun,
    });

    if (!result.copied.length) {
      console.log('[PUBLISH][SKIP] Nothing copied.');
      return;
    }

    if (result.dryRun) {
      console.log('[PUBLISH][DRY-RUN] Files that would be copied:');
      result.copied.forEach((destPath) => console.log(`  - ${destPath}`));
    } else {
      console.log('[PUBLISH] Copied files to central upload directory:');
      result.copied.forEach((destPath) => console.log(`  - ${destPath}`));
      console.log(`[PUBLISH] Ready to sync '${result.destDir}' with central storage or dashboard pipeline.`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[PUBLISH][ERROR]', message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
