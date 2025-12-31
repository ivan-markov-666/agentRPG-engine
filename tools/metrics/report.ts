#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  history: string | null;
  out: string | null;
  limit: number | null;
  insights: string | null;
  dryRun: boolean;
  archiveDir: string | null;
  archiveLabel: string | null;
}

interface MetricsIssue {
  code?: string;
  [key: string]: unknown;
}

interface MetricsRun {
  run_id: string;
  timestamp: string;
  duration_ms?: number;
  errors?: number;
  warnings?: number;
  issues?: MetricsIssue[];
  [key: string]: unknown;
}

interface Status {
  emoji: '✅' | '⚠️' | '❌';
  text: string;
}

interface InsightsOptions {
  targetPath: string;
  recentRuns: MetricsRun[];
  avgDuration: number;
  avgWarnings: number;
  cleanRuns: number;
  capHitCount: number;
  topCodesList: string;
}

function isNumberValue(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    history: null,
    out: null,
    limit: null,
    insights: null,
    dryRun: false,
    archiveDir: null,
    archiveLabel: null,
  };
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
      case '--output':
        if (next) args.out = next;
        break;
      case '--limit':
      case '-l':
        if (next && !Number.isNaN(Number(next))) args.limit = Number(next);
        break;
      case '--insights':
      case '-i':
        if (next) args.insights = next;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--archive-dir':
        if (next) args.archiveDir = next;
        break;
      case '--archive-label':
        if (next) args.archiveLabel = next;
        break;
      default:
        break;
    }
  }
  return args;
}

export function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function formatNotes(run: MetricsRun, maxCodes = 3): string {
  if (!Array.isArray(run.issues) || run.issues.length === 0) return 'clean';
  const codes: string[] = [];
  run.issues.forEach((issue) => {
    if (issue && issue.code && !codes.includes(issue.code)) codes.push(issue.code);
  });
  const slice = codes.slice(0, maxCodes).join(', ');
  const extra = codes.length > maxCodes ? ` +${codes.length - maxCodes}` : '';
  return slice ? `${slice}${extra}` : 'n/a';
}

export function computeRetries(runs: MetricsRun[]): { avgRetries: number; retriesSamples: number } {
  const retries: number[] = [];
  let attempts = 0;
  runs.forEach((run) => {
    const errors = run.errors ?? 0;
    const warnings = run.warnings ?? 0;
    const isClean = errors === 0 && warnings === 0;
    if (isClean) {
      retries.push(attempts);
      attempts = 0;
    } else {
      attempts += 1;
    }
  });
  const avg = retries.length ? average(retries) : 0;
  return { avgRetries: avg, retriesSamples: retries.length };
}

export function toStatus(
  value: number,
  warnThreshold: number,
  errorThreshold: number,
  format: (v: number) => string = (v) => String(v),
): Status {
  if (value >= errorThreshold) return { emoji: '❌', text: format(value) };
  if (value >= warnThreshold) return { emoji: '⚠️', text: format(value) };
  return { emoji: '✅', text: format(value) };
}

export function sanitizeLabel(label: string | null | undefined): string | null {
  return label ? label.replace(/[^a-z0-9-_]/gi, '').toLowerCase() : null;
}

export function archiveExistingSummary(targetPath: string, archiveDir: string, label: string | null): string | null {
  if (!fs.existsSync(targetPath)) return null;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeLabel = sanitizeLabel(label);
  const archiveName = safeLabel
    ? `metrics-summary-${timestamp}-${safeLabel}.md`
    : `metrics-summary-${timestamp}.md`;
  const archivePath = path.join(archiveDir, archiveName);
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.copyFileSync(targetPath, archivePath);
  return archivePath;
}

export function writeInsights(options: InsightsOptions): void {
  const { targetPath, recentRuns, avgDuration, avgWarnings, cleanRuns, capHitCount, topCodesList } = options;
  if (!targetPath || !recentRuns.length) return;
  const totalRuns = recentRuns.length;
  const lastRun = recentRuns[totalRuns - 1];
  const generatedAt = new Date();
  const dateLabel = generatedAt.toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' });

  const capPercent = totalRuns ? (capHitCount / totalRuns) * 100 : 0;
  const lastWarnings = lastRun ? (lastRun.warnings || 0) : 0;
  const runtimeStatus = toStatus(avgDuration, 200, 230, (v) => `${v.toFixed(1)} ms`);
  const capStatus = toStatus(capPercent, 5, 15, (v) => `${v.toFixed(1)}%`);
  const warningsStatus = toStatus(avgWarnings, 0.5, 1, (v) => v.toFixed(2));

  let alertsSection = '- ✅ Няма активни прагови аларми.\n';
  if (runtimeStatus.emoji !== '✅' || capStatus.emoji !== '✅' || warningsStatus.emoji !== '✅') {
    const alerts: string[] = [];
    if (runtimeStatus.emoji !== '✅') alerts.push(`${runtimeStatus.emoji} Средното време за run е ${runtimeStatus.text} (праг 200ms).`);
    if (capStatus.emoji !== '✅') alerts.push(`${capStatus.emoji} ${capPercent.toFixed(1)}% от run-овете съдържат CAP-* грешки.`);
    if (warningsStatus.emoji !== '✅') alerts.push(`${warningsStatus.emoji} Средните предупреждения са ${warningsStatus.text} на run.`);
    alertsSection = alerts.map((line) => `- ${line}`).join('\n');
  }

  const recommendedActions = [
    `1. Проверявай top codes (${topCodesList || 'n/a'}) и адресирай повторяемите нарушения.`,
    '2. Архивирай telemetry при ≥50 записи и пази последните clean run-ове за DoD.',
    '3. Увери се, че CAP schema dependencies са актуални (ajv + ajv-formats) в всички среди.',
  ];
  if (capStatus.emoji !== '✅') {
    recommendedActions.unshift('1. Разгледай capabilities конфигурациите и актуализирай нарушаващите CAP-* стойности.');
  } else if (runtimeStatus.emoji !== '✅') {
    recommendedActions.unshift('1. Разгледай последните run-ове за скъпи проверки или I/O и планирай оптимизация.');
  }

  const kpiTable = [
    `| KPI | Стойност | Статус |`,
    `| --- | --- | --- |`,
    `| Avg runtime | ${runtimeStatus.text} | ${runtimeStatus.emoji} |`,
    `| Avg warnings/run | ${warningsStatus.text} | ${warningsStatus.emoji} |`,
    `| CAP alerts ratio | ${capStatus.text} | ${capStatus.emoji} |`,
    `| Clean run ratio | ${cleanRuns}/${totalRuns} | ${cleanRuns === totalRuns ? '✅' : cleanRuns >= totalRuns - 1 ? '⚠️' : '❌'} |`,
    `| Latest warnings | ${lastWarnings} | ${lastWarnings === 0 ? '✅' : '⚠️'} |`,
  ].join('\n');

  const md = `# Validator Metrics Insights — ${dateLabel}

_Generated: ${generatedAt.toISOString()} via tools/metrics/report.ts --insights_

## Summary
- Последен run: **${lastRun?.run_id || 'n/a'}** @ ${lastRun?.timestamp || 'n/a'}
- Clean run ratio: **${cleanRuns}/${totalRuns}**
- Средно време (последни ${totalRuns} run-а): **${runtimeStatus.text}** ${runtimeStatus.emoji}
- CAP предупреждения: **${capPercent.toFixed(1)}%** ${capStatus.emoji}
- Средни предупреждения: **${warningsStatus.text}** ${warningsStatus.emoji}

## KPI Trends
${kpiTable}

## Alerts
${alertsSection}

## Recommended Actions
${recommendedActions.join('\n')}
`;

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, md.trimEnd(), 'utf8');
  console.log(`[metrics] Insights written to ${targetPath}`);
}

function parseHistoryFile(historyPath: string): MetricsRun[] {
  let historyRaw: unknown;
  try {
    historyRaw = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[metrics] Failed to parse telemetry history: ${message}`);
  }
  if (!historyRaw) return [];
  if (Array.isArray(historyRaw)) return historyRaw as MetricsRun[];
  if (typeof historyRaw === 'object') return [historyRaw as MetricsRun];
  return [];
}

export function buildTopCodes(runs: MetricsRun[]): Record<string, number> {
  return runs.reduce<Record<string, number>>((acc, run) => {
    (run.issues || []).forEach((issue) => {
      if (!issue || !issue.code) return;
      acc[issue.code] = (acc[issue.code] || 0) + 1;
    });
    return acc;
  }, {});
}

export function renderSummaryMarkdown(
  recentRuns: MetricsRun[],
  avgDuration: number,
  avgWarnings: number,
  cleanRuns: number,
  avgRetries: number,
  retriesSamples: number,
  topCodesList: string,
): string {
  const generatedAt = new Date();
  const bgDate = generatedAt.toLocaleDateString('bg-BG', { day: '2-digit', month: 'short', year: 'numeric' });
  const tableRows = recentRuns
    .map(
      (run) =>
        `| ${run.run_id} | ${run.timestamp} | ${isNumberValue(run.duration_ms) ? run.duration_ms : 'n/a'} | ${run.errors ?? 0} | ${run.warnings ?? 0} | ${formatNotes(run)} |`,
    )
    .join('\n');

  return `# Validator Metrics Summary — ${bgDate}

_Generated: ${generatedAt.toISOString()} via tools/metrics/report.ts_

## Run история
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |
|--------|-----------|---------------|--------|----------|---------|
${tableRows}

## Аггрегирани показатели
- Средно време за run: **${avgDuration.toFixed(1)} ms** (на база ${recentRuns.length} run-а)
- Среден брой предупреждения: **${avgWarnings.toFixed(2)}**
- Clean run ratio: **${cleanRuns}/${recentRuns.length}**
- Avg retries до зелен статус: **${avgRetries.toFixed(2)}** (по ${retriesSamples} clean run-а)
- Top codes: ${topCodesList || 'n/a'}

## Препоръки
1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot \`New codes = none\`.
2. Инсталирай schema dependencies (Ajv + ajv-formats) в нови среди, за да липсват \`SCHEMA\` предупреждения.
3. Архивирай telemetry история при ≥50 run-а или преди release (\`npm run archive:telemetry -- --label <tag>\`).
`;
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  const historyPath = path.resolve(
    args.history || path.join(__dirname, '..', '..', 'docs', 'analysis', 'reports', 'telemetry-history.json'),
  );
  const outPath = path.resolve(
    args.out || path.join(__dirname, '..', '..', 'docs', 'analysis', 'metrics-summary.md'),
  );
  const archiveDir = path.resolve(
    args.archiveDir || path.join(__dirname, '..', '..', 'docs', 'analysis', 'reports', 'archive'),
  );
  const dryRun = Boolean(args.dryRun);

  if (!fs.existsSync(historyPath)) {
    console.error(`[metrics] History file not found: ${historyPath}`);
    process.exit(1);
  }

  let history: MetricsRun[];
  try {
    history = parseHistoryFile(historyPath);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
    return;
  }

  if (!history.length) {
    console.error('[metrics] History is empty.');
    process.exit(1);
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const limit = Number.isFinite(args.limit) && (args.limit ?? 0) > 0 ? (args.limit as number) : sorted.length;
  const recentRuns = sorted.slice(-limit);

  const avgDuration = average(recentRuns.map((r) => r.duration_ms || 0));
  const avgWarnings = average(recentRuns.map((r) => r.warnings || 0));
  const cleanRuns = recentRuns.filter((r) => (r.errors || 0) === 0 && (r.warnings || 0) === 0).length;
  const topCodes = buildTopCodes(recentRuns);

  const topCodesList = Object.entries(topCodes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, count]) => `${code}:${count}`)
    .join(', ');

  const { avgRetries, retriesSamples } = computeRetries(sorted);
  const markdown = renderSummaryMarkdown(recentRuns, avgDuration, avgWarnings, cleanRuns, avgRetries, retriesSamples, topCodesList);

  if (dryRun) {
    console.log('[metrics] --dry-run enabled. Summary will not be written.');
  } else {
    const archived = archiveExistingSummary(outPath, archiveDir, args.archiveLabel);
    if (archived) {
      console.log(`[metrics] Archived previous summary to ${archived}`);
    }
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, markdown, 'utf8');
    console.log(`[metrics] Summary written to ${outPath}`);
  }

  const insightsPath = args.insights ? path.resolve(args.insights) : null;
  if (insightsPath) {
    if (dryRun) {
      console.log(`[metrics] --dry-run enabled. Insights will not be written (${insightsPath}).`);
    } else {
      const capHitCount = Object.entries(topCodes)
        .filter(([code]) => code.startsWith('CAP-'))
        .reduce((sum, [, count]) => sum + count, 0);
      writeInsights({
        targetPath: insightsPath,
        recentRuns,
        avgDuration,
        avgWarnings,
        cleanRuns,
        capHitCount,
        topCodesList,
      });
    }
  }
}

if (require.main === module) {
  main();
}
