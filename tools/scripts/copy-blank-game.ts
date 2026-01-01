#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  dest: string | null;
  force: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { dest: null, force: false };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--dest' && argv[i + 1]) {
      args.dest = argv[++i];
    } else if (flag === '--force') {
      args.force = true;
    } else {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }
  return args;
}

function copyDir(source: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(source, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    const root = path.resolve(__dirname, '..', '..');
    const sourceDir = path.join(root, 'samples', 'blank-game');
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Blank game source not found: ${sourceDir}`);
    }

    const defaultDest = path.join('games', 'blank-game');
    const destPath = path.resolve(root, args.dest ?? defaultDest);

    if (fs.existsSync(destPath)) {
      if (!args.force) {
        throw new Error(
          `Destination already exists: ${destPath}. Pass --force to overwrite.`,
        );
      }
      fs.rmSync(destPath, { recursive: true, force: true });
    }

    copyDir(sourceDir, destPath);
    console.log(`[BLANK] Copied blank game skeleton to ${destPath}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[BLANK][ERROR]', message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
