#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { history: null, out: null, limit: null };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--history':
      case '-h':
        if (next) args.history = next;
        break;
      case '--out':
      case '-o':
        if (next) args.out = next;
        break;
      case '--limit':
      case '-l':
        if (next) args.limit = Number(next);
        break;
      default:
        break;
    }
  }
  return args;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function formatNotes(run, maxCodes = 3) {
  if (!Array.isArray(run.issues) || run.issues.length === 0) return 'clean';
  const codes = [];
  run.issues.forEach((issue) => {
    if (issue && issue.code && !codes.includes(issue.code)) codes.push(issue.code);
  });
  const slice = codes.slice(0, maxCodes).join(', ');
  const extra = codes.length > maxCodes ? ` +${codes.length - maxCodes}` : '';
  return slice ? `${slice}${extra}` : 'n/a';
}

function computeRetries(runs) {
  const retries = [];
  let attempts = 0;
  runs.forEach((run) => {
    const isClean = run.errors === 0 && run.warnings === 0;
    if (isClean) {
      if (attempts > 0) {
        retries.push(attempts);
        attempts = 0;
      } else {
        retries.push(0);
      }
    } else {
      attempts += 1;
    }
  });
  const avg = retries.length ? average(retries) : 0;
  return { avgRetries: avg, retriesSamples: retries.length };
}

function main() {
  const args = parseArgs(process.argv);
  const historyPath = path.resolve(
    args.history || path.join(__dirname, '..', '..', 'docs', 'analysis', 'reports', 'telemetry-history.json')
  );
  const outPath = path.resolve(
    args.out || path.join(__dirname, '..', '..', 'docs', 'analysis', 'metrics-summary.md')
  );

  if (!fs.existsSync(historyPath)) {
    console.error(`[metrics] History file not found: ${historyPath}`);
    process.exit(1);
  }

  let historyRaw;
  try {
    historyRaw = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch (e) {
    console.error('[metrics] Failed to parse telemetry history:', e.message);
    process.exit(1);
  }

  const history = Array.isArray(historyRaw) ? historyRaw : [historyRaw];
  if (!history.length) {
    console.error('[metrics] History is empty.');
    process.exit(1);
  }

  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const limit = Number.isFinite(args.limit) && args.limit > 0 ? args.limit : sorted.length;
  const recentRuns = sorted.slice(-limit);

  const avgDuration = average(recentRuns.map((r) => r.duration_ms || 0));
  const avgWarnings = average(recentRuns.map((r) => r.warnings || 0));
  const cleanRuns = recentRuns.filter((r) => (r.errors || 0) === 0 && (r.warnings || 0) === 0).length;
  const topCodes = recentRuns.reduce((acc, run) => {
    (run.issues || []).forEach((issue) => {
      if (!issue || !issue.code) return;
      acc[issue.code] = (acc[issue.code] || 0) + 1;
    });
    return acc;
  }, {});

  const topCodesList = Object.entries(topCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, count]) => `${code}:${count}`)
    .join(', ');

  const { avgRetries, retriesSamples } = computeRetries(sorted);
  const generatedAt = new Date();
  const bgDate = generatedAt.toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' });

  const tableRows = recentRuns
    .map(
      (run) =>
        `| ${run.run_id} | ${run.timestamp} | ${run.duration_ms ?? 'n/a'} | ${run.errors ?? 0} | ${run.warnings ?? 0} | ${formatNotes(run)} |`
    )
    .join('\n');

  const md = `# Validator Metrics Summary — ${bgDate}\n\n` +
    `_Generated: ${generatedAt.toISOString()} via tools/metrics/report.js_\n\n` +
    `## Run история\n` +
    `| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |\n` +
    `|--------|-----------|---------------|--------|----------|---------|\n` +
    `${tableRows}\n\n` +
    `## Аггрегирани показатели\n` +
    `- Средно време за run: **${avgDuration.toFixed(1)} ms** (на база ${recentRuns.length} run-а)\n` +
    `- Среден брой предупреждения: **${avgWarnings.toFixed(2)}**\n` +
    `- Clean run ratio: **${cleanRuns}/${recentRuns.length}**\n` +
    `- Avg retries до зелен статус: **${avgRetries.toFixed(2)}** (по ${retriesSamples} clean run-а)\n` +
    `- Top codes: ${topCodesList || 'n/a'}\n\n` +
    `## Препоръки\n` +
    `1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot \`New codes = none\`.\n` +
    `2. Инсталирай schema dependencies (Ajv + ajv-formats) в нови среди, за да липсват \`SCHEMA\` предупреждения.\n` +
    `3. Архивирай telemetry история при ≥50 run-а или преди release (\`npm run archive:telemetry -- --label <tag>\`).\n`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md, 'utf8');
  console.log(`[metrics] Summary written to ${outPath}`);
}

main();
