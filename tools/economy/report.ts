#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  json: string | null;
  basePath: string | null;
}

interface QuestSummaryRow {
  quest_id: string;
  title?: string;
  xp: number | null;
  gold: number | null;
  loot: string | null;
  social: string | null;
}

interface Issue {
  code: string;
  quest_id: string;
  title?: string;
}

interface Report {
  game: string;
  questsProcessed: number;
  questsMissingFiles: number;
  totals: {
    xp: { total: number; average: number };
    gold: { total: number; average: number };
    lootEntries: number;
    socialEntries: number;
  };
  rows: QuestSummaryRow[];
  issues: Issue[];
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { game: 'demo', json: null, basePath: null };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
        break;
      case '--path':
      case '-p':
        if (next) args.basePath = next;
        break;
      case '--json':
        if (next) args.json = next;
        break;
      default:
        break;
    }
  }
  return args;
}

export function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

export function extractSection(content: string, heading: string): string | null {
  const pattern = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[1].trim();
}

export function parseRewardLines(sectionText: string | null): string[] {
  if (!sectionText) return [];
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'));
}

export function extractNumeric(line: string): number | null {
  const match = line.match(/(-?\d[\d,]*)/);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

export function summarizeRewardLines(rewardLines: string[]): QuestSummaryRow {
  const summary: QuestSummaryRow = { quest_id: '', xp: null, gold: null, loot: null, social: null };
  rewardLines.forEach((line) => {
    if (/^-+\s*XP:/i.test(line)) summary.xp = extractNumeric(line);
    else if (/^-+\s*Gold:/i.test(line)) summary.gold = extractNumeric(line);
    else if (/^-+\s*Loot:/i.test(line)) summary.loot = line.replace(/^-+\s*Loot:\s*/i, '').trim();
    else if (/^-+\s*Social:/i.test(line)) summary.social = line.replace(/^-+\s*Social:\s*/i, '').trim();
  });
  return summary;
}

export function formatNumber(value: number | null): string {
  if (value == null) return '—';
  return value.toLocaleString();
}

export function buildReport(gameBase: string, game: string): Report {
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const availablePath = path.join(questDir, 'available.json');
  if (!fs.existsSync(availablePath)) {
    throw new Error(`[ERROR] Missing scenario/quests/available.json in ${gameBase}`);
  }
  const available = readJson<unknown>(availablePath, []);
  const quests = Array.isArray(available)
    ? (available as Array<{ quest_id: string; title?: string }>)
    : Object.entries(available as Record<string, string>).map(([quest_id, title]) => ({ quest_id, title }));
  const rows: QuestSummaryRow[] = [];
  const issues: Issue[] = [];
  let missingFiles = 0;

  quests.forEach(({ quest_id, title }) => {
    const questFile = path.join(questDir, `${quest_id}.md`);
    if (!fs.existsSync(questFile)) {
      issues.push({ code: 'QUEST-FILE-MISSING', quest_id, title });
      missingFiles += 1;
      return;
    }
    const content = fs.readFileSync(questFile, 'utf8');
    const rewardsSection = extractSection(content, 'Rewards');
    const rewardLines = parseRewardLines(rewardsSection);
    const summary = summarizeRewardLines(rewardLines);
    rows.push({
      quest_id,
      title,
      xp: summary.xp,
      gold: summary.gold,
      loot: summary.loot,
      social: summary.social,
    });
  });

  const totals = rows.reduce(
    (acc, row) => {
      if (Number.isFinite(row.xp)) {
        acc.xpTotal += row.xp ?? 0;
        acc.xpCount += 1;
      }
      if (Number.isFinite(row.gold)) {
        acc.goldTotal += row.gold ?? 0;
        acc.goldCount += 1;
      }
      if (row.loot) acc.lootCount += 1;
      if (row.social) acc.socialCount += 1;
      return acc;
    },
    { xpTotal: 0, xpCount: 0, goldTotal: 0, goldCount: 0, lootCount: 0, socialCount: 0 },
  );

  return {
    game,
    questsProcessed: rows.length,
    questsMissingFiles: missingFiles,
    totals: {
      xp: { total: totals.xpTotal, average: totals.xpCount ? totals.xpTotal / totals.xpCount : 0 },
      gold: { total: totals.goldTotal, average: totals.goldCount ? totals.goldTotal / totals.goldCount : 0 },
      lootEntries: totals.lootCount,
      socialEntries: totals.socialCount,
    },
    rows,
    issues,
  };
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  const gameBase =
    args.basePath && args.basePath.trim()
      ? path.resolve(args.basePath)
      : path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }

  let report: Report;
  try {
    report = buildReport(gameBase, args.game);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
    return;
  }

  if (args.json) {
    fs.writeFileSync(args.json, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`[OK] Wrote economy report JSON to ${args.json}`);
  }

  const xpAverage = Number(report.totals.xp.average.toFixed(1));
  const goldAverage = Number(report.totals.gold.average.toFixed(1));

  console.log(`Economy report for game '${args.game}'`);
  console.log(` - Quests processed: ${report.questsProcessed}`);
  console.log(` - Quest files missing: ${report.questsMissingFiles}`);
  console.log(
    ` - XP total: ${formatNumber(report.totals.xp.total)} | avg: ${formatNumber(xpAverage)}`,
  );
  console.log(
    ` - Gold total: ${formatNumber(report.totals.gold.total)} | avg: ${formatNumber(goldAverage)}`,
  );
  console.log(` - Loot entries: ${report.totals.lootEntries} | Social entries: ${report.totals.socialEntries}`);
  if (report.issues.length) {
    console.log('\nIssues:');
    report.issues.forEach((issue) => {
      console.log(` - [${issue.code}] ${issue.quest_id}: ${issue.title || 'Untitled quest'}`);
    });
  }
  console.log('\nQuest breakdown:');
  report.rows.forEach((row) => {
    console.log(
      ` - ${row.quest_id.padEnd(20)} | XP: ${formatNumber(row.xp)} | Gold: ${formatNumber(row.gold)} | Loot: ${row.loot || '—'} | Social: ${row.social || '—'}`,
    );
  });
}

if (require.main === module) {
  main();
}
