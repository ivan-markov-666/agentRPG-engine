import path from 'path';

import { LocalFsHostAdapter, loadGameRuntimeSnapshot } from '../runtime';

interface CliArgs {
  path: string | null;
  debug: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { path: null, debug: false };
  const valueFlags = new Set(['--path', '-p']);

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const needsValue = valueFlags.has(flag);
    const nextValue = needsValue ? argv[i + 1] : null;

    if (needsValue) {
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error(`Flag ${flag} expects a value`);
      }
    }

    switch (flag) {
      case '--path':
      case '-p':
        args.path = argv[++i];
        break;
      case '--debug':
        args.debug = true;
        break;
      default:
        if (flag.startsWith('-')) throw new Error(`Unknown flag: ${flag}`);
        throw new Error(`Unexpected argument: ${flag}`);
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.path) {
    console.error('Usage: npm run runtime -- --path games/<gameId> [--debug]');
    process.exit(1);
    return;
  }

  const base = path.resolve(args.path);
  const host = new LocalFsHostAdapter(base);
  const snapshot = await loadGameRuntimeSnapshot(host);

  if (args.debug) {
    console.log(JSON.stringify(snapshot, null, 2));
  } else {
    console.log(`Loaded: ${snapshot.manifest.title} (${snapshot.manifest.id}) v${snapshot.manifest.version}`);
    const lang = snapshot.sessionInit?.preferred_language;
    if (lang) console.log(`preferred_language: ${lang}`);
  }
}

main().catch((err) => {
  const e = err as Error;
  console.error('[ERROR][RUNTIME]', e.message);
  process.exit(1);
});
