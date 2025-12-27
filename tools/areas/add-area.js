#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    game: 'demo',
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
        if (next) args.points = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--connections':
        if (next) args.connections = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--notes':
        if (next) args.notes = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--conditions':
        if (next) args.conditions = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--threats':
        if (next) args.threats = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      default:
        break;
    }
  }
  return args;
}

function slugify(value) {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function main() {
  const args = parseArgs(process.argv);
  const areaId = args.id || slugify(args.title);
  if (!areaId) {
    console.error(
      'Usage: npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--points "POI A|POI B"] [--connections "Link A|Link B"] [--notes "NPC: ...|Hook: ..."] [--conditions "Prereq|Timer"] [--threats "Escalation|Fail"] [--game demo]'
    );
    process.exit(1);
  }
  const title = args.title || areaId;
  const description = args.description || 'Describe the vibe, key locations, NPCs, constraints and hooks (2-6 sentences).';

  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
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

  const pointsSection = args.points.length
    ? args.points.map((poi) => `- ${poi}`).join('\n')
    : '- (poi-id) Name — short hook or gameplay affordance';
  const connectionsSection = args.connections.length
    ? args.connections.map((link) => `- ${link}`).join('\n')
    : '- [[default-area]] main route into the region';
  const notesSection = args.notes.length
    ? args.notes.map((note) => `- ${note}`).join('\n')
    : '- NPCs: Who runs this place?\n- Threats: Hazards, timers, or faction stakes.';
  const conditionsSection = args.conditions.length
    ? args.conditions.map((cond) => `- ${cond}`).join('\n')
    : '- Entry condition: Friendly reputation with the guard.\n- Timer: Clear within two in-game days.';
  const threatsSection = args.threats.length
    ? args.threats.map((threat) => `- ${threat}`).join('\n')
    : '- Escalation: Rival squad seizes control if ignored.\n- Fail Hook: Prices increase for supplies.';

  const md = `# ${title}

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
  fs.writeFileSync(areaFile, md, 'utf8');

  console.log(`[OK] Area created: ${path.relative(process.cwd(), areaFile)}`);
}

main();
