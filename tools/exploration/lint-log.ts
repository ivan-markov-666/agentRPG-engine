#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

type IssueLevel = 'ERROR' | 'WARN';

interface Issue {
  level: IssueLevel;
  code: string;
  message: string;
  file?: string;
  entryId?: string;
}

interface CliArgs {
  dir: string;
  strict: boolean;
  game?: string | null;
}

interface ExplorationEntry {
  id?: string;
  type?: string;
  area_id?: string;
  quest_id?: string;
  tags?: unknown;
  [key: string]: unknown;
}

interface ScenarioContext {
  areaIds: Set<string>;
  questIds: Set<string>;
  questFiles: Set<string>;
}

const SCHEMA_TYPES = new Set(['area', 'quest', 'event'] as const);
const LEGACY_TYPE_TO_SCHEMA_TYPE: Record<string, (typeof SCHEMA_TYPES extends Set<infer T> ? T : never) | 'event'> = {
  city: 'area',
  landmark: 'area',
  dungeon: 'area',
  poi: 'area',
  mcp: 'event',
  'side-quest-hook': 'event',
};

function parseArgs(argv: string[]): CliArgs {
  let dir = 'samples/blank-game';
  let strict = false;
  let game: string | null = null;

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--dir':
      case '--path':
        if (next) {
          dir = next;
          i += 1;
        }
        break;
      case '--game':
        if (next) {
          game = next;
          i += 1;
        }
        break;
      case '--strict':
        strict = true;
        break;
      default:
        break;
    }
  }

  return { dir, strict, game };
}

function resolveBaseDir(args: CliArgs): string {
  const repoRoot = path.resolve(__dirname, '..', '..');

  if (args.game) {
    const samplesCandidate = path.resolve(repoRoot, 'samples', args.game);
    if (fs.existsSync(samplesCandidate) && fs.lstatSync(samplesCandidate).isDirectory()) {
      return samplesCandidate;
    }
    const gamesCandidate = path.resolve(repoRoot, 'games', args.game);
    if (fs.existsSync(gamesCandidate) && fs.lstatSync(gamesCandidate).isDirectory()) {
      return gamesCandidate;
    }
    throw new Error(
      `Game '${args.game}' not found under samples/ or games/. Checked:\n- ${samplesCandidate}\n- ${gamesCandidate}`,
    );
  }

  const baseDir = path.resolve(repoRoot, args.dir);
  if (!fs.existsSync(baseDir) || !fs.lstatSync(baseDir).isDirectory()) {
    throw new Error(`Base directory not found: ${baseDir}`);
  }
  return baseDir;
}

function loadJson<T>(filePath: string, fallback: T | null = null): T {
  if (!fs.existsSync(filePath)) {
    if (fallback !== null) return fallback;
    throw new Error(`File not found: ${filePath}`);
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse ${filePath}: ${message}`);
  }
}

function buildScenarioContext(baseDir: string, issues: Issue[]): ScenarioContext {
  const areaIds = new Set<string>();
  const questIds = new Set<string>();
  const questFiles = new Set<string>();

  const areasDir = path.join(baseDir, 'scenario', 'areas');
  if (fs.existsSync(areasDir)) {
    fs.readdirSync(areasDir)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => areaIds.add(path.basename(file, '.md')));
  }

  const questsDir = path.join(baseDir, 'scenario', 'quests');
  if (fs.existsSync(questsDir)) {
    fs.readdirSync(questsDir)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => questFiles.add(path.basename(file, '.md')));
  }

  const availablePath = path.join(questsDir, 'available.json');
  if (fs.existsSync(availablePath)) {
    try {
      const data = loadJson<unknown>(availablePath, []);
      if (Array.isArray(data)) {
        data.forEach((entry, idx) => {
          if (entry && typeof entry === 'object' && typeof (entry as { quest_id?: unknown }).quest_id === 'string') {
            questIds.add((entry as { quest_id: string }).quest_id.trim());
          } else {
            issues.push({
              level: 'WARN',
              code: 'QUEST-ENTRY',
              file: 'scenario/quests/available.json',
              message: `Entry #${idx + 1} missing quest_id`,
            });
          }
        });
      } else if (data && typeof data === 'object') {
        Object.entries(data as Record<string, unknown>).forEach(([questId, title]) => {
          if (typeof questId === 'string' && questId.trim()) {
            questIds.add(questId.trim());
          }
          if (typeof title !== 'string' || !title.trim()) {
            issues.push({
              level: 'WARN',
              code: 'QUEST-ENTRY',
              file: 'scenario/quests/available.json',
              message: `Quest '${questId}' is missing a valid title`,
            });
          }
        });
      } else {
        issues.push({
          level: 'WARN',
          code: 'QUEST-AVAILABLE-FORMAT',
          file: 'scenario/quests/available.json',
          message: 'Expected array or object describing quests',
        });
      }
    } catch (error) {
      issues.push({
        level: 'ERROR',
        code: 'QUEST-AVAILABLE-READ',
        file: 'scenario/quests/available.json',
        message: (error as Error).message,
      });
    }
  }

  return { areaIds, questIds, questFiles };
}

function runSchemaValidation(baseDir: string, logData: unknown, issues: Issue[]): void {
  const schemaPath = path.resolve(__dirname, '..', 'validator', 'schemas', 'exploration-log.schema.json');
  const schema = loadJson<Record<string, unknown>>(schemaPath);
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const ok = validate(logData);
  if (!ok && Array.isArray(validate.errors)) {
    validate.errors.forEach((err) => {
      issues.push({
        level: 'WARN',
        code: 'EXPLORATION-SCHEMA',
        file: path.relative(baseDir, path.join(baseDir, 'player-data/runtime/exploration-log.json')),
        message: `${err.instancePath || '/'} ${err.message || ''}`.trim(),
      });
    });
  }
}

function hasTag(entry: ExplorationEntry, expected: string): boolean {
  if (!Array.isArray(entry.tags)) return false;
  return entry.tags.some(
    (tag) => typeof tag === 'string' && tag.trim().toLowerCase() === expected.toLowerCase(),
  );
}

function lintEntries(
  logData: unknown,
  baseDir: string,
  ctx: ScenarioContext,
  issues: Issue[],
  strict: boolean,
): void {
  if (!Array.isArray(logData)) {
    issues.push({
      level: 'ERROR',
      code: 'EXPLORATION-TYPE',
      file: 'player-data/runtime/exploration-log.json',
      message: 'Exploration log should be an array',
    });
    return;
  }

  logData.forEach((rawEntry, idx) => {
    if (!rawEntry || typeof rawEntry !== 'object') {
      issues.push({
        level: 'ERROR',
        code: 'EXPLORATION-ENTRY',
        file: 'player-data/runtime/exploration-log.json',
        message: `Entry at index ${idx} must be an object`,
      });
      return;
    }

    const entry = rawEntry as ExplorationEntry;
    const entryId = typeof entry.id === 'string' ? entry.id : `index-${idx}`;
    const type = typeof entry.type === 'string' ? entry.type.trim() : '';
    let schemaType: string | null = null;

    if (SCHEMA_TYPES.has(type as typeof SCHEMA_TYPES extends Set<infer T> ? T : never)) {
      schemaType = type;
    } else if (type && LEGACY_TYPE_TO_SCHEMA_TYPE[type]) {
      schemaType = LEGACY_TYPE_TO_SCHEMA_TYPE[type];
      issues.push({
        level: strict ? 'ERROR' : 'WARN',
        code: 'EXPLORATION-TYPE-LEGACY',
        entryId,
        file: 'player-data/runtime/exploration-log.json',
        message: `Entry uses legacy type '${type}' → consider migrating to '${schemaType}'`,
      });
    } else {
      issues.push({
        level: 'ERROR',
        code: 'EXPLORATION-TYPE-UNKNOWN',
        entryId,
        file: 'player-data/runtime/exploration-log.json',
        message: type ? `Unsupported type '${type}'` : 'Missing type field',
      });
      return;
    }

    if (schemaType === 'quest') {
      const questId = typeof entry.quest_id === 'string' ? entry.quest_id.trim() : '';
      if (!questId) {
        issues.push({
          level: 'ERROR',
          code: 'EXPLORATION-QUEST-ID',
          entryId,
          file: 'player-data/runtime/exploration-log.json',
          message: 'Quest entries must include quest_id',
        });
      } else {
        if (!ctx.questIds.has(questId)) {
          issues.push({
            level: 'WARN',
            code: 'EXPLORATION-QUEST-UNKNOWN',
            entryId,
            file: 'player-data/runtime/exploration-log.json',
            message: `Quest '${questId}' not found in scenario/quests/available.json`,
          });
        }
        if (!ctx.questFiles.has(questId)) {
          const questFile = `scenario/quests/${questId}.md`;
          issues.push({
            level: 'WARN',
            code: 'EXPLORATION-QUEST-FILE',
            entryId,
            file: questFile,
            message: `Quest file missing for quest_id '${questId}'`,
          });
        }
        if (!hasTag(entry, `quest:${questId}`)) {
          issues.push({
            level: 'WARN',
            code: 'EXPLORATION-TAG-QUEST',
            entryId,
            file: 'player-data/runtime/exploration-log.json',
            message: `Quest entry should include tag 'quest:${questId}'`,
          });
        }
      }
    }

    if (schemaType === 'area' || typeof entry.area_id === 'string') {
      const areaId = typeof entry.area_id === 'string' ? entry.area_id.trim() : '';
      if (schemaType === 'area' && !areaId) {
        issues.push({
          level: 'ERROR',
          code: 'EXPLORATION-AREA-ID',
          entryId,
          file: 'player-data/runtime/exploration-log.json',
          message: 'Area entries must include area_id',
        });
      } else if (areaId) {
        if (!ctx.areaIds.has(areaId)) {
          const areaFile = `scenario/areas/${areaId}.md`;
          issues.push({
            level: 'WARN',
            code: 'EXPLORATION-AREA-MISSING',
            entryId,
            file: areaFile,
            message: `Area file missing for area_id '${areaId}'`,
          });
        }
        if (!hasTag(entry, `area:${areaId}`)) {
          issues.push({
            level: 'WARN',
            code: 'EXPLORATION-TAG-AREA',
            entryId,
            file: 'player-data/runtime/exploration-log.json',
            message: `Entry should include tag 'area:${areaId}'`,
          });
        }
      }
    }

    if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
      issues.push({
        level: 'WARN',
        code: 'EXPLORATION-TAGS-MIN',
        entryId,
        file: 'player-data/runtime/exploration-log.json',
        message: 'Entry should include at least one tag',
      });
    }
  });
}

function printSummary(issues: Issue[]): void {
  if (issues.length === 0) {
    console.log('[OK] Exploration log looks good.');
    return;
  }

  issues.forEach((issue) => {
    const prefix = `[${issue.level}] ${issue.code}`;
    const location = issue.file ? `${issue.file}${issue.entryId ? ` (${issue.entryId})` : ''}` : issue.entryId || '';
    console.log(`${prefix}${location ? ` :: ${location}` : ''} → ${issue.message}`);
  });

  const errors = issues.filter((issue) => issue.level === 'ERROR').length;
  const warnings = issues.length - errors;
  console.log(`Summary: ${errors} error(s), ${warnings} warning(s)`);
}

async function main() {
  try {
    const args = parseArgs(process.argv);
    const baseDir = resolveBaseDir(args);
    const logPath = path.join(baseDir, 'player-data', 'runtime', 'exploration-log.json');
    const logData = loadJson<unknown>(logPath, []);

    const issues: Issue[] = [];
    runSchemaValidation(baseDir, logData, issues);
    const scenarioCtx = buildScenarioContext(baseDir, issues);
    lintEntries(logData, baseDir, scenarioCtx, issues, args.strict);
    printSummary(issues);
    const hasErrors = issues.some((issue) => issue.level === 'ERROR');
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[ERROR]', message);
    process.exit(1);
  }
}

void main();
