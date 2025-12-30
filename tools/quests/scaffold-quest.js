#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
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
        if (next) args.game = next;
        break;
      case '--path':
      case '-p':
        if (next) args.path = next;
        break;
      case '--id':
        if (next) args.id = next;
        break;
      case '--title':
      case '-t':
        if (next) args.title = next;
        break;
      case '--area':
        if (next) args.area = next;
        break;
      case '--force':
        args.force = true;
        i -= 1;
        break;
      default:
        break;
    }
  }

  return args;
}

function resolveGameBase(args) {
  if (args.path && args.path.trim()) {
    return path.resolve(args.path);
  }
  return path.join(__dirname, '..', '..', 'games', args.game);
}

function main() {
  const args = parseArgs(process.argv);
  const questId = args.id && args.id.trim();

  if (!questId) {
    console.error('Usage: npm run quest:scaffold -- --id quest-id [--title "..."] [--area area-id] [--game demo] [--path games/<gameId>] [--force]');
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

  const title = (args.title && args.title.trim()) || questId;
  const areaId = (args.area && args.area.trim()) || 'default-area';

  const summary = `Auto-generated quest scaffold for "${title}". Replace this summary with the real hook, stakes, and starting situation.`;

  const md = `# ${title}

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

  fs.writeFileSync(questFile, md, 'utf8');
  console.log(`[OK] Quest scaffold created: ${path.relative(process.cwd(), questFile)}`);
}

main();
