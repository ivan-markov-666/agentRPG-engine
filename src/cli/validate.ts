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
import type { Issue } from '../validator/types';

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
}

const ARCHIVE_SCRIPT = path.resolve(__dirname, '..', '..', 'tools', 'archive-telemetry.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const { archiveTelemetry } = require(ARCHIVE_SCRIPT);

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

async function runChecks(base: string, issues: Issue[]) {
  const context = { base, loadJson, issues };
  await checkRequiredFiles(context);
  await checkSchemas(context);
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
    try {
      writeLog({
        runId: args.runId,
        logPath: args.log,
        issues,
        startTime,
      });
    } catch (err) {
      const error = err as Error;
      console.error('[ERROR][LOG]', error.message);
      guardrailViolation = true;
    }

    if (args.autoArchive && Number.isFinite(args.autoArchive)) {
      try {
        const archiveResult = archiveTelemetry({
          label: args.runId || 'auto',
          history: args.log,
          archive: 'docs/analysis/reports/archive',
          min: args.autoArchive,
          cwd: process.cwd(),
        });
        if (!archiveResult.skipped) {
          console.log(
            `[AUTO-ARCHIVE] Archived ${archiveResult.count} run(s) to ${archiveResult.archivePath}`,
          );
        } else {
          console.log(
            `[AUTO-ARCHIVE][SKIP] History size below ${args.autoArchive} run threshold.`,
          );
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
