"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const console_1 = require("../validator/reporters/console");
const json_1 = require("../validator/reporters/json");
const telemetry_1 = require("../validator/utils/telemetry");
const files_1 = require("../validator/checks/files");
const capabilities_1 = require("../validator/checks/capabilities");
const orphans_1 = require("../validator/checks/orphans");
const areas_1 = require("../validator/checks/areas");
const quests_1 = require("../validator/checks/quests");
const schema_1 = require("../validator/checks/schema");
const ARCHIVE_SCRIPT = path_1.default.resolve(__dirname, '..', '..', 'tools', 'archive-telemetry.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const { archiveTelemetry } = require(ARCHIVE_SCRIPT);
function parseArgs(argv) {
    const args = {
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
                }
                else {
                    throw new Error(`Unexpected argument: ${flag}`);
                }
        }
    }
    return args;
}
function loadJson(filePath) {
    const raw = fs_1.default.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}
function requireSnapshot(filePath) {
    const snapRaw = fs_1.default.readFileSync(path_1.default.resolve(filePath), 'utf8');
    return JSON.parse(snapRaw);
}
async function runChecks(base, issues) {
    const context = { base, loadJson, issues };
    await (0, files_1.checkRequiredFiles)(context);
    await (0, schema_1.checkSchemas)(context);
    await (0, capabilities_1.checkCapabilities)(context);
    await (0, orphans_1.checkOrphans)(context);
    await (0, areas_1.checkAreas)(context);
    await (0, quests_1.checkQuests)(context);
}
async function main() {
    let args;
    try {
        args = parseArgs(process.argv);
    }
    catch (err) {
        const error = err;
        console.error(`[ERROR][ARGS] ${error.message}`);
        process.exit(1);
        return;
    }
    if (!args.path) {
        console.error('Usage: npm run validate -- --path games/<gameId> --run-id <id> [--json out.json] [--append] [--debug] [--strict] [--snapshot prev.json] [--summary] [--ignore CODE1,CODE2] [--auto-archive N]');
        process.exit(1);
    }
    if (!args.runId || !args.runId.trim()) {
        console.error('[ERROR][RUN-ID] Missing required --run-id <value>. Generate one via tools/scripts/run-id.(ps1|sh).');
        process.exit(1);
    }
    const base = path_1.default.resolve(args.path);
    const startTime = Date.now();
    const issues = [];
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
                const prevByCode = latest.issues.reduce((acc, issue) => {
                    acc[issue.code] = (acc[issue.code] || 0) + 1;
                    return acc;
                }, {});
                const currByCode = issues.reduce((acc, issue) => {
                    acc[issue.code] = (acc[issue.code] || 0) + 1;
                    return acc;
                }, {});
                const newCodes = Object.keys(currByCode).filter((code) => !prevByCode[code]);
                const resolvedCodes = Object.keys(prevByCode).filter((code) => !currByCode[code]);
                console.log(`[INFO][SNAPSHOT] New codes: ${newCodes.join(', ') || 'none'} | Resolved: ${resolvedCodes.join(', ') || 'none'}`);
            }
        }
        catch (err) {
            const error = err;
            console.error('[ERROR][SNAPSHOT]', error.message);
            guardrailViolation = true;
        }
    }
    (0, console_1.reportConsole)(issues, { debug: args.debug, summaryOnly: args.summary });
    if (args.json) {
        (0, json_1.reportJson)(issues, args.json, { append: args.appendJson });
    }
    const hasError = issues.some((issue) => issue.level === 'ERROR');
    if (args.log) {
        try {
            (0, telemetry_1.writeLog)({
                runId: args.runId,
                logPath: args.log,
                issues,
                startTime,
            });
        }
        catch (err) {
            const error = err;
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
                    console.log(`[AUTO-ARCHIVE] Archived ${archiveResult.count} run(s) to ${archiveResult.archivePath}`);
                }
                else {
                    console.log(`[AUTO-ARCHIVE][SKIP] History size below ${args.autoArchive} run threshold.`);
                }
            }
            catch (err) {
                const error = err;
                console.error('[ERROR][AUTO-ARCHIVE]', error.message);
                guardrailViolation = true;
            }
        }
    }
    process.exit(hasError || guardrailViolation ? 1 : 0);
}
main().catch((err) => {
    console.error('[ERROR][CLI] fatal', err.message);
    process.exit(1);
});
//# sourceMappingURL=validate.js.map