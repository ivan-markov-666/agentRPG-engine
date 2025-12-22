#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { checkRequiredFiles } = require('./checks/files');
const { checkCapabilities } = require('./checks/capabilities');
const { checkOrphans } = require('./checks/orphans');
const { checkQuests } = require('./checks/quests');
const { checkSchemas } = require('./checks/schema');
const { reportConsole } = require('./reporters/console');
const { reportJson } = require('./reporters/json');
const { writeLog } = require('./utils/telemetry');

function parseArgs(argv) {
  const args = { path: null, json: null, debug: false, runId: null, log: null, appendJson: false, strict: false, snapshot: null, summary: false, ignore: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '--path' || a === '-p') && argv[i + 1]) {
      args.path = argv[++i];
    } else if (a === '--json' && argv[i + 1]) {
      args.json = argv[++i];
    } else if (a === '--append') {
      args.appendJson = true;
    } else if (a === '--debug') {
      args.debug = true;
    } else if (a === '--strict') {
      args.strict = true;
    } else if (a === '--run-id' && argv[i + 1]) {
      args.runId = argv[++i];
    } else if (a === '--log' && argv[i + 1]) {
      args.log = argv[++i];
    } else if (a === '--snapshot' && argv[i + 1]) {
      args.snapshot = argv[++i];
    } else if (a === '--summary') {
      args.summary = true;
    } else if (a === '--ignore' && argv[i + 1]) {
      args.ignore = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return args;
}

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.path) {
    console.error('Usage: npx agentrpg-validate --path games/<gameId> [--json out.json] [--append] [--debug] [--strict] [--snapshot prev.json] [--summary] [--ignore CODE1,CODE2]');
    process.exit(1);
  }
  const startTime = Date.now();
  const base = path.resolve(args.path);
  const issues = [];
  const context = { base, loadJson, issues };

  await checkRequiredFiles(context);
  await checkSchemas(context);
  await checkCapabilities(context);
  await checkOrphans(context);
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
      console.error('[WARN][SNAPSHOT]', e.message);
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
      console.error('[WARN][LOG]', e.message);
    }
  }
  process.exit(hasError ? 1 : 0);
}

main().catch((err) => {
  console.error('[ERROR][CLI] fatal', err.message);
  process.exit(1);
});
