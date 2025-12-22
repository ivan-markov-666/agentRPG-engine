const fs = require('fs');

function reportJson(issues, outPath, opts = {}) {
  const errors = issues.filter((i) => i.level === 'ERROR').length;
  const warnings = issues.filter((i) => i.level === 'WARN').length;
  const byCode = issues.reduce((acc, i) => {
    acc[i.code] = (acc[i.code] || 0) + 1;
    return acc;
  }, {});
  const data = {
    errors,
    warnings,
    cap_errors: issues.filter((i) => i.code && i.code.startsWith('CAP-')).length,
    top_codes: Object.entries(byCode)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code, count]) => ({ code, count })),
    issues,
  };
  if (opts.append && fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      if (Array.isArray(existing)) {
        existing.push(data);
        fs.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf8');
        return;
      }
    } catch (e) {
      // fall back to overwrite
    }
  }
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { reportJson };
