#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import type { RuntimeState } from '../../src/types/runtime-state';
import { buildScaffoldMarkdown } from '../quests/scaffold-quest';
import { createAreaMarkdown } from '../areas/add-area';

const DEFAULT_GAME = 'demo';
const DEFAULT_AREA_ID = 'default-area';

interface CliArgs {
  game: string;
  path: string | null;
}

export interface RemedyOptions {
  base: string;
  logger?: (message: string) => void;
}

export interface RemedyResult {
  createdQuests: string[];
  createdAreas: string[];
  stateUpdated: boolean;
  fallbackAreaId: string | null;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    game: DEFAULT_GAME,
    path: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const nextValue = argv[i + 1];

    switch (flag) {
      case '--game':
      case '-g':
        if (!nextValue || nextValue.startsWith('-')) {
          throw new Error('Flag --game expects a value');
        }
        args.game = nextValue;
        i += 1;
        break;
      case '--path':
      case '-p':
        if (!nextValue || nextValue.startsWith('-')) {
          throw new Error('Flag --path expects a value');
        }
        args.path = nextValue;
        i += 1;
        break;
      default:
        if (flag.startsWith('-')) {
          throw new Error(`Unknown flag: ${flag}`);
        } else {
          throw new Error(`Unexpected argument: ${flag}`);
        }
    }
  }

  return args;
}

function resolveBase(args: CliArgs): string {
  if (args.path && args.path.trim()) {
    return path.resolve(args.path);
  }
  return path.join(__dirname, '..', '..', 'games', args.game);
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureStateFile(base: string): RuntimeState {
  const statePath = path.join(base, 'player-data', 'runtime', 'state.json');
  if (!fs.existsSync(statePath)) {
    throw new Error(`State file not found: ${statePath}`);
  }
  const raw = fs.readFileSync(statePath, 'utf8');
  return JSON.parse(raw) as RuntimeState;
}

function writeState(base: string, state: RuntimeState): void {
  const statePath = path.join(base, 'player-data', 'runtime', 'state.json');
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function createQuestScaffold(
  questId: string,
  questDir: string,
  state: RuntimeState,
  logger: (message: string) => void,
): void {
  ensureDir(questDir);
  const questFile = path.join(questDir, `${questId}.md`);
  if (fs.existsSync(questFile)) return;

  const areaId = typeof state.current_area_id === 'string' && state.current_area_id.trim().length > 0
    ? state.current_area_id
    : DEFAULT_AREA_ID;
  const summary = `Auto-remedy scaffold for missing quest '${questId}'. Replace this file with the real quest content.`;
  const markdown = buildScaffoldMarkdown(questId, areaId, summary);
  fs.writeFileSync(questFile, `${markdown}\n`, 'utf8');
  logger(`[QUEST] scaffolded missing quest '${questId}'`);
}

function ensureDefaultArea(areaDir: string, logger: (message: string) => void): boolean {
  const defaultAreaPath = path.join(areaDir, `${DEFAULT_AREA_ID}.md`);
  if (fs.existsSync(defaultAreaPath)) {
    return false;
  }

  ensureDir(areaDir);
  const areaTemplate = createAreaMarkdown({
    game: DEFAULT_GAME,
    id: DEFAULT_AREA_ID,
    title: 'Default Area',
    description: 'Auto-generated placeholder area created by orphan remediation.',
    points: [],
    connections: [],
    notes: [],
    conditions: [],
    threats: [],
  });
  const areaPath = path.join(areaDir, areaTemplate.filePath);
  fs.writeFileSync(areaPath, `${areaTemplate.content}\n`, 'utf8');
  logger('[AREA] scaffolded default-area placeholder');
  return true;
}

export function remedyOrphans(options: RemedyOptions): RemedyResult {
  const { base } = options;
  const logger = options.logger ?? (() => {});

  if (!fs.existsSync(base)) {
    throw new Error(`Game folder not found: ${base}`);
  }

  const result: RemedyResult = {
    createdQuests: [],
    createdAreas: [],
    stateUpdated: false,
    fallbackAreaId: null,
  };

  const state = ensureStateFile(base);
  const questDir = path.join(base, 'scenario', 'quests');
  const areaDir = path.join(base, 'scenario', 'areas');

  const activeQuests = Array.isArray(state.active_quests) ? state.active_quests : [];
  activeQuests.forEach((quest) => {
    const questId = quest?.quest_id?.trim();
    if (!questId) return;
    const questFile = path.join(questDir, `${questId}.md`);
    if (fs.existsSync(questFile)) return;
    createQuestScaffold(questId, questDir, state, logger);
    result.createdQuests.push(questId);
  });

  const areaId = typeof state.current_area_id === 'string' ? state.current_area_id.trim() : '';
  if (areaId) {
    const areaPath = path.join(areaDir, `${areaId}.md`);
    if (!fs.existsSync(areaPath)) {
      const createdDefault = ensureDefaultArea(areaDir, logger);
      if (createdDefault) {
        result.createdAreas.push(DEFAULT_AREA_ID);
      }
      state.current_area_id = DEFAULT_AREA_ID;
      result.stateUpdated = true;
      result.fallbackAreaId = DEFAULT_AREA_ID;
      logger(`[AREA] current_area_id fallback to '${DEFAULT_AREA_ID}'`);
    }
  }

  if (result.stateUpdated) {
    writeState(base, state);
  } else if (!fs.existsSync(path.join(base, 'player-data', 'runtime', 'state.json'))) {
    // Safety net (should never happen because ensureStateFile throws earlier)
    throw new Error('State file disappeared during remediation.');
  }

  return result;
}

export function main(argv: string[] = process.argv): void {
  try {
    const args = parseArgs(argv);
    const base = resolveBase(args);
    const result = remedyOrphans({ base, logger: (msg) => console.log(msg) });

    if (!result.createdQuests.length && !result.stateUpdated) {
      console.log('No orphan quests or areas detected. Nothing to remediate.');
      return;
    }

    if (result.createdQuests.length) {
      console.log(`Created quest scaffolds: ${result.createdQuests.join(', ')}`);
    }
    if (result.createdAreas.length) {
      console.log(`Created area scaffolds: ${result.createdAreas.join(', ')}`);
    }
    if (result.stateUpdated && result.fallbackAreaId) {
      console.log(`Updated state current_area_id → ${result.fallbackAreaId}`);
    }
  } catch (err) {
    const e = err as Error;
    console.error('[ERROR][REMEDY]', e.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
