#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  basePath: string | null;
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
  const args: CliArgs = { game: 'demo', basePath: null };
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
      case '--path':
      case '-p':
        if (next) {
          args.basePath = next;
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

  const rows = quests.map(({ quest_id, title }) => {
    const questFile = path.join(questDir, `${quest_id}.md`);
    if (!fs.existsSync(questFile)) {
      throw new Error(
        `Quest markdown missing for '${quest_id}'. Expected file at ${questFile}. Use quest:add or remedy tooling to scaffold it.`,
      );
    }
    const content = fs.readFileSync(questFile, 'utf8');
    const summaryText = compactSummary(extractSection(content, 'Summary')) || 'Summary missing.';
    let resolvedTitle = title;
    const headerTitle = extractTitle(content);
    if (!resolvedTitle && headerTitle) {
      resolvedTitle = headerTitle;
    }

    const unlockValue = unlocks[quest_id] ?? 'always';
    const unlockLabel = Array.isArray(unlockValue) ? unlockValue.join(', ') : unlockValue;

    return {
      quest_id,
      title: resolvedTitle || quest_id,
      summary: summaryText,
      unlock: unlockLabel || 'always',
      path: `scenario/quests/${quest_id}.md`,
    };
  });

  return rows.sort((a, b) => a.quest_id.localeCompare(b.quest_id, 'en'));
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
    })
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

function buildMarkdown(gameName: string, quests: QuestRow[], areas: AreaRow[]): string {
  const questTableHeader = '| Quest | Unlock | Summary |\n| --- | --- | --- |';
  const questTableRows = quests
    .map((quest) => {
      const link = `[${quest.title}](${quest.path})`;
      return `| ${link} | ${quest.unlock || 'always'} | ${quest.summary} |`;
    })
    .join('\n');
  const areaTableHeader = '| Area | Description |\n| --- | --- | --- |';
  const areaTableRows = areas.map((area) => `| [${area.title}](${area.path}) | ${area.description} |`).join('\n');

  return `# ${gameName} — Scenario Overview

_Regenerate via \`npm run scenario:index -- --game ${gameName}\`._

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
    const gameBase =
      args.basePath && args.basePath.trim()
        ? path.resolve(args.basePath)
        : path.join(__dirname, '..', '..', 'games', args.game);
    if (!fs.existsSync(gameBase)) {
      console.error(`[ERROR] Game folder not found: ${gameBase}`);
      process.exit(1);
    }
    const scenarioDir = path.join(gameBase, 'scenario');
    fs.mkdirSync(scenarioDir, { recursive: true });
    const indexPath = path.join(scenarioDir, 'index.md');
    const quests = buildQuestRows(gameBase);
    const areas = buildAreaRows(gameBase);
    const content = buildMarkdown(args.game, quests, areas);
    fs.writeFileSync(indexPath, `${content}\n`, 'utf8');
    console.log(`[SCENARIO] index regenerated at ${path.relative(gameBase, indexPath)}`);
  } catch (err) {
    console.error('[SCENARIO][ERROR]', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
