import fs from 'fs';

import type { Issue, JsonReportOptions } from '../types';

interface JsonReport {
  errors: number;
  warnings: number;
  cap_errors: number;
  top_codes: { code: string; count: number }[];
  issues: Issue[];
}

function buildReport(issues: Issue[]): JsonReport {
  const errors = issues.filter((issue) => issue.level === 'ERROR').length;
  const warnings = issues.filter((issue) => issue.level === 'WARN').length;
  const capErrors = issues.filter(
    (issue) => issue.code && issue.code.startsWith('CAP-'),
  ).length;
  const byCode = issues.reduce<Record<string, number>>((acc, issue) => {
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

export function reportJson(
  issues: Issue[],
  outPath: string,
  opts: JsonReportOptions = {},
): void {
  const report = buildReport(issues);
  const resolvedPath = outPath;

  if (opts.append && fs.existsSync(resolvedPath)) {
    try {
      const raw = fs.readFileSync(resolvedPath, 'utf8');
      const existing = JSON.parse(raw);
      if (Array.isArray(existing)) {
        existing.push(report);
        fs.writeFileSync(resolvedPath, JSON.stringify(existing, null, 2), 'utf8');
        return;
      }
    } catch {
      // fall through to overwrite
    }
  }

  fs.writeFileSync(resolvedPath, JSON.stringify(report, null, 2), 'utf8');
}

export default reportJson;
