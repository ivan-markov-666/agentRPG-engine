const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

function createHistoryEntries() {
  const now = Date.now();
  return [
    {
      run_id: 'test-run-1',
      timestamp: new Date(now - 60000).toISOString(),
      duration_ms: 140,
      errors: 0,
      warnings: 0,
      issues: [],
    },
    {
      run_id: 'test-run-2',
      timestamp: new Date(now - 30000).toISOString(),
      duration_ms: 210,
      errors: 0,
      warnings: 2,
      issues: [
        { level: 'WARN', code: 'QUEST-AREA-BACKLINK', file: 'scenario/quests/demo.md', message: 'missing link', fix: 'add [[quest]]' },
      ],
    },
  ];
}

(function runTests() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'metrics-report-test-'));
  const historyPath = path.join(tmp, 'history.json');
  const summaryPath = path.join(tmp, 'summary.md');
  const insightsPath = path.join(tmp, 'insights.md');
  const archiveDir = path.join(tmp, 'archive');

  fs.writeFileSync(historyPath, JSON.stringify(createHistoryEntries(), null, 2), 'utf8');
  fs.writeFileSync(summaryPath, '# old summary\n', 'utf8');

  const scriptPath = path.join(__dirname, '..', 'metrics', 'report.js');
  const result = spawnSync(
    'node',
    [
      scriptPath,
      '--history',
      historyPath,
      '--output',
      summaryPath,
      '--insights',
      insightsPath,
      '--archive-dir',
      archiveDir,
      '--archive-label',
      'ci-test',
    ],
    {
      encoding: 'utf8',
    },
  );
  assert.strictEqual(result.status, 0, `metrics report script failed: ${result.stderr || result.stdout}`);

  const summary = fs.readFileSync(summaryPath, 'utf8');
  assert(summary.includes('# Validator Metrics Summary'), 'Summary header missing');
  assert(summary.includes('## Run история'), 'Summary table missing');
  const archives = fs.readdirSync(archiveDir);
  assert.strictEqual(archives.length, 1, 'Archive dir should contain previous summary copy');
  const archivedContents = fs.readFileSync(path.join(archiveDir, archives[0]), 'utf8');
  assert(archivedContents.includes('# old summary'), 'Archived summary should preserve previous contents');

  const insights = fs.readFileSync(insightsPath, 'utf8');
  assert(insights.includes('Validator Metrics Insights'), 'Insights header missing');
  assert(insights.includes('## KPI Trends'), 'Insights KPI section missing');
  assert(/\| Avg runtime/.test(insights), 'Insights KPI table should list Avg runtime row');
  assert(insights.includes('## Alerts'), 'Insights alerts section missing');

  const drySummaryPath = path.join(tmp, 'dry-summary.md');
  const dryInsightsPath = path.join(tmp, 'dry-insights.md');
  const dryRunResult = spawnSync(
    'node',
    [
      scriptPath,
      '--history',
      historyPath,
      '--output',
      drySummaryPath,
      '--insights',
      dryInsightsPath,
      '--dry-run',
    ],
    { encoding: 'utf8' },
  );
  assert.strictEqual(dryRunResult.status, 0, `metrics report dry run failed: ${dryRunResult.stderr || dryRunResult.stdout}`);
  assert.strictEqual(fs.existsSync(drySummaryPath), false, 'Dry run should not write summary');
  assert.strictEqual(fs.existsSync(dryInsightsPath), false, 'Dry run should not write insights');

  console.log('metrics-report tests passed.');
})();
