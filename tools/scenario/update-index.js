#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { game: 'demo' };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
        break;
      default:
        break;
    }
  }
  return args;
}

function readJson(fp, fallback) {
  if (!fs.existsSync(fp)) return fallback;
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function extractSection(content, heading) {
  const pattern = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[1].trim();
}

function compactSummary(text) {
  if (!text) return 'Summary pending.';
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > 160 ? `${normalized.slice(0, 157)}…` : normalized;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function buildQuestRows(gameBase) {
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const availablePath = path.join(questDir, 'available.json');
  const unlockPath = path.join(questDir, 'unlock-triggers.json');
  const availableRaw = readJson(availablePath, []);
  const unlocks = readJson(unlockPath, {});
  const quests = Array.isArray(availableRaw)
    ? availableRaw
    : Object.entries(availableRaw).map(([quest_id, title]) => ({ quest_id, title }));
  return quests.map(({ quest_id, title }) => {
    const questFile = path.join(questDir, `${quest_id}.md`);
    let summaryText = 'Summary missing.';
    let fileExists = false;
    if (fs.existsSync(questFile)) {
      fileExists = true;
      const content = fs.readFileSync(questFile, 'utf8');
      summaryText = compactSummary(extractSection(content, 'Summary'));
      if (!title) {
        const headerTitle = extractTitle(content);
        if (headerTitle) {
          title = headerTitle;
        }
      }
    }
    const unlock = unlocks && typeof unlocks === 'object' && unlocks[quest_id] ? unlocks[quest_id] : 'always';
    const unlockLabel = Array.isArray(unlock) ? unlock.join(', ') : unlock;
    return {
      quest_id,
      title: title || quest_id,
      summary: fileExists ? summaryText : 'Quest file missing.',
      unlock: unlockLabel,
      path: fileExists ? `scenario/quests/${quest_id}.md` : 'missing',
    };
  });
}

function buildAreaRows(gameBase) {
  const areasDir = path.join(gameBase, 'scenario', 'areas');
  if (!fs.existsSync(areasDir)) return [];
  return fs
    .readdirSync(areasDir)
    .filter((name) => name.endsWith('.md'))
    .map((file) => {
      const content = fs.readFileSync(path.join(areasDir, file), 'utf8');
      const title = extractTitle(content) || file.replace(/\.md$/, '');
      const description = compactSummary(extractSection(content, 'Description'));
      return {
        id: file.replace(/\.md$/, ''),
        title,
        description: description || 'Description missing.',
        path: `scenario/areas/${file}`,
      };
    });
}

function buildMarkdown(gameName, quests, areas) {
  const generatedAt = new Date().toISOString();
  const questTableHeader = '| Quest | Unlock | Summary |\n| --- | --- | --- |';
  const questTableRows = quests
    .map((quest) => {
      const link = quest.path !== 'missing' ? `[${quest.title}](${quest.path})` : `${quest.title} _(missing file)_`;
      return `| ${link} | ${quest.unlock || 'always'} | ${quest.summary} |`;
    })
    .join('\n');
  const areaTableHeader = '| Area | Description |\n| --- | --- | --- |';
  const areaTableRows = areas
    .map((area) => `| [${area.title}](${area.path}) | ${area.description} |`)
    .join('\n');
  return `# ${gameName} — Scenario Overview

_Generated on ${generatedAt}. Keep this file synchronized via \`npm run scenario:index -- --game ${gameName}\`._

## Quest Overview
${quests.length ? `${questTableHeader}\n${questTableRows}` : '_No quests listed in scenario/quests/available.json._'}

## Areas
${areas.length ? `${areaTableHeader}\n${areaTableRows}` : '_No area files found in scenario/areas._'}
`;
}

function main() {
  const args = parseArgs(process.argv);
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const indexPath = path.join(gameBase, 'scenario', 'index.md');
  const quests = buildQuestRows(gameBase);
  const areas = buildAreaRows(gameBase);
  const content = buildMarkdown(args.game, quests, areas);
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, `${content.trim()}\n`, 'utf8');
  console.log(`[OK] Updated ${path.relative(process.cwd(), indexPath)} with ${quests.length} quests and ${areas.length} areas.`);
}

main();
