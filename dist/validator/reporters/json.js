"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportJson = reportJson;
const fs_1 = __importDefault(require("fs"));
function buildReport(issues) {
    const errors = issues.filter((issue) => issue.level === 'ERROR').length;
    const warnings = issues.filter((issue) => issue.level === 'WARN').length;
    const capErrors = issues.filter((issue) => issue.code && issue.code.startsWith('CAP-')).length;
    const byCode = issues.reduce((acc, issue) => {
        acc[issue.code] = (acc[issue.code] || 0) + 1;
        return acc;
    }, {});
    const topCodes = Object.entries(byCode)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code, count]) => ({ code, count }));
    return {
        errors,
        warnings,
        cap_errors: capErrors,
        top_codes: topCodes,
        issues,
    };
}
function reportJson(issues, outPath, opts = {}) {
    const report = buildReport(issues);
    const resolvedPath = outPath;
    if (opts.append && fs_1.default.existsSync(resolvedPath)) {
        try {
            const raw = fs_1.default.readFileSync(resolvedPath, 'utf8');
            const existing = JSON.parse(raw);
            if (Array.isArray(existing)) {
                existing.push(report);
                fs_1.default.writeFileSync(resolvedPath, JSON.stringify(existing, null, 2), 'utf8');
                return;
            }
        }
        catch {
            // fall through to overwrite
        }
    }
    fs_1.default.writeFileSync(resolvedPath, JSON.stringify(report, null, 2), 'utf8');
}
exports.default = reportJson;
//# sourceMappingURL=json.js.map