#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const SCHEMA_TYPES = new Set(['area', 'quest', 'event'] as const);
const LEGACY_TYPES = new Set(['city', 'landmark', 'dungeon', 'mcp', 'side-quest-hook', 'poi'] as const);
const LEGACY_TYPE_TO_SCHEMA_TYPE: Record<string, SchemaType> = {
  city: 'area',
  landmark: 'area',
  dungeon: 'area',
  poi: 'area',
  mcp: 'event',
  'side-quest-hook': 'event',
};
const TYPES_REQUIRING_AREA = new Set<SchemaType>(['area']);
const ALLOWED_TYPES = new Set<string>([...Array.from(SCHEMA_TYPES), ...Array.from(LEGACY_TYPES)]);
const TYPE_AUTO_TAGS: Record<string, string[]> = {
  area: ['area'],
  quest: ['quest'],
  event: ['event'],
  city: ['city'],
  landmark: ['landmark'],
  dungeon: ['dungeon'],
  poi: ['poi'],
  mcp: ['mcp'],
  'side-quest-hook': ['side-quest'],
};

type SchemaType = 'area' | 'quest' | 'event';

interface CliArgs {
  game: string;
  title: string | null;
  type: string;
  area: string | null;
  quest: string | null;
  origin: 'player-request' | 'gm-suggested';
  desc: string | null;
  tags: string[];
  id: string | null;
  previewLimit: number;
  previewMode: 'newest' | 'append';
}

interface ExplorationEntry {
  id: string;
  title: string;
  type: SchemaType;
  added_at: string;
  origin: 'player-request' | 'gm-suggested';
  description: string;
  area_id?: string;
  quest_id?: string;
  tags: string[];
}

type RuntimeState = {
  exploration_enabled?: boolean;
  exploration?: { enabled?: boolean };
  exploration_log_preview?: string[];
  [key: string]: unknown;
};

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: 'demo',
    title: null,
    type: 'event',
    area: null,
    quest: null,
    origin: 'player-request',
    desc: null,
    tags: [],
    id: null,
    previewLimit: 5,
    previewMode: 'newest',
  };
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
      case '--quest':
        if (next) args.quest = next;
        break;
      case '--origin':
        if (next) {
          const origin = next === 'gm-suggested' ? 'gm-suggested' : 'player-request';
          args.origin = origin;
        }
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
      case '--preview-limit':
        if (next && !Number.isNaN(Number(next))) args.previewLimit = Math.max(1, Number(next));
        break;
      case '--preview-mode':
        if (next) {
          const mode = next.toLowerCase();
          args.previewMode = mode === 'append' ? 'append' : 'newest';
        }
        break;
      default:
        break;
    }
  }
  return args;
}

export function slugify(value: string | null): string | null {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function ensureUniqueId(baseId: string | null, existing: ExplorationEntry[]): string {
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

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`[ERROR] Failed to parse ${filePath}: ${message}`);
  }
}

function writeJson<T>(filePath: string, data: T): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function validateArgs(args: CliArgs, schemaType: SchemaType, gameBase: string): void {
  if (TYPES_REQUIRING_AREA.has(schemaType) && !args.area) {
    throw new Error(`[ERROR] Exploration type '${schemaType}' requires --area <area-id> to satisfy guardrails.`);
  }
  if (schemaType === 'quest' && !args.quest) {
    throw new Error("[ERROR] Exploration type 'quest' requires --quest <quest-id>.");
  }
  if (args.area) {
    const areaFile = path.join(gameBase, 'scenario', 'areas', `${args.area}.md`);
    if (!fs.existsSync(areaFile)) {
      throw new Error(
        `[ERROR] Area markdown not found for area_id '${args.area}'. Expected file: ${areaFile}\nCreate the area file or omit --area until it exists.`,
      );
    }
  }
  if (args.quest) {
    const questFile = path.join(gameBase, 'scenario', 'quests', `${args.quest}.md`);
    if (!fs.existsSync(questFile)) {
      throw new Error(
        `[ERROR] Quest markdown not found for quest_id '${args.quest}'. Expected file: ${questFile}\nCreate the quest file or omit --quest until it exists.`,
      );
    }
  }
}

function buildEntry(args: CliArgs, schemaType: SchemaType, logData: ExplorationEntry[]): ExplorationEntry {
  const baseId = args.id || slugify(args.title) || `exp-${Date.now()}`;
  const entryId = ensureUniqueId(baseId, logData);
  let description =
    args.desc ||
    `${args.title} (${args.type}) recently discovered during free exploration. Document notable hooks, motives, and dangers before using in session.`;
  if (description.replace(/\s+/g, ' ').trim().length < 60) {
    description = `${description.trim()} Additional details: note its history, current faction tensions, and rewards to keep the log ≥60 characters.`;
  }

  const entry: ExplorationEntry = {
    id: entryId,
    title: args.title || entryId,
    type: schemaType,
    added_at: new Date().toISOString(),
    origin: args.origin === 'gm-suggested' ? 'gm-suggested' : 'player-request',
    description,
    tags: [],
  };
  if (args.area) entry.area_id = args.area;
  if (args.quest) entry.quest_id = args.quest;

  const providedTags = (args.tags || []).filter(Boolean);
  const autoTagSet = new Set(providedTags);
  const typeTagList = TYPE_AUTO_TAGS[args.type] || TYPE_AUTO_TAGS[schemaType] || [];
  typeTagList.forEach((tag) => autoTagSet.add(tag));
  if (args.area) autoTagSet.add(`area:${args.area}`);
  if (args.quest) autoTagSet.add(`quest:${args.quest}`);
  if (autoTagSet.size === 0) autoTagSet.add('hook');

  const safeTags = Array.from(autoTagSet)
    .map((t) => String(t).trim())
    .filter((t) => t.length >= 2 && t.length <= 32);
  entry.tags = safeTags.length ? safeTags.slice(0, 10) : ['hook'];

  return entry;
}

function updateStatePreview(state: RuntimeState, entryId: string, args: CliArgs): void {
  if (!Array.isArray(state.exploration_log_preview)) {
    state.exploration_log_preview = [];
  }
  if (args.previewMode === 'append') {
    state.exploration_log_preview = [
      ...state.exploration_log_preview.filter((id) => id !== entryId),
      entryId,
    ].slice(-args.previewLimit);
  } else {
    state.exploration_log_preview = [entryId, ...state.exploration_log_preview.filter((id) => id !== entryId)].slice(
      0,
      args.previewLimit,
    );
  }
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  if (!args.title) {
    console.error(
      'Usage: npm run exploration:add -- --title "..." [--game demo] [--type area|quest|event] [--area <area-id>] [--quest <quest-id>] [--origin player-request|gm-suggested] [--desc "..."] [--tags tag1,tag2]',
    );
    process.exit(1);
  }
  if (String(args.title).trim().length < 3) {
    console.error('[ERROR] --title must be at least 3 characters.');
    process.exit(1);
  }
  if (!ALLOWED_TYPES.has(args.type)) {
    console.error(`[ERROR] Unsupported exploration type '${args.type}'. Allowed: ${Array.from(ALLOWED_TYPES).join(', ')}`);
    process.exit(1);
  }
  const schemaType = (LEGACY_TYPE_TO_SCHEMA_TYPE[args.type] || args.type) as SchemaType;
  if (!SCHEMA_TYPES.has(schemaType)) {
    console.error(`[ERROR] Unsupported schema exploration type '${schemaType}'. Allowed: ${Array.from(SCHEMA_TYPES).join(', ')}`);
    process.exit(1);
  }
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }

  try {
    validateArgs(args, schemaType, gameBase);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  const logPath = path.join(gameBase, 'player-data', 'runtime', 'exploration-log.json');
  const statePath = path.join(gameBase, 'player-data', 'runtime', 'state.json');
  let logData: ExplorationEntry[];
  let state: RuntimeState;
  try {
    logData = readJson<ExplorationEntry[]>(logPath, []);
    state = readJson<RuntimeState>(statePath, {});
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
  if (!Array.isArray(logData)) {
    console.error(`[ERROR] Exploration log is not an array: ${logPath}`);
    process.exit(1);
  }

  const entry = buildEntry(args, schemaType, logData);
  logData.push(entry);
  writeJson(logPath, logData);

  if (state && typeof state === 'object') {
    if (!state.exploration_enabled && !(state.exploration && state.exploration.enabled)) {
      state.exploration_enabled = true;
      console.warn('[INFO] exploration_enabled was false/undefined; set to true.');
    }
    updateStatePreview(state, entry.id, args);
    writeJson(statePath, state);
  }

  console.log(`[OK] Added exploration entry '${entry.title}' (${entry.id}) → ${logPath}`);
}

if (require.main === module) {
  main();
}

export { readJson, writeJson };
