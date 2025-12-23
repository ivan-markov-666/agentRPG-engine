#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { game: 'demo', id: null, title: null, description: null };
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
    console.error('Usage: npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--game demo]');
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

  const md = `# ${title}\n\n## Description\n${description}\n\n## Points of interest\n- (poi-id) Name — short hook\n\n## Connections\n- Links to nearby areas: [[default-area]]\n`;
  fs.writeFileSync(areaFile, md, 'utf8');

  console.log(`[OK] Area created: ${path.relative(process.cwd(), areaFile)}`);
}

main();
