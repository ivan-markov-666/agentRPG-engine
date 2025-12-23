#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { game: 'demo', title: null, type: 'poi', area: null, origin: 'player-request', desc: null, tags: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
        break;
      case '--title':
      case '-t':
        if (next) args.title = next;
        break;
      case '--type':
        if (next) args.type = next;
        break;
      case '--area':
        if (next) args.area = next;
        break;
      case '--origin':
        if (next) args.origin = next;
        break;
      case '--desc':
        if (next) args.desc = next;
        break;
      case '--tags':
        if (next) args.tags = next.split(',').map((tag) => tag.trim()).filter(Boolean);
        break;
      case '--id':
        if (next) args.id = next;
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

function ensureUniqueId(baseId, existing) {
  const slugBase = baseId || `exp-${Date.now()}`;
  let candidate = slugBase;
  let counter = 1;
  const existingIds = new Set(existing.map((entry) => entry.id));
  while (existingIds.has(candidate)) {
    counter += 1;
    candidate = `${slugBase}-${counter}`;
  }
  return candidate;
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[ERROR] Failed to parse ${filePath}: ${e.message}`);
    process.exit(1);
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.title) {
    console.error('Usage: npm run exploration:add -- --title "..." [--game demo] [--type dungeon] [--area id] [--origin player-request|gm-suggested] [--desc "..."] [--tags tag1,tag2]');
    process.exit(1);
  }
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const logPath = path.join(gameBase, 'player-data', 'runtime', 'exploration-log.json');
  const statePath = path.join(gameBase, 'player-data', 'runtime', 'state.json');
  if (args.area) {
    const areaFile = path.join(gameBase, 'scenario', 'areas', `${args.area}.md`);
    if (!fs.existsSync(areaFile)) {
      console.error(`[ERROR] Area markdown not found for area_id '${args.area}'. Expected file: ${areaFile}`);
      console.error('Create the area file or omit --area until it exists.');
      process.exit(1);
    }
  }
  const logData = readJson(logPath, []);
  if (!Array.isArray(logData)) {
    console.error(`[ERROR] Exploration log is not an array: ${logPath}`);
    process.exit(1);
  }
  const state = readJson(statePath, {});
  const baseId = args.id || slugify(args.title);
  const entryId = ensureUniqueId(baseId, logData);
  const description =
    args.desc ||
    `${args.title} (${args.type}) recently discovered during free exploration. Document notable hooks/risks before using in session.`;
  const entry = {
    id: entryId,
    title: args.title,
    type: args.type,
    added_at: new Date().toISOString(),
    origin: args.origin === 'gm-suggested' ? 'gm-suggested' : 'player-request',
    description,
  };
  if (args.area) entry.area_id = args.area;
  const uniqueTags = Array.from(new Set((args.tags || []).filter(Boolean))).slice(0, 10);
  if (uniqueTags.length > 0) entry.tags = uniqueTags;

  logData.push(entry);
  writeJson(logPath, logData);

  if (state && typeof state === 'object') {
    if (!state.exploration_enabled && !(state.exploration && state.exploration.enabled)) {
      state.exploration_enabled = true;
      console.warn('[INFO] exploration_enabled was false/undefined; set to true.');
    }
    if (!Array.isArray(state.exploration_log_preview)) {
      state.exploration_log_preview = [];
    }
    state.exploration_log_preview = [
      entry.id,
      ...state.exploration_log_preview.filter((id) => id !== entry.id),
    ].slice(0, 5);
    writeJson(statePath, state);
  }

  console.log(`[OK] Added exploration entry '${entry.title}' (${entry.id}) → ${logPath}`);
}

main();
