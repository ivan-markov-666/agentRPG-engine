#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  targetPath: string | null;
  language: string | null;
  debug: boolean | null;
}

interface UpdateLanguageOptions {
  cwd?: string;
  game?: string;
  pathOverride?: string | null;
  language: string;
  debug?: boolean | null;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { game: 'demo', targetPath: null, language: null, debug: null };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    if ((flag === '--game' || flag === '-g') && argv[i + 1]) {
      args.game = argv[++i];
    } else if (flag === '--path' && argv[i + 1]) {
      args.targetPath = argv[++i];
    } else if (flag === '--language' && argv[i + 1]) {
      args.language = argv[++i];
    } else if (flag === '--debug' && argv[i + 1]) {
      const value = argv[++i].toLowerCase();
      if (value === 'true' || value === 'on') {
        args.debug = true;
      } else if (value === 'false' || value === 'off') {
        args.debug = false;
      } else {
        throw new Error(`Invalid value for --debug: ${value}`);
      }
    } else if (flag === '--debug') {
      args.debug = true;
    } else {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }
  return args;
}

export function updateSessionLanguage(options: UpdateLanguageOptions): void {
  const { cwd = path.resolve(__dirname, '..', '..'), game = 'demo', pathOverride = null, language, debug = null } = options;
  if (!language || !language.trim()) {
    throw new Error('Missing --language <value>');
  }
  const targetRoot = pathOverride ? path.resolve(cwd, pathOverride) : path.resolve(cwd, 'games', game);
  const sessionPath = path.join(targetRoot, 'player-data', 'session-init.json');

  if (!fs.existsSync(sessionPath)) {
    throw new Error(`session-init.json not found: ${sessionPath}`);
  }

  const raw = fs.readFileSync(sessionPath, 'utf8');
  const data = raw.trim() ? JSON.parse(raw) : {};
  data.preferred_language = language;
  if (debug !== null) {
    data.debug = debug;
  }

  fs.mkdirSync(path.dirname(sessionPath), { recursive: true });
  fs.writeFileSync(sessionPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(`[LANG] Updated ${sessionPath}`);
  console.log(`preferred_language: ${data.preferred_language}`);
  if (debug !== null) {
    console.log(`debug: ${data.debug}`);
  }
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    updateSessionLanguage({
      language: args.language ?? '',
      game: args.game,
      pathOverride: args.targetPath,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[LANG][ERROR]', message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
