"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.loadData = loadData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function pushIssue(issues, partial) {
    if (!issues)
        return;
    issues.push({
        code: partial.code,
        level: partial.level,
        file: partial.file,
        message: partial.message,
        fix: partial.fix,
    });
}
function add(issues, level, code, file, message, fix) {
    pushIssue(issues, { level, code, file, message, fix });
}
function loadData(filePath, issues) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    let raw;
    try {
        raw = fs_1.default.readFileSync(filePath, 'utf8');
    }
    catch (error) {
        const err = error;
        add(issues, 'ERROR', 'FILE-READ', filePath, 'Cannot read file', err.message || err.code);
        return null;
    }
    if (ext === '.yaml' || ext === '.yml') {
        try {
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const yaml = require('yaml');
            return yaml.parse(raw);
        }
        catch (error) {
            const err = error;
            if (err && err.message && err.message.includes('MODULE_NOT_FOUND')) {
                add(issues, 'WARN', 'YAML-NOT-AVAILABLE', filePath, 'YAML parser not installed; skipping YAML parse', 'Install yaml npm package or convert file to JSON');
            }
            else {
                add(issues, 'ERROR', 'YAML-PARSE', filePath, 'Invalid YAML', err.message);
            }
            return null;
        }
    }
    try {
        return JSON.parse(raw);
    }
    catch (error) {
        const err = error;
        add(issues, 'ERROR', 'JSON-PARSE', filePath, 'Invalid JSON', err.message);
        return null;
    }
}
//# sourceMappingURL=io.js.map