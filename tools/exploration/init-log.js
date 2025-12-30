#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    game: 'demo',
    path: null,
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
  const gameBase = resolveGameBase(args);

  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }

  const target = path.join(gameBase, 'player-data', 'runtime', 'exploration-log.json');
  if (fs.existsSync(target) && !args.force) {
    console.log(`[SKIP] Exploration log already exists: ${path.relative(process.cwd(), target)}`);
    process.exit(0);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, '[]\n', 'utf8');
  console.log(`[OK] Exploration log initialized: ${path.relative(process.cwd(), target)}`);
}

main();
