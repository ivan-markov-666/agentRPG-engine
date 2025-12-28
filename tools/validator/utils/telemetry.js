const fs = require('fs');
const path = require('path');

function writeLog(runId, logPath, issues, startTime) {
  const durationMs = Date.now() - startTime;
  const errors = issues.filter((i) => i.level === 'ERROR').length;
  const warnings = issues.filter((i) => i.level === 'WARN').length;
  const payload = {
    runId: runId || `${Date.now()}`,
    run_id: runId || `${Date.now()}`,
    timestamp: new Date().toISOString(),
    duration_ms: durationMs,
    errors,
    warnings,
    issues,
  };
  const outPath = path.resolve(logPath);
  let existing = null;
  if (fs.existsSync(outPath)) {
    try {
      const raw = fs.readFileSync(outPath, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {
      existing = null; // fall back to overwrite
    }
  }
  if (Array.isArray(existing)) {
    existing.push(payload);
    fs.writeFileSync(outPath, JSON.stringify(existing, null, 2), 'utf8');
  } else {
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
  }
}

module.exports = { writeLog };
