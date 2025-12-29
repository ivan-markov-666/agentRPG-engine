import type { Issue, ConsoleReportOptions } from '../types';

function formatIssue(issue: Issue): string {
  const { level, code, file, message, fix } = issue;
  const location = file ? `${file}: ` : '';
  const base = `[${level}][${code}] ${location}${message ?? ''}`.trim();
  return fix ? `${base} (${fix})` : base;
}

export function reportConsole(issues: Issue[], opts: ConsoleReportOptions = {}): void {
  const debug = !!opts.debug;
  const summaryOnly = !!opts.summaryOnly;
  const levels: Issue['level'][] = debug ? ['INFO', 'WARN', 'ERROR'] : ['WARN', 'ERROR'];

  if (!summaryOnly) {
    issues
      .filter((issue) => levels.includes(issue.level))
      .forEach((issue) => {
        console.log(formatIssue(issue));
      });
  }

  const errors = issues.filter((issue) => issue.level === 'ERROR').length;
  const warnings = issues.filter((issue) => issue.level === 'WARN').length;
  const byCode = issues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue.code] = (acc[issue.code] || 0) + 1;
    return acc;
  }, {});
  const capErrors = issues.filter(
    (issue) => issue.level === 'ERROR' && issue.code && issue.code.startsWith('CAP-'),
  ).length;

  const topCodes = Object.entries(byCode)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code, count]) => `${code}:${count}`)
    .join(', ');

  const summaryParts = [`Summary: ${errors} error(s), ${warnings} warning(s)`];
  if (topCodes) {
    summaryParts.push(`Top: ${topCodes}`);
  }
  console.log(summaryParts.join(' | '));

  if (capErrors > 0) {
    console.log(`CAP errors: ${capErrors}`);
  }
}

export default reportConsole;
