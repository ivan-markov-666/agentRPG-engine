#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { checkRequiredFiles } = require('./checks/files');
const { checkCapabilities } = require('./checks/capabilities');
const { checkOrphans } = require('./checks/orphans');
const { checkAreas } = require('./checks/areas');
const { checkQuests } = require('./checks/quests');
const { checkSchemas } = require('./checks/schema');
const { reportConsole } = require('./reporters/console');
const { reportJson } = require('./reporters/json');
const { writeLog } = require('./utils/telemetry');

function parseArgs(argv) {
  const args = { path: null, json: null, debug: false, runId: null, log: null, appendJson: false, strict: false, snapshot: null, summary: false, ignore: [] };
  const valueFlags = new Set(['--path', '-p', '--json', '--run-id', '--log', '--snapshot', '--ignore']);

  for (let i = 2; i < argv.length; i++) {
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
        args.ignore = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
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

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    console.error(`[ERROR][ARGS] ${err.message}`);
    process.exit(1);
  }
  if (!args.path) {
    console.error('Usage: npx agentrpg-validate --path games/<gameId> [--json out.json] [--append] [--debug] [--strict] [--snapshot prev.json] [--summary] [--ignore CODE1,CODE2]');
    process.exit(1);
  }
  const startTime = Date.now();
  const base = path.resolve(args.path);
  const issues = [];
  const context = { base, loadJson, issues };
  let guardrailViolation = false;

  await checkRequiredFiles(context);
  await checkSchemas(context);
  await checkCapabilities(context);
  await checkOrphans(context);
  await checkAreas(context);
  await checkQuests(context);

  if (args.strict) {
    issues.forEach((i) => {
      if (i.level === 'WARN') i.level = 'ERROR';
    });
  }

  if (args.ignore && args.ignore.length) {
    const ignoreSet = new Set(args.ignore);
    for (let i = issues.length - 1; i >= 0; i--) {
      if (ignoreSet.has(issues[i].code)) {
        issues.splice(i, 1);
      }
    }
  }

  if (args.snapshot) {
    try {
      const snapRaw = fs.readFileSync(path.resolve(args.snapshot), 'utf8');
      const snapJson = JSON.parse(snapRaw);
      const latest = Array.isArray(snapJson) ? snapJson[snapJson.length - 1] : snapJson;
      if (latest && latest.issues) {
        const prevByCode = latest.issues.reduce((acc, i) => {
          acc[i.code] = (acc[i.code] || 0) + 1;
          return acc;
        }, {});
        const currByCode = issues.reduce((acc, i) => {
          acc[i.code] = (acc[i.code] || 0) + 1;
          return acc;
        }, {});
        const newCodes = Object.keys(currByCode).filter((c) => !prevByCode[c]);
        const resolvedCodes = Object.keys(prevByCode).filter((c) => !currByCode[c]);
        console.log(`[INFO][SNAPSHOT] New codes: ${newCodes.join(', ') || 'none'} | Resolved: ${resolvedCodes.join(', ') || 'none'}`);
      }
    } catch (e) {
      console.error('[ERROR][SNAPSHOT]', e.message);
      guardrailViolation = true;
    }
  }

  reportConsole(issues, { debug: args.debug, summaryOnly: args.summary });
  if (args.json) {
    reportJson(issues, args.json, { append: args.appendJson });
  }
  const hasError = issues.some((i) => i.level === 'ERROR');
  if (args.log) {
    try {
      writeLog(args.runId, args.log, issues, startTime);
    } catch (e) {
      console.error('[ERROR][LOG]', e.message);
      guardrailViolation = true;
    }
  }
  process.exit(hasError || guardrailViolation ? 1 : 0);
}

main().catch((err) => {
  console.error('[ERROR][CLI] fatal', err.message);
  process.exit(1);
});
