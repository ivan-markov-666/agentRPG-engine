import fs from 'fs/promises';
import path from 'path';

interface CliArgs {
  strict: boolean;
  root: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { strict: false, root: process.cwd() };

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    switch (flag) {
      case '--strict':
        args.strict = true;
        break;
      case '--root': {
        const next = argv[i + 1];
        if (!next || next.startsWith('-')) throw new Error('Flag --root expects a value');
        args.root = path.resolve(next);
        i += 1;
        break;
      }
      default:
        if (flag.startsWith('-')) throw new Error(`Unknown flag: ${flag}`);
        throw new Error(`Unexpected argument: ${flag}`);
    }
  }

  return args;
}

function shouldSkipDir(name: string): boolean {
  return (
    name === 'node_modules' ||
    name === 'dist' ||
    name === '.git' ||
    name === '.windsurf'
  );
}

async function walkForJsFiles(root: string, dir: string, out: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      await walkForJsFiles(root, abs, out);
      continue;
    }

    if (!entry.isFile()) continue;

    if (entry.name.endsWith('.js') || entry.name.endsWith('.cjs') || entry.name.endsWith('.mjs')) {
      out.push(path.relative(root, abs));
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);

  const jsFiles: string[] = [];
  await walkForJsFiles(args.root, args.root, jsFiles);
  jsFiles.sort((a, b) => a.localeCompare(b));

  if (jsFiles.length === 0) {
    console.log('OK: no JS source files (.js/.cjs/.mjs) found (excluding dist/, node_modules/, .git/, .windsurf/)');
    return;
  }

  console.log('Found JS source files (.js/.cjs/.mjs) (excluding dist/, node_modules/, .git/, .windsurf/):');
  for (const f of jsFiles) console.log(`- ${f}`);

  if (args.strict) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[ERROR][check-no-js]', (err as Error).message);
  process.exit(1);
});
