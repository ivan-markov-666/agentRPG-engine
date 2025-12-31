#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  path: string | null;
  id: string | null;
  title: string | null;
  area: string;
  force: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    path: null,
    id: null,
    title: null,
    area: 'default-area',
    force: false,
  };

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
          args.path = next;
          i += 1;
        }
        break;
      case '--id':
        if (next) {
          args.id = next;
          i += 1;
        }
        break;
      case '--title':
      case '-t':
        if (next) {
          args.title = next;
          i += 1;
        }
        break;
      case '--area':
        if (next) {
          args.area = next;
          i += 1;
        }
        break;
      case '--force':
        args.force = true;
        break;
      default:
        break;
    }
  }

  return args;
}

function resolveGameBase(args: CliArgs): string {
  if (args.path && args.path.trim()) {
    return path.resolve(args.path);
  }
  return path.join(__dirname, '..', '..', 'games', args.game);
}

export function buildScaffoldMarkdown(title: string, areaId: string, summary: string): string {
  return `# ${title}

## Summary
${summary}

## Story
- The party is pulled into the central conflict through an urgent request or a visible threat.
- Anchor the opening scene in [[${areaId}]] and introduce a clear short-term objective.

## Hooks
- Rumor: A local NPC in [[${areaId}]] offers a deal that reveals the quest.

## Encounters
- A first obstacle forces the party to choose between stealth, diplomacy, or combat.

## Steps
1. Travel to [[${areaId}]] and gather the first actionable clue.
2. Confront the main complication and decide how to resolve it.

## Rewards
- XP: 100
- Gold: 10
- Loot: A minor item tied to the quest theme.
- Social: Reputation +1 with a relevant faction or NPC.

## Notes
- GM: Replace generic beats with named NPCs, constraints, and time pressure.

## Conditions
- Always.

## Fail State
- If the party abandons the lead, the antagonist advances their plan off-screen.

## Outcome
- Success changes the local situation in [[${areaId}]] and unlocks the next lead.

## Aftermath
- Add one follow-up scene or consequence that persists into exploration.

## Outcome Hooks
- A new clue points to a follow-up quest or a new location.
`;
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  const questId = args.id?.trim();

  if (!questId) {
    console.error(
      'Usage: npm run quest:scaffold -- --id quest-id [--title "..."] [--area area-id] [--game demo] [--path games/<gameId>] [--force]',
    );
    process.exit(1);
  }

  const gameBase = resolveGameBase(args);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }

  const questsDir = path.join(gameBase, 'scenario', 'quests');
  const questFile = path.join(questsDir, `${questId}.md`);

  if (fs.existsSync(questFile) && !args.force) {
    console.error(`[ERROR] Quest file already exists: ${questFile}`);
    process.exit(1);
  }

  fs.mkdirSync(questsDir, { recursive: true });

  const title = args.title?.trim() || questId;
  const areaId = args.area?.trim() || 'default-area';

  const summary = `Auto-generated quest scaffold for "${title}". Replace this summary with the real hook, stakes, and starting situation.`;
  const md = buildScaffoldMarkdown(title, areaId, summary);

  fs.writeFileSync(questFile, md, 'utf8');
  console.log(`[OK] Quest scaffold created: ${path.relative(process.cwd(), questFile)}`);
}

if (require.main === module) {
  main();
}
