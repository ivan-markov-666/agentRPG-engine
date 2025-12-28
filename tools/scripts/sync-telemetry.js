#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_SOURCE = 'docs/analysis/reports/central-upload';

function parseArgs(argv) {
  const args = { source: DEFAULT_SOURCE, dest: null, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
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

function copyRecursive(srcDir, destDir, dryRun) {
  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath, dryRun);
    } else {
      if (dryRun) {
        console.log(`[SYNC][DRY-RUN] ${srcPath} -> ${destPath}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
}

function main() {
  try {
    const args = parseArgs(process.argv);
    const root = path.resolve(__dirname, '..', '..');
    const sourceDir = path.resolve(root, args.source);

    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory not found: ${sourceDir}`);
    }

    const sourceStats = fs.readdirSync(sourceDir);
    if (!sourceStats.length) {
      console.log('[SYNC][SKIP] Source directory is empty.');
      return;
    }

    if (args.dest.startsWith('s3://')) {
      const aws = spawnSync('aws', ['s3', 'sync', sourceDir, args.dest, '--delete'], { stdio: 'inherit' });
      if (aws.status !== 0) {
        throw new Error(`aws s3 sync failed with code ${aws.status}`);
      }
      console.log(`[SYNC] Uploaded telemetry bundle to ${args.dest}`);
      return;
    }

    const destDir = path.isAbsolute(args.dest) ? args.dest : path.resolve(root, args.dest);
    copyRecursive(sourceDir, destDir, args.dryRun);
    console.log(`[SYNC] Files copied to ${destDir}${args.dryRun ? ' (dry-run)' : ''}`);
  } catch (err) {
    console.error('[SYNC][ERROR]', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs };
