#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { game: 'demo', json: null };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
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

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractSection(content, heading) {
  const pattern = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[1].trim();
}

function parseRewardLines(sectionText) {
  if (!sectionText) return [];
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'));
}

function extractNumeric(line) {
  const match = line.match(/(-?\d[\d,]*)/);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

function summarizeRewardLines(rewardLines) {
  const summary = { xp: null, gold: null, loot: null, social: null };
  rewardLines.forEach((line) => {
    if (/^-+\s*XP:/i.test(line)) summary.xp = extractNumeric(line);
    else if (/^-+\s*Gold:/i.test(line)) summary.gold = extractNumeric(line);
    else if (/^-+\s*Loot:/i.test(line)) summary.loot = line.replace(/^-+\s*Loot:\s*/i, '').trim();
    else if (/^-+\s*Social:/i.test(line)) summary.social = line.replace(/^-+\s*Social:\s*/i, '').trim();
  });
  return summary;
}

function formatNumber(value) {
  if (value == null) return '—';
  return value.toLocaleString();
}

function main() {
  const args = parseArgs(process.argv);
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const availablePath = path.join(questDir, 'available.json');
  if (!fs.existsSync(availablePath)) {
    console.error(`[ERROR] Missing scenario/quests/available.json in ${gameBase}`);
    process.exit(1);
  }
  const available = readJson(availablePath, []);
  const quests = Array.isArray(available)
    ? available
    : Object.entries(available).map(([quest_id, title]) => ({ quest_id, title }));
  const rows = [];
  const issues = [];
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
        acc.xpTotal += row.xp;
        acc.xpCount += 1;
      }
      if (Number.isFinite(row.gold)) {
        acc.goldTotal += row.gold;
        acc.goldCount += 1;
      }
      if (row.loot) acc.lootCount += 1;
      if (row.social) acc.socialCount += 1;
      return acc;
    },
    { xpTotal: 0, xpCount: 0, goldTotal: 0, goldCount: 0, lootCount: 0, socialCount: 0 }
  );

  const report = {
    game: args.game,
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

  if (args.json) {
    fs.writeFileSync(args.json, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`[OK] Wrote economy report JSON to ${args.json}`);
  }

  console.log(`Economy report for game '${args.game}'`);
  console.log(` - Quests processed: ${rows.length}`);
  console.log(` - Quest files missing: ${missingFiles}`);
  console.log(
    ` - XP total: ${formatNumber(report.totals.xp.total)} | avg: ${formatNumber(
      report.totals.xp.average.toFixed ? Number(report.totals.xp.average.toFixed(1)) : report.totals.xp.average
    )}`
  );
  console.log(
    ` - Gold total: ${formatNumber(report.totals.gold.total)} | avg: ${formatNumber(
      report.totals.gold.average.toFixed ? Number(report.totals.gold.average.toFixed(1)) : report.totals.gold.average
    )}`
  );
  console.log(` - Loot entries: ${report.totals.lootEntries} | Social entries: ${report.totals.socialEntries}`);
  if (issues.length) {
    console.log('\nIssues:');
    issues.forEach((issue) => {
      console.log(` - [${issue.code}] ${issue.quest_id}: ${issue.title || 'Untitled quest'}`);
    });
  }
  console.log('\nQuest breakdown:');
  rows.forEach((row) => {
    console.log(
      ` - ${row.quest_id.padEnd(20)} | XP: ${formatNumber(row.xp)} | Gold: ${formatNumber(row.gold)} | Loot: ${
        row.loot || '—'
      } | Social: ${row.social || '—'}`
    );
  });
}

main();
