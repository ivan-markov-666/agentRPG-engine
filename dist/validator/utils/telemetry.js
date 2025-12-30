"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLog = writeLog;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function toTelemetryEntry(options) {
    const durationMs = Date.now() - options.startTime;
    const errors = options.issues.filter((i) => i.level === 'ERROR').length;
    const warnings = options.issues.filter((i) => i.level === 'WARN').length;
    const runId = options.runId && options.runId.trim() ? options.runId : `${Date.now()}`;
    return {
        runId,
        run_id: runId,
        timestamp: new Date().toISOString(),
        duration_ms: durationMs,
        durationMs,
        errors,
        warnings,
        issues: options.issues,
        game: options.gameId || undefined,
    };
}
function readExistingLog(targetPath) {
    try {
        const raw = fs_1.default.readFileSync(targetPath, 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
function writeLog(options) {
    const outPath = path_1.default.resolve(options.logPath);
    const payload = toTelemetryEntry(options);
    let existing = null;
    if (fs_1.default.existsSync(outPath)) {
        existing = readExistingLog(outPath);
    }
    if (Array.isArray(existing)) {
        existing.push(payload);
        fs_1.default.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf8');
    }
    else {
        fs_1.default.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
    }
}
exports.default = writeLog;
//# sourceMappingURL=telemetry.js.map