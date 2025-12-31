#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_ARCHIVE = 'docs/analysis/reports/archive';
const DEFAULT_DEST = 'docs/analysis/reports/central-upload';
const DEFAULT_HISTORY = 'docs/analysis/reports/telemetry-history.json';

interface CliArgs {
  archiveDir: string;
  dest: string;
  includeHistory: boolean;
  historyFile: string;
  copyAll: boolean;
  dryRun: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    archiveDir: DEFAULT_ARCHIVE,
    dest: DEFAULT_DEST,
    includeHistory: false,
    historyFile: DEFAULT_HISTORY,
    copyAll: false,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    switch (flag) {
      case '--archive-dir':
        if (argv[i + 1]) args.archiveDir = argv[++i];
        break;
      case '--dest':
        if (argv[i + 1]) args.dest = argv[++i];
        break;
      case '--history':
        args.includeHistory = true;
        if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
          args.historyFile = argv[++i];
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

export function getArchiveFiles(dir: string, copyAll: boolean): string[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.length) return [];
  if (copyAll) {
    return files.map((name) => path.join(dir, name));
  }
  const latest = files
    .map((name) => ({ name, stat: fs.statSync(path.join(dir, name)) }))
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)[0];
  return latest ? [path.join(dir, latest.name)] : [];
}

function copyFile(src: string, destDir: string, dryRun: boolean): string {
  const targetPath = path.join(destDir, path.basename(src));
  if (dryRun) return targetPath;
  fs.copyFileSync(src, targetPath);
  return targetPath;
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    const root = path.resolve(__dirname, '..', '..');
    const archiveDir = path.resolve(root, args.archiveDir);
    const destDir = path.resolve(root, args.dest);
    const filesToCopy = getArchiveFiles(archiveDir, args.copyAll);

    if (!filesToCopy.length && !args.includeHistory) {
      console.log('[PUBLISH][SKIP] No archive files found.');
      return;
    }

    if (!args.dryRun) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const copied: string[] = [];
    filesToCopy.forEach((filePath) => {
      copied.push(copyFile(filePath, destDir, args.dryRun));
    });

    if (args.includeHistory) {
      const historyPath = path.resolve(root, args.historyFile);
      if (fs.existsSync(historyPath)) {
        copied.push(copyFile(historyPath, destDir, args.dryRun));
      } else {
        console.warn(`[PUBLISH][WARN] History file not found: ${historyPath}`);
      }
    }

    if (!copied.length) {
      console.log('[PUBLISH][SKIP] Nothing copied.');
      return;
    }

    if (args.dryRun) {
      console.log('[PUBLISH][DRY-RUN] Files that would be copied:');
      copied.forEach((destPath) => console.log(`  - ${destPath}`));
    } else {
      console.log('[PUBLISH] Copied files to central upload directory:');
      copied.forEach((destPath) => console.log(`  - ${destPath}`));
      console.log(`[PUBLISH] Ready to sync '${destDir}' with central storage or dashboard pipeline.`);
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
