#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
}

interface QuestRow {
  quest_id: string;
  title: string;
  summary: string;
  unlock: string;
  path: string;
}

interface AreaRow {
  id: string;
  title: string;
  description: string;
  path: string;
}

type AvailableEntry = { quest_id: string; title: string };
type AvailableData = AvailableEntry[] | Record<string, string>;
type UnlocksData = Record<string, string | string[]>;

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { game: 'demo' };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) {
          args.game = next;
          i += 1;
        }
        break;
      default:
        break;
    }
  }
  return args;
}

function readJson<T>(fp: string, fallback: T): T {
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8')) as T;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Cannot parse JSON at ${fp}: ${message}`);
  }
}

function extractSection(content: string, heading: string): string | null {
  const pattern = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[1].trim();
}

function compactSummary(text: string | null): string {
  if (!text) return 'Summary pending.';
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > 160 ? `${normalized.slice(0, 157)}…` : normalized;
}

function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function normalizeAvailable(raw: AvailableData): AvailableEntry[] {
  if (Array.isArray(raw)) {
    return raw.map((entry) => ({ quest_id: entry.quest_id, title: entry.title }));
  }
  return Object.entries(raw).map(([quest_id, title]) => ({ quest_id, title }));
}

function buildQuestRows(gameBase: string): QuestRow[] {
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const availablePath = path.join(questDir, 'available.json');
  const unlockPath = path.join(questDir, 'unlock-triggers.json');
  const availableRaw = readJson<AvailableData>(availablePath, []);
  const unlocks = readJson<UnlocksData>(unlockPath, {});
  const quests = normalizeAvailable(availableRaw);

  return quests.map(({ quest_id, title }) => {
    const questFile = path.join(questDir, `${quest_id}.md`);
    let summaryText = 'Summary missing.';
    let resolvedTitle = title;
    let pathLabel = 'missing';

    if (fs.existsSync(questFile)) {
      const content = fs.readFileSync(questFile, 'utf8');
      summaryText = compactSummary(extractSection(content, 'Summary'));
      const headerTitle = extractTitle(content);
      if (!resolvedTitle && headerTitle) {
        resolvedTitle = headerTitle;
      }
      pathLabel = `scenario/quests/${quest_id}.md`;
    }

    const unlockValue = unlocks[quest_id] ?? 'always';
    const unlockLabel = Array.isArray(unlockValue) ? unlockValue.join(', ') : unlockValue;

    return {
      quest_id,
      title: resolvedTitle || quest_id,
      summary: pathLabel === 'missing' ? 'Quest file missing.' : summaryText,
      unlock: unlockLabel || 'always',
      path: pathLabel,
    };
  });
}

function buildAreaRows(gameBase: string): AreaRow[] {
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

function buildMarkdown(gameName: string, quests: QuestRow[], areas: AreaRow[]): string {
  const generatedAt = new Date().toISOString();
  const questTableHeader = '| Quest | Unlock | Summary |\n| --- | --- | --- |';
  const questTableRows = quests
    .map((quest) => {
      const link = quest.path !== 'missing' ? `[${quest.title}](${quest.path})` : `${quest.title} _(missing file)_`;
      return `| ${link} | ${quest.unlock || 'always'} | ${quest.summary} |`;
    })
    .join('\n');
  const areaTableHeader = '| Area | Description |\n| --- | --- | --- |';
  const areaTableRows = areas.map((area) => `| [${area.title}](${area.path}) | ${area.description} |`).join('\n');

  return `# ${gameName} — Scenario Overview

_Generated on ${generatedAt}. Keep this file synchronized via \`npm run scenario:index -- --game ${gameName}\`._

## Quest Overview
${quests.length ? `${questTableHeader}\n${questTableRows}` : '_No quests listed in scenario/quests/available.json._'}

## Areas
${areas.length ? `${areaTableHeader}\n${areaTableRows}` : '_No area files found in scenario/areas._'}
`;
}

export function main(argv: string[] = process.argv): void {
  let args: CliArgs;
  try {
    args = parseArgs(argv);
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
  } catch (err) {
    console.error('[SCENARIO][ERROR]', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
