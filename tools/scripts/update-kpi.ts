#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  targetPath: string | null;
  firstMs: number | null;
  firstMinutes: number | null;
  refusalAttempts: number | null;
  refusalSuccesses: number | null;
  validationAttempts: number | null;
  completedQuests: number | null;
  debug: boolean | null;
}

interface UpdateKpiOptions {
  cwd?: string;
  game?: string;
  pathOverride?: string | null;
  firstActiveQuestMs?: number | null;
  refusalAttempts?: number | null;
  refusalSuccesses?: number | null;
  validationAttempts?: number | null;
  completedQuests?: number | null;
  debugEnabled?: boolean | null;
}

function parseNumber(value: string | undefined | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    targetPath: null,
    firstMs: null,
    firstMinutes: null,
    refusalAttempts: null,
    refusalSuccesses: null,
    validationAttempts: null,
    completedQuests: null,
    debug: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    switch (flag) {
      case '--game':
      case '-g':
        args.game = argv[++i];
        break;
      case '--path':
        args.targetPath = argv[++i];
        break;
      case '--first-ms':
        args.firstMs = parseNumber(argv[++i]);
        break;
      case '--first-min':
      case '--first-minutes':
        args.firstMinutes = parseNumber(argv[++i]);
        break;
      case '--refusal-attempts':
        args.refusalAttempts = parseNumber(argv[++i]);
        break;
      case '--refusal-successes':
        args.refusalSuccesses = parseNumber(argv[++i]);
        break;
      case '--validation-attempts':
        args.validationAttempts = parseNumber(argv[++i]);
        break;
      case '--completed-quests':
      case '--completed':
        args.completedQuests = parseNumber(argv[++i]);
        break;
      case '--debug':
        if (argv[i + 1] && !argv[i + 1].startsWith('-')) {
          const next = argv[++i].toLowerCase();
          args.debug = ['true', '1', 'yes', 'on'].includes(next) ? true : ['false', '0', 'no', 'off'].includes(next) ? false : null;
        } else {
          args.debug = true;
        }
        break;
      case '--debug=false':
      case '--no-debug':
        args.debug = false;
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  return args;
}

export function updateKpiMetrics(options: UpdateKpiOptions): void {
  const {
    cwd = path.resolve(__dirname, '..', '..'),
    game = 'demo',
    pathOverride = null,
    firstActiveQuestMs = null,
    refusalAttempts = null,
    refusalSuccesses = null,
    validationAttempts = null,
    completedQuests = null,
    debugEnabled = null,
  } = options;

  const gameRoot = pathOverride ? path.resolve(cwd, pathOverride) : path.resolve(cwd, 'games', game);
  const telemetryDir = path.join(gameRoot, 'telemetry');
  const kpiPath = path.join(telemetryDir, 'kpi.json');

  let data: Record<string, unknown> = {};
  if (fs.existsSync(kpiPath)) {
    const raw = fs.readFileSync(kpiPath, 'utf8');
    if (raw.trim()) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        throw new Error(`Failed to parse existing KPI file (${kpiPath}): ${(err as Error).message}`);
      }
    }
  }

  if (firstActiveQuestMs !== null) {
    data.firstActiveQuestMs = firstActiveQuestMs;
  }
  if (refusalAttempts !== null) {
    data.refusalAttempts = refusalAttempts;
  }
  if (refusalSuccesses !== null) {
    data.refusalSuccesses = refusalSuccesses;
  }
  if (validationAttempts !== null) {
    data.validationAttempts = validationAttempts;
  }
  if (completedQuests !== null) {
    data.completedQuests = completedQuests;
  }
  if (debugEnabled !== null) {
    data.debugEnabled = debugEnabled;
  }

  fs.mkdirSync(telemetryDir, { recursive: true });
  fs.writeFileSync(kpiPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

  console.log(`[KPI] Updated ${kpiPath}`);
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    if (
      args.firstMs === null &&
      args.firstMinutes === null &&
      args.refusalAttempts === null &&
      args.refusalSuccesses === null &&
      args.validationAttempts === null &&
      args.completedQuests === null &&
      args.debug === null
    ) {
      throw new Error('Provide at least one KPI flag (see --help in README).');
    }

    const minutesValue =
      args.firstMinutes !== null && Number.isFinite(args.firstMinutes)
        ? Math.max(0, Math.round((args.firstMinutes as number) * 60000))
        : null;
    const firstMsValue =
      args.firstMs !== null && Number.isFinite(args.firstMs)
        ? Math.max(0, args.firstMs as number)
        : minutesValue;

    updateKpiMetrics({
      game: args.game,
      pathOverride: args.targetPath,
      firstActiveQuestMs: firstMsValue,
      refusalAttempts: args.refusalAttempts ?? undefined,
      refusalSuccesses: args.refusalSuccesses ?? undefined,
      validationAttempts: args.validationAttempts ?? undefined,
      completedQuests: args.completedQuests ?? undefined,
      debugEnabled: args.debug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[KPI][ERROR]', message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
