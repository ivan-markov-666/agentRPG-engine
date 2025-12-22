function formatIssue(issue) {
  const { level, code, file, message, fix } = issue;
  const base = `[${level}][${code}] ${file}: ${message}`;
  return fix ? `${base} (${fix})` : base;
}

function reportConsole(issues, opts = {}) {
  const debug = !!opts.debug;
  const summaryOnly = !!opts.summaryOnly;
  const levels = debug ? ['INFO', 'WARN', 'ERROR'] : ['WARN', 'ERROR'];
  if (!summaryOnly) {
    issues
      .filter((i) => levels.includes(i.level))
      .forEach((i) => console.log(formatIssue(i)));
  }
  const errors = issues.filter((i) => i.level === 'ERROR').length;
  const warns = issues.filter((i) => i.level === 'WARN').length;
  const byCode = issues.reduce((acc, i) => {
    acc[i.code] = (acc[i.code] || 0) + 1;
    return acc;
  }, {});
  const capErrors = issues.filter((i) => i.code && i.code.startsWith('CAP-') && i.level === 'ERROR').length;
  const topCodes = Object.entries(byCode)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([code, count]) => `${code}:${count}`)
    .join(', ');
  console.log(`Summary: ${errors} error(s), ${warns} warning(s)${topCodes ? ` | Top: ${topCodes}` : ''}`);
  if (capErrors > 0) {
    console.log(`CAP errors: ${capErrors}`);
  }
}

module.exports = { reportConsole };
