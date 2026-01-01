import fs from 'fs';
import path from 'path';

import { reportConsole } from '../validator/reporters/console';
import { reportJson } from '../validator/reporters/json';
import { writeLog } from '../validator/utils/telemetry';
import { checkRequiredFiles } from '../validator/checks/files';
import { checkCapabilities } from '../validator/checks/capabilities';
import { checkOrphans } from '../validator/checks/orphans';
import { checkAreas } from '../validator/checks/areas';
import { checkQuests } from '../validator/checks/quests';
import { checkSchemas } from '../validator/checks/schema';
import { checkRuntimeContracts } from '../validator/checks/runtime-contracts';
import type { Issue } from '../validator/types';
import type { TelemetryKpiMetrics } from '../types/telemetry';

interface CliArgs {
  path: string | null;
  json: string | null;
  debug: boolean;
  runId: string | null;
  log: string | null;
  appendJson: boolean;
  strict: boolean;
  snapshot: string | null;
  summary: boolean;
  ignore: string[];
  autoArchive: number | null;
  kpiPath: string | null;
}

const ARCHIVE_SCRIPT = path.resolve(__dirname, '..', '..', 'dist', 'tools', 'archive-telemetry.js');
interface ArchiveTelemetryResult {
  skipped: boolean;
  count?: number;
  archivePath?: string;
  historyPath?: string;
}
type ArchiveTelemetryFn = (options?: Record<string, unknown>) => ArchiveTelemetryResult;
let archiveTelemetry: ArchiveTelemetryFn | null = null;

function loadArchiveTelemetry(): ArchiveTelemetryFn | null {
  if (archiveTelemetry) return archiveTelemetry;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const moduleExports = require(ARCHIVE_SCRIPT);
    if (moduleExports && typeof moduleExports.archiveTelemetry === 'function') {
      archiveTelemetry = moduleExports.archiveTelemetry as ArchiveTelemetryFn;
      return archiveTelemetry;
    }
  } catch {
    // No-op: dist script not available (e.g., dev-mode)
  }
  return null;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    path: null,
    json: null,
    debug: false,
    runId: null,
    log: null,
    appendJson: false,
    strict: false,
    snapshot: null,
    summary: false,
    ignore: [],
    autoArchive: null,
    kpiPath: null,
  };

  const valueFlags = new Set([
    '--path',
    '-p',
    '--json',
    '--run-id',
    '--log',
    '--snapshot',
    '--ignore',
    '--auto-archive',
    '--kpi',
  ]);

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
      case '--json':
        args.json = argv[++i];
        break;
      case '--append':
        args.appendJson = true;
        break;
      case '--debug':
        args.debug = true;
        break;
      case '--strict':
        args.strict = true;
        break;
      case '--run-id':
        args.runId = argv[++i];
        break;
      case '--log':
        args.log = argv[++i];
        break;
      case '--snapshot':
        args.snapshot = argv[++i];
        break;
      case '--summary':
        args.summary = true;
        break;
      case '--ignore':
        args.ignore = argv[++i]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case '--auto-archive':
        args.autoArchive = Number(argv[++i]);
        break;
      case '--kpi':
        args.kpiPath = argv[++i];
        break;
      default:
        if (flag.startsWith('-')) {
          throw new Error(`Unknown flag: ${flag}`);
        } else {
          throw new Error(`Unexpected argument: ${flag}`);
        }
    }
  }

  return args;
}

function loadJson(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function requireSnapshot(filePath: string) {
  const snapRaw = fs.readFileSync(path.resolve(filePath), 'utf8');
  return JSON.parse(snapRaw);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

function parseBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return null;
}

function loadKpiMetricsFromFile(filePath: string | null | undefined): TelemetryKpiMetrics | null {
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.warn(`[WARN][KPI] KPI file not found: ${filePath}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(resolved, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
      console.warn('[WARN][KPI] KPI file must contain an object with numeric fields.');
      return null;
    }

    const metrics: TelemetryKpiMetrics = {};
    const firstQuest = parseNumber((data as Record<string, unknown>).firstActiveQuestMs ?? (data as Record<string, unknown>).first_active_quest_ms);
    if (firstQuest !== null) metrics.firstActiveQuestMs = firstQuest;
    const refusalAttempts = parseNumber((data as Record<string, unknown>).refusalAttempts ?? (data as Record<string, unknown>).refusal_attempts);
    if (refusalAttempts !== null) metrics.refusalAttempts = refusalAttempts;
    const refusalSuccesses = parseNumber((data as Record<string, unknown>).refusalSuccesses ?? (data as Record<string, unknown>).refusal_successes);
    if (refusalSuccesses !== null) metrics.refusalSuccesses = refusalSuccesses;
    const validationAttempts = parseNumber((data as Record<string, unknown>).validationAttempts ?? (data as Record<string, unknown>).validation_attempts);
    if (validationAttempts !== null) metrics.validationAttempts = validationAttempts;
    const completedQuests = parseNumber((data as Record<string, unknown>).completedQuests ?? (data as Record<string, unknown>).completed_quests);
    if (completedQuests !== null) metrics.completedQuests = completedQuests;
    const debugEnabled = parseBoolean((data as Record<string, unknown>).debugEnabled ?? (data as Record<string, unknown>).debug_enabled);
    if (debugEnabled !== null) metrics.debugEnabled = debugEnabled;

    return Object.keys(metrics).length ? metrics : null;
  } catch (err) {
    const error = err as Error;
    console.warn(`[WARN][KPI] Failed to parse KPI file (${filePath}): ${error.message}`);
    return null;
  }
}

async function runChecks(base: string, issues: Issue[]) {
  const context = { base, loadJson, issues };
  await checkRequiredFiles(context);
  await checkSchemas(context);
  await checkRuntimeContracts(context);
  await checkCapabilities(context);
  await checkOrphans(context);
  await checkAreas(context);
  await checkQuests(context);
}

async function main() {
  let args: CliArgs;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    const error = err as Error;
    console.error(`[ERROR][ARGS] ${error.message}`);
    process.exit(1);
    return;
  }

  if (!args.path) {
    console.error(
      'Usage: npm run validate -- --path games/<gameId> --run-id <id> [--json out.json] [--append] [--debug] [--strict] [--snapshot prev.json] [--summary] [--ignore CODE1,CODE2] [--auto-archive N]',
    );
    process.exit(1);
  }
  if (!args.runId || !args.runId.trim()) {
    console.error(
      '[ERROR][RUN-ID] Missing required --run-id <value>. Generate one via tools/scripts/run-id.(ps1|sh).',
    );
    process.exit(1);
  }

  const base = path.resolve(args.path);
  const startTime = Date.now();
  const issues: Issue[] = [];
  let guardrailViolation = false;

  await runChecks(base, issues);

  if (args.strict) {
    issues.forEach((issue) => {
      if (issue.level === 'WARN') {
        // eslint-disable-next-line no-param-reassign
        issue.level = 'ERROR';
      }
    });
  }

  if (args.ignore.length) {
    const ignoreSet = new Set(args.ignore);
    for (let i = issues.length - 1; i >= 0; i -= 1) {
      if (ignoreSet.has(issues[i].code)) {
        issues.splice(i, 1);
      }
    }
  }

  if (args.snapshot) {
    try {
      const snapshot = requireSnapshot(args.snapshot);
      const latest = Array.isArray(snapshot) ? snapshot[snapshot.length - 1] : snapshot;
      if (latest && latest.issues) {
        const prevByCode: Record<string, number> = latest.issues.reduce(
          (acc: Record<string, number>, issue: Issue) => {
            acc[issue.code] = (acc[issue.code] || 0) + 1;
            return acc;
          },
          {},
        );
        const currByCode: Record<string, number> = issues.reduce(
          (acc: Record<string, number>, issue: Issue) => {
            acc[issue.code] = (acc[issue.code] || 0) + 1;
            return acc;
          },
          {},
        );
        const newCodes = Object.keys(currByCode).filter((code) => !prevByCode[code]);
        const resolvedCodes = Object.keys(prevByCode).filter((code) => !currByCode[code]);
        console.log(
          `[INFO][SNAPSHOT] New codes: ${newCodes.join(', ') || 'none'} | Resolved: ${
            resolvedCodes.join(', ') || 'none'
          }`,
        );
      }
    } catch (err) {
      const error = err as Error;
      console.error('[ERROR][SNAPSHOT]', error.message);
      guardrailViolation = true;
    }
  }

  reportConsole(issues, { debug: args.debug, summaryOnly: args.summary });

  if (args.json) {
    reportJson(issues, args.json, { append: args.appendJson });
  }

  const hasError = issues.some((issue) => issue.level === 'ERROR');

  if (args.log) {
    const telemetryMetrics = loadKpiMetricsFromFile(args.kpiPath);
    try {
      writeLog({
        runId: args.runId,
        logPath: args.log,
        issues,
        startTime,
        metrics: telemetryMetrics || undefined,
      });
    } catch (err) {
      const error = err as Error;
      console.error('[ERROR][LOG]', error.message);
      guardrailViolation = true;
    }

    if (args.autoArchive && Number.isFinite(args.autoArchive)) {
      try {
        const archiveFn = loadArchiveTelemetry();
        if (!archiveFn) {
          console.log('[AUTO-ARCHIVE][SKIP] Archive helper not available in dev mode.');
        } else {
          const archiveResult = archiveFn({
            label: args.runId || 'auto',
            history: args.log,
            archive: 'docs/analysis/reports/archive',
            min: args.autoArchive,
            cwd: process.cwd(),
          });
          if (!archiveResult.skipped) {
            console.log(
              `[AUTO-ARCHIVE] Archived ${archiveResult.count || 0} run(s) to ${archiveResult.archivePath || ''}`,
            );
          } else {
            console.log(
              `[AUTO-ARCHIVE][SKIP] History size below ${args.autoArchive} run threshold.`,
            );
          }
        }
      } catch (err) {
        const error = err as Error;
        console.error('[ERROR][AUTO-ARCHIVE]', error.message);
        guardrailViolation = true;
      }
    }
  }

  process.exit(hasError || guardrailViolation ? 1 : 0);
}

main().catch((err: Error) => {
  console.error('[ERROR][CLI] fatal', err.message);
  process.exit(1);
});
