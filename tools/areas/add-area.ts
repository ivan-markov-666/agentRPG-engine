#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface CliArgs {
  game: string;
  basePath: string | null;
  id: string | null;
  title: string | null;
  description: string | null;
  points: string[];
  connections: string[];
  notes: string[];
  conditions: string[];
  threats: string[];
}

function listFromArg(value?: string | null): string[] {
  if (!value) return [];
  return value.split('|').map((s) => s.trim()).filter(Boolean);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    basePath: null,
    id: null,
    title: null,
    description: null,
    points: [],
    connections: [],
    notes: [],
    conditions: [],
    threats: [],
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
        if (next) args.basePath = next;
        break;
      case '--id':
        if (next) args.id = next;
        break;
      case '--title':
      case '-t':
        if (next) args.title = next;
        break;
      case '--description':
      case '--desc':
        if (next) args.description = next;
        break;
      case '--points':
        if (next) args.points = listFromArg(next);
        break;
      case '--connections':
        if (next) args.connections = listFromArg(next);
        break;
      case '--notes':
        if (next) args.notes = listFromArg(next);
        break;
      case '--conditions':
        if (next) args.conditions = listFromArg(next);
        break;
      case '--threats':
        if (next) args.threats = listFromArg(next);
        break;
      default:
        break;
    }
  }
  return args;
}

function slugify(value: string | null): string | null {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function humanizeId(id: string): string {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatBulletList(entries: string[], fallback: string[]): string {
  const list = entries.length ? entries : fallback;
  return list.map((entry) => (entry.startsWith('-') ? entry : `- ${entry}`)).join('\n');
}

export function createAreaMarkdown(args: CliArgs): { filePath: string; content: string } {
  const areaId = args.id || slugify(args.title);
  if (!areaId) {
    throw new Error(
      'Usage: npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--points "POI A|POI B"] [--connections "Link A|Link B"] [--notes "NPC: ...|Hook: ..."] [--conditions "Prereq|Timer"] [--threats "Escalation|Fail"] [--game demo]',
    );
  }
  const title = args.title || humanizeId(areaId);
  const description =
    args.description ||
    'Describe the vibe, key locations, NPCs, constraints and hooks (2–6 sentences) so the section easily clears 60+ characters.';

  const pointsSection = formatBulletList(args.points, [
    '- (poi-id) Name — short hook or gameplay affordance',
    '- (poi-id-2) Backup POI with narrative payoff',
  ]);
  const connectionsSection = formatBulletList(args.connections, [
    '- [[default-area]] main route into the region',
    '- [[nearby-outpost]] optional flank or fallback camp',
  ]);
  const notesSection = formatBulletList(args.notes, [
    '- NPCs: Who runs this place?',
    '- Threats: Hazards, timers, or faction stakes.',
  ]);
  const conditionsSection = formatBulletList(args.conditions, [
    '- Entry condition: Friendly reputation with the guard.',
    '- Timer: Clear within two in-game days.',
  ]);
  const threatsSection = formatBulletList(args.threats, [
    '- Escalation: Rival squad seizes control if ignored.',
    '- Fail Hook: Prices increase for supplies.',
  ]);

  const content = `# ${title}

## Description
${description}

## Points of interest
${pointsSection}

## Connections
${connectionsSection}

## Notes
${notesSection}

## Conditions
${conditionsSection}

## Threats
${threatsSection}
`;

  return { filePath: `${areaId}.md`, content };
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  const areaId = args.id || slugify(args.title);
  if (!areaId) {
    console.error(
      'Usage: npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--points "POI A|POI B"] [--connections "Link A|Link B"] [--notes "NPC: ...|Hook: ..."] [--conditions "Prereq|Timer"] [--threats "Escalation|Fail"] [--game demo]',
    );
    process.exit(1);
  }

  const gameBase =
    args.basePath && args.basePath.trim()
      ? path.resolve(args.basePath)
      : path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const areasDir = path.join(gameBase, 'scenario', 'areas');
  const areaFile = path.join(areasDir, `${areaId}.md`);
  if (fs.existsSync(areaFile)) {
    console.error(`[ERROR] Area file already exists: ${areaFile}`);
    process.exit(1);
  }
  fs.mkdirSync(areasDir, { recursive: true });

  const { content } = createAreaMarkdown(args);
  fs.writeFileSync(areaFile, content, 'utf8');

  console.log(`[OK] Area created: ${path.relative(process.cwd(), areaFile)}`);
}

if (require.main === module) {
  main();
}

export { parseArgs, slugify };
