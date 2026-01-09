import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { resolveCapabilitiesFile, resolveScenarioIndex } from '../utils/manifest';
import type { Issue } from '../types';
import type { RuntimeState } from '../../types/runtime-state';
import type { ExplorationLogEntry } from '../../types/exploration-log';

type ExplorationSchemaType = 'area' | 'quest' | 'event';

const SCHEMA_EXPLORATION_TYPES = new Set<ExplorationSchemaType>(['area', 'quest', 'event']);
const BELINTASH_CONTENT_SET_ID = 'belintash-crack';
const BELINTASH_REQUIRED_FILES = [
  'SCENARIOS/DLC/01-belintash-crack/index.md',
  'SCENARIOS/DLC/01-belintash-crack/dlc-bc-01-stabilize.md',
  'SCENARIOS/DLC/01-belintash-crack/dlc-bc-02-rescue.md',
  'SCENARIOS/DLC/01-belintash-crack/dlc-bc-03-shattered-vision.md',
  'CONFIG/belintash-crack.capabilities.json',
];
const NEXT_GUARDIANS_CONTENT_SET_ID = 'next-guardians';
const NEXT_GUARDIANS_REQUIRED_FILES = [
  'SCENARIOS/DLC/02-next-guardians/index.md',
  'SCENARIOS/DLC/02-next-guardians/dlc-ng-01-initiation.md',
  'SCENARIOS/DLC/02-next-guardians/dlc-ng-02-built-citadel.md',
  'SCENARIOS/DLC/02-next-guardians/dlc-ng-03-legacy-trials.md',
  'CONFIG/next-guardians.capabilities.json',
];
const BALKAN_TRAIL_CONTENT_SET_ID = 'balkan-trail';
const BALKAN_TRAIL_REQUIRED_FILES = [
  'SCENARIOS/DLC/03-balkan-trail/index.md',
  'SCENARIOS/DLC/03-balkan-trail/dlc-bt-01-map-of-light.md',
  'SCENARIOS/DLC/03-balkan-trail/dlc-bt-02-guardians-pass.md',
  'SCENARIOS/DLC/03-balkan-trail/dlc-bt-03-beam-over-salonika.md',
  'CONFIG/balkan-trail.capabilities.json',
];
const LAUT_STRONGHOLD_DEP_CODES = {
  balkanManifest: 'CONTENT-SET-LAUT-REQUIRES-BALKAN',
  guardiansManifest: 'CONTENT-SET-LAUT-REQUIRES-GUARDIANS',
  trailsResolution: 'CONTENT-SET-LAUT-TRAILS',
  guardianStructures: 'CONTENT-SET-LAUT-GUARDIANS',
};
const LAUT_STRONGHOLD_CONTENT_SET_ID = 'laut-stronghold';
const LAUT_STRONGHOLD_REQUIRED_FILES = [
  'SCENARIOS/DLC/04-laut-stronghold/index.md',
  'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-01-shadows.md',
  'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-02-three-walls.md',
  'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-03-oath.md',
  'CONFIG/laut-stronghold.capabilities.json',
];
const STATE_FILE_REL = 'player-data/runtime/state.json';
const CONTENT_SET_STATE_BLOCK_CODE = 'CONTENT-SET-STATE-BLOCK';
const LEGACY_TYPE_TO_SCHEMA_TYPE: Record<string, ExplorationSchemaType> = {
  city: 'area',
  landmark: 'area',
  dungeon: 'area',
  poi: 'area',
  mcp: 'event',
  'side-quest-hook': 'event',
};

interface CheckContext {
  base: string;
  issues: Issue[];
}

function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function hasTag(tags: unknown, expected: string): boolean {
  if (!Array.isArray(tags)) return false;
  const normalized = expected.trim().toLowerCase();
  return tags.some((tag) => typeof tag === 'string' && tag.trim().toLowerCase() === normalized);
}

function ensureContentSetAssets(base: string, files: string[], code: string, label: string, issues: Issue[]): void {
  files.forEach((relPath) => {
    const abs = path.join(base, relPath);
    if (!exists(abs)) {
      add(
        issues,
        'ERROR',
        code,
        relPath,
        `${label} requires file '${relPath}', but it was not found.`,
        'Create the file or update manifest content set paths.',
      );
    }
  });
}

type FieldType = 'number' | 'string' | 'array' | 'object';

interface StateFieldRule {
  type: FieldType;
  min?: number;
  max?: number;
  enum?: string[];
  itemType?: 'string' | 'number' | 'object';
  objectShape?: Record<string, StateFieldRule>;
}

interface ContentSetStateRule {
  code: string;
  label: string;
  requiredFields: string[];
  fields: Record<string, StateFieldRule>;
}

const CONTENT_SET_STATE_RULES: Record<string, ContentSetStateRule> = {
  [BELINTASH_CONTENT_SET_ID]: {
    code: 'CONTENT-SET-BELINTASH-STATE',
    label: 'Belintash DLC state',
    requiredFields: ['collapse_stage', 'rescued_archivists', 'hazard_timer'],
    fields: {
      collapse_stage: { type: 'number', min: 0, max: 5 },
      rescued_archivists: { type: 'number', min: 0, max: 20 },
      hazard_timer: { type: 'string', enum: ['stable', 'ticking', 'spike'] },
      support_nodes: { type: 'array', itemType: 'string' },
      notes: { type: 'string' },
    },
  },
  [NEXT_GUARDIANS_CONTENT_SET_ID]: {
    code: 'CONTENT-SET-NEXT-GUARDIANS-STATE',
    label: 'Next Guardians DLC state',
    requiredFields: ['legacy_rank', 'town_morale', 'heir_alignment', 'structures'],
    fields: {
      legacy_rank: { type: 'number', min: 0, max: 5 },
      town_morale: { type: 'number', min: 0, max: 100 },
      heir_alignment: { type: 'string', enum: ['wind', 'earth', 'idealistic', 'pragmatic', 'neutral'] },
      structures: { type: 'array', itemType: 'string' },
      trials_result: { type: 'string', enum: ['victory', 'alliance', 'evacuated'] },
    },
  },
  [BALKAN_TRAIL_CONTENT_SET_ID]: {
    code: 'CONTENT-SET-BALKAN-STATE',
    label: 'Balkan Trail DLC state',
    requiredFields: ['expedition_stage', 'convoy_morale', 'supply_tokens', 'alliance_track', 'artifact_clues'],
    fields: {
      expedition_stage: { type: 'string', enum: ['planning', 'underway', 'finale', 'complete'] },
      convoy_morale: { type: 'number', min: 0, max: 100 },
      supply_tokens: { type: 'number', min: 0, max: 6 },
      alliance_track: {
        type: 'object',
        objectShape: {
          byzantine: { type: 'number', min: -5, max: 5 },
          latin: { type: 'number', min: -5, max: 5 },
          voinuk: { type: 'number', min: -5, max: 5 },
        },
      },
      artifact_clues: { type: 'array', itemType: 'string' },
      trail_notes: { type: 'array', itemType: 'string' },
      trails_resolution: {
        type: 'string',
        enum: ['byzantine', 'latin', 'voinuk', 'solo', 'split', 'unknown'],
      },
    },
  },
  [LAUT_STRONGHOLD_CONTENT_SET_ID]: {
    code: 'CONTENT-SET-LAUT-STATE',
    label: 'Laut Stronghold DLC state',
    requiredFields: [
      'defense_phase',
      'stronghold_integrity',
      'ward_power',
      'woinuk_morale',
      'espionage_alert',
      'hazard_tokens',
      'safehouses',
      'artifact_insight',
      'oath_resolution',
    ],
    fields: {
      defense_phase: { type: 'string', enum: ['scouting', 'siege', 'aftermath'] },
      stronghold_integrity: { type: 'number', min: 0, max: 100 },
      ward_power: { type: 'number', min: 0, max: 5 },
      woinuk_morale: { type: 'number', min: 0, max: 100 },
      espionage_alert: { type: 'number', min: 0, max: 5 },
      hazard_tokens: { type: 'number', min: 0, max: 5 },
      safehouses: { type: 'array', itemType: 'string' },
      artifact_insight: { type: 'array', itemType: 'string' },
      oath_resolution: { type: 'string', enum: ['ward', 'evacuation', 'betrayal', 'undecided'] },
      notes: { type: 'string' },
    },
  },
};

function describeRule(rule: StateFieldRule): string {
  if (rule.enum) {
    return `Expected one of: ${rule.enum.join(', ')}`;
  }
  if (rule.type === 'number' && (rule.min !== undefined || rule.max !== undefined)) {
    const minPart = rule.min !== undefined ? `min ${rule.min}` : '';
    const maxPart = rule.max !== undefined ? `max ${rule.max}` : '';
    return `Range ${[minPart, maxPart].filter(Boolean).join(' / ')}`.trim();
  }
  if (rule.type === 'array' && rule.itemType) {
    return `Array of ${rule.itemType}`;
  }
  return `Expected ${rule.type}`;
}

function extractContentSetState(entry: unknown): { state: Record<string, unknown> | null; missingWrapper: boolean } {
  if (!entry || typeof entry !== 'object') {
    return { state: null, missingWrapper: false };
  }
  const cast = entry as Record<string, unknown>;
  const nested = cast.state;
  if (nested && typeof nested === 'object') {
    return { state: nested as Record<string, unknown>, missingWrapper: false };
  }
  return { state: cast, missingWrapper: true };
}

function ensureContentSetStateShape(
  contentSetsNode: unknown,
  setId: string,
  hasContentSet: boolean,
  rule: ContentSetStateRule,
  issues: Issue[],
): void {
  if (!hasContentSet) return;
  if (!contentSetsNode || typeof contentSetsNode !== 'object') {
    add(
      issues,
      'ERROR',
      rule.code,
      STATE_FILE_REL,
      `Runtime state is missing 'content_sets' object for ${setId}.`,
      'Add content_sets entry for each manifest content set.',
    );
    return;
  }
  const entry = (contentSetsNode as Record<string, unknown>)[setId];
  if (!entry || typeof entry !== 'object') {
    add(
      issues,
      'ERROR',
      rule.code,
      STATE_FILE_REL,
      `Runtime state missing content_sets['${setId}'] block.`,
      'Add runtime state snapshot for the content set.',
    );
    return;
  }

  const { state, missingWrapper } = extractContentSetState(entry);
  if (!state) {
    add(
      issues,
      'ERROR',
      rule.code,
      STATE_FILE_REL,
      `Runtime state for '${setId}' is not an object.`,
      'Ensure content_sets entries are objects with state fields.',
    );
    return;
  }

  if (missingWrapper) {
    add(
      issues,
      'WARN',
      CONTENT_SET_STATE_BLOCK_CODE,
      STATE_FILE_REL,
      `content_sets['${setId}'] should use a nested "state" object for DLC progress.`,
      'Wrap DLC-specific progress inside a "state" object to avoid collisions.',
    );
  }

  rule.requiredFields.forEach((field) => {
    if (!(field in state)) {
      add(
        issues,
        'ERROR',
        rule.code,
        STATE_FILE_REL,
        `${rule.label} is missing required field '${field}'.`,
        `Populate '${field}' in player-data/runtime/state.json for ${setId}.`,
      );
    }
  });

  Object.entries(rule.fields).forEach(([field, fieldRule]) => {
    if (!(field in state)) return;
    const value = state[field];
    if (value === null || value === undefined) {
      add(
        issues,
        'ERROR',
        rule.code,
        STATE_FILE_REL,
        `${rule.label} field '${field}' is empty.`,
        `Provide a value matching schema: ${describeRule(fieldRule)}.`,
      );
      return;
    }
    switch (fieldRule.type) {
      case 'number': {
        if (typeof value !== 'number') {
          add(
            issues,
            'ERROR',
            rule.code,
            STATE_FILE_REL,
            `${rule.label} field '${field}' must be a number.`,
            describeRule(fieldRule),
          );
          break;
        }
        if ((fieldRule.min !== undefined && value < fieldRule.min) || (fieldRule.max !== undefined && value > fieldRule.max)) {
          add(
            issues,
            'ERROR',
            rule.code,
            STATE_FILE_REL,
            `${rule.label} field '${field}' out of range (value ${value}).`,
            describeRule(fieldRule),
          );
        }
        break;
      }
      case 'string': {
        if (typeof value !== 'string') {
          add(
            issues,
            'ERROR',
            rule.code,
            STATE_FILE_REL,
            `${rule.label} field '${field}' must be a string.`,
            describeRule(fieldRule),
          );
          break;
        }
        if (fieldRule.enum && !fieldRule.enum.includes(value)) {
          add(
            issues,
            'ERROR',
            rule.code,
            STATE_FILE_REL,
            `${rule.label} field '${field}' must be one of: ${fieldRule.enum.join(', ')}.`,
            describeRule(fieldRule),
          );
        }
        break;
      }
      case 'array': {
        if (!Array.isArray(value)) {
          add(
            issues,
            'ERROR',
            rule.code,
            STATE_FILE_REL,
            `${rule.label} field '${field}' must be an array.`,
            describeRule(fieldRule),
          );
          break;
        }
        if (fieldRule.itemType) {
          const invalid = value.find((entryValue) => typeof entryValue !== fieldRule.itemType);
          if (invalid !== undefined) {
            add(
              issues,
              'ERROR',
              rule.code,
              STATE_FILE_REL,
              `${rule.label} field '${field}' should contain only ${fieldRule.itemType} values.`,
              'Remove or convert invalid entries.',
            );
          }
        }
        break;
      }
      default:
        break;
    }
  });
}

function getContentSetState(runtimeState: RuntimeState | null, setId: string): Record<string, unknown> | null {
  const entry = runtimeState?.content_sets?.[setId];
  if (!entry || typeof entry !== 'object') return null;
  const { state } = extractContentSetState(entry);
  return state;
}

const PIVOTAL_STRUCTURES = new Set(['tower', 'library', 'ward']);

function ensureLautDependencies(
  runtimeState: RuntimeState | null,
  opts: { hasLaut: boolean; hasBalkan: boolean; hasNextGuardians: boolean },
  issues: Issue[],
): void {
  if (!opts.hasLaut) return;

  if (!opts.hasBalkan) {
    add(
      issues,
      'WARN',
      LAUT_STRONGHOLD_DEP_CODES.balkanManifest,
      'manifest/entry.json',
      'Content set "laut-stronghold" depends on Balkan Trail finale (trails_resolution) but Balkan Trail is not present in manifest.',
      'Add Balkan Trail content set or remove the dependency note from Laut Stronghold.',
    );
  }

  if (!opts.hasNextGuardians) {
    add(
      issues,
      'WARN',
      LAUT_STRONGHOLD_DEP_CODES.guardiansManifest,
      'manifest/entry.json',
      'Content set "laut-stronghold" expects Next Guardians state (structures/trials_result) but the content set is missing from manifest.',
      'Add Next Guardians content set or adjust Laut Stronghold requirements.',
    );
  }

  if (!runtimeState) return;

  if (opts.hasBalkan) {
    const balkanState = getContentSetState(runtimeState, BALKAN_TRAIL_CONTENT_SET_ID);
    if (balkanState) {
      const trailsResolution = balkanState.trails_resolution;
      const unresolved =
        trailsResolution === null ||
        trailsResolution === undefined ||
        (typeof trailsResolution === 'string' && (!trailsResolution.trim() || trailsResolution === 'unknown'));
      if (unresolved) {
        add(
          issues,
          'WARN',
          LAUT_STRONGHOLD_DEP_CODES.trailsResolution,
          STATE_FILE_REL,
          'Laut Stronghold requires Balkan Trail "trails_resolution" to be resolved (byzantine/latin/voinuk/solo/split).',
          'Complete Balkan Trail finale and set trails_resolution before enabling Laut Stronghold.',
        );
      }
    }
  }

  if (opts.hasNextGuardians) {
    const guardiansState = getContentSetState(runtimeState, NEXT_GUARDIANS_CONTENT_SET_ID);
    if (guardiansState) {
      const structures = guardiansState.structures;
      const hasKeyStructure =
        Array.isArray(structures) && structures.some((entry) => typeof entry === 'string' && PIVOTAL_STRUCTURES.has(entry));
      const trialsResult = guardiansState.trials_result;
      const missingTrialsResult = typeof trialsResult !== 'string' || !trialsResult.trim();
      if (!hasKeyStructure || missingTrialsResult) {
        const missingParts = [];
        if (!hasKeyStructure) missingParts.push('tower/library/ward structure');
        if (missingTrialsResult) missingParts.push('trials_result outcome');
        add(
          issues,
          'WARN',
          LAUT_STRONGHOLD_DEP_CODES.guardianStructures,
          STATE_FILE_REL,
          `Laut Stronghold expects Next Guardians state to export ${missingParts.join(' and ')}.`,
          'Record which structures survived and the trials_result before enabling Laut Stronghold.',
        );
      }
    }
  }
}

export async function checkRequiredFiles(ctx: CheckContext): Promise<void> {
  const { base, issues } = ctx;
  const scenarioIndex = resolveScenarioIndex(base, issues);
  const capabilitiesFile = resolveCapabilitiesFile(base, issues);

  const required = [
    'manifest/entry.json',
    scenarioIndex,
    'scenario/quests/available.json',
    'scenario/quests/unlock-triggers.json',
    'player-data/runtime/state.json',
    'player-data/runtime/completed-quests.json',
  ];

  if (capabilitiesFile) {
    required.push(capabilitiesFile);
  }

  const manifestPath = path.join(base, 'manifest/entry.json');
  let manifestData: Record<string, unknown> | null = null;
  let hasBelintashContentSet = false;
  let hasNextGuardiansContentSet = false;
  let hasBalkanTrailContentSet = false;
  let hasLautStrongholdContentSet = false;
  if (exists(manifestPath)) {
    manifestData = loadData(manifestPath, issues) as Record<string, unknown> | null;
    if (manifestData && typeof manifestData === 'object') {
      ['id', 'title', 'version'].forEach((field) => {
        if (!manifestData?.[field]) {
          add(issues, 'WARN', 'MANIFEST-FIELD', 'manifest/entry.json', `Missing '${field}'`, 'Add required manifest fields');
        }
      });
      const contentSets = Array.isArray(manifestData.content_sets)
        ? (manifestData.content_sets as Record<string, unknown>[])
        : [];
      contentSets.forEach((set) => {
        if (typeof set !== 'object' || set === null) return;
        const id = (set as { id?: unknown }).id;
        if (typeof id === 'string' && id.trim()) {
          if (id === BELINTASH_CONTENT_SET_ID) hasBelintashContentSet = true;
          if (id === NEXT_GUARDIANS_CONTENT_SET_ID) hasNextGuardiansContentSet = true;
          if (id === BALKAN_TRAIL_CONTENT_SET_ID) hasBalkanTrailContentSet = true;
          if (id === LAUT_STRONGHOLD_CONTENT_SET_ID) hasLautStrongholdContentSet = true;
        }
      });
    }
  }

  const defaultWorldIndex = 'scenario/world/index.md';
  let worldIndex = defaultWorldIndex;
  let worldPointerSource: 'manifest' | 'default' = 'default';
  if (manifestData && typeof manifestData === 'object') {
    const manifestWorld = manifestData.world_index;
    if (typeof manifestWorld === 'string' && manifestWorld.trim().length > 0) {
      worldIndex = manifestWorld;
      worldPointerSource = 'manifest';
    }
  }
  const worldPath = path.join(base, worldIndex);
  if (exists(worldPath)) {
    const content = fs.readFileSync(worldPath, 'utf8');
    const trimmed = content.trim();
    if (!trimmed) {
      add(issues, 'WARN', 'WORLD-FRAME-EMPTY', worldIndex, 'World frame file is empty', 'Add setting overview, themes, tone');
    } else {
      if (!/^#\s+.+/m.test(content)) {
        add(
          issues,
          'WARN',
          'WORLD-FRAME-HEADING',
          worldIndex,
          'World frame file is missing an H1 heading',
          'Start the file with "# <World Name>"',
        );
      }
      const normalizedLength = trimmed.replace(/\s+/g, ' ').length;
      if (normalizedLength < 120) {
        add(
          issues,
          'WARN',
          'WORLD-FRAME-SHORT',
          worldIndex,
          'World frame content is very short',
          'Describe the epoch, scope, factions, or tone in more detail (≥120 chars)',
        );
      }
    }
  } else if (worldPointerSource === 'manifest') {
    add(
      issues,
      'ERROR',
      'WORLD-FRAME-MISSING',
      worldIndex,
      'Manifest world_index points to a missing file',
      'Create the referenced world frame markdown file',
    );
  }

  required.forEach((relPath) => {
    const fp = path.join(base, relPath);
    if (!exists(fp)) {
      add(issues, 'ERROR', 'FILE-MISSING', relPath, 'Missing required file', 'Create file or fix path');
    }
  });

  if (hasBelintashContentSet) {
    ensureContentSetAssets(
      base,
      BELINTASH_REQUIRED_FILES,
      'CONTENT-SET-BELINTASH-FILE',
      'Belintash DLC',
      issues,
    );
  }

  if (hasNextGuardiansContentSet) {
    ensureContentSetAssets(
      base,
      NEXT_GUARDIANS_REQUIRED_FILES,
      'CONTENT-SET-NEXT-GUARDIANS-FILE',
      'Next Guardians DLC',
      issues,
    );
  }

  if (hasBalkanTrailContentSet) {
    ensureContentSetAssets(
      base,
      BALKAN_TRAIL_REQUIRED_FILES,
      'CONTENT-SET-BALKAN-TRAIL-FILE',
      'Balkan Trail DLC',
      issues,
    );
  }

  if (hasLautStrongholdContentSet) {
    ensureContentSetAssets(
      base,
      LAUT_STRONGHOLD_REQUIRED_FILES,
      'CONTENT-SET-LAUT-FILE',
      'Laut Stronghold DLC',
      issues,
    );
  }

  const indexPath = path.join(base, scenarioIndex);
  if (exists(indexPath)) {
    const stat = fs.statSync(indexPath);
    if (stat.size === 0) {
      add(issues, 'WARN', 'INDEX-EMPTY', scenarioIndex, 'Scenario index is empty', 'Add intro/summary');
    } else {
      const content = fs.readFileSync(indexPath, 'utf8').trim();
      if (content.length < 40) {
        add(
          issues,
          'WARN',
          'INDEX-SHORT',
          scenarioIndex,
          'Scenario index is very short',
          'Expand with overview and starting hook',
        );
      }
    }
  }

  const statePath = path.join(base, 'player-data/runtime/state.json');

  const questIds = new Set<string>();
  const questMarkdownIds = new Set<string>();
  const questsDir = path.join(base, 'scenario/quests');
  const availablePath = path.join(base, 'scenario/quests/available.json');
  if (exists(availablePath)) {
    const availableData = loadData(availablePath, issues);
    if (Array.isArray(availableData)) {
      availableData.forEach((entry, idx) => {
        if (entry && typeof entry === 'object' && typeof (entry as { quest_id?: unknown }).quest_id === 'string') {
          questIds.add((entry as { quest_id: string }).quest_id.trim());
        } else {
          add(
            issues,
            'WARN',
            'QUEST-ENTRY',
            'scenario/quests/available.json',
            `Entry #${idx + 1} is missing quest_id`,
            'Each quest requires quest_id/title',
          );
        }
      });
    } else if (availableData && typeof availableData === 'object') {
      Object.entries(availableData).forEach(([questId, title]) => {
        if (typeof questId === 'string' && questId.trim()) {
          questIds.add(questId.trim());
        }
        if (typeof title !== 'string' || !title.trim()) {
          add(
            issues,
            'WARN',
            'QUEST-ENTRY',
            'scenario/quests/available.json',
            `Quest '${questId}' is missing a valid title`,
            'Ensure quest title is a non-empty string',
          );
        }
      });
    }
  }
  if (exists(questsDir)) {
    fs.readdirSync(questsDir)
      .filter((file) => file.endsWith('.md'))
      .forEach((file) => questMarkdownIds.add(path.basename(file, '.md')));
  }

  let runtimeState: RuntimeState | null = null;

  if (exists(statePath)) {
    runtimeState = loadData(statePath, issues) as RuntimeState | null;
    const state = runtimeState;
    const explorationEnabled =
      !!state &&
      (state.exploration_enabled === true || (state.exploration && state.exploration.enabled === true));
    const expl = path.join(base, 'player-data/runtime/exploration-log.json');

    if (explorationEnabled && !exists(expl)) {
      add(
        issues,
        'ERROR',
        'EXPLORATION-LOG-MISSING',
        'player-data/runtime/exploration-log.json',
        'Exploration log missing (required when exploration is enabled)',
        'Create player-data/runtime/exploration-log.json (use [] or array of entries)',
      );
    }

    if (exists(expl)) {
      const explData = loadData(expl, issues) as ExplorationLogEntry[] | null;
      if (explData && !Array.isArray(explData)) {
        add(
          issues,
          'WARN',
          'FILE-TYPE',
          'player-data/runtime/exploration-log.json',
          'Exploration log should be an array',
          'Use [] or array of entries',
        );
      } else if (explorationEnabled && Array.isArray(explData) && explData.length === 0) {
        add(
          issues,
          'WARN',
          'EXPLORATION-EMPTY',
          'player-data/runtime/exploration-log.json',
          'Exploration enabled but log is empty',
          'Add entries when exploration occurs or disable exploration',
        );
      } else if (Array.isArray(explData)) {
        const seenIds = new Set<string>();
        const seenTitles = new Set<string>();
        const entryIdSet = new Set<string>();

        explData.forEach((entry, idx) => {
          if (!entry || typeof entry !== 'object') return;
          const castEntry = entry as ExplorationLogEntry & { area_id?: string; quest_id?: string; type?: string; tags?: string[] };
          const normalizedId = typeof castEntry.id === 'string' ? castEntry.id : undefined;
          if (normalizedId) {
            if (seenIds.has(normalizedId)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-DUPLICATE-ID',
                'player-data/runtime/exploration-log.json',
                `Duplicate exploration id '${normalizedId}' (index ${idx})`,
                'Use unique ids for each entry',
              );
            } else {
              seenIds.add(normalizedId);
              entryIdSet.add(normalizedId);
            }
          }
          if (castEntry.title) {
            if (seenTitles.has(castEntry.title)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-DUPLICATE-TITLE',
                'player-data/runtime/exploration-log.json',
                `Duplicate exploration title '${castEntry.title}' (index ${idx})`,
                'Use unique titles for each entry',
              );
            } else {
              seenTitles.add(castEntry.title);
            }
          }
          const rawType = typeof castEntry.type === 'string' ? castEntry.type.trim() : '';
          let schemaType: ExplorationSchemaType | null = null;
          if (SCHEMA_EXPLORATION_TYPES.has(rawType as ExplorationSchemaType)) {
            schemaType = rawType as ExplorationSchemaType;
          } else if (rawType && LEGACY_TYPE_TO_SCHEMA_TYPE[rawType]) {
            schemaType = LEGACY_TYPE_TO_SCHEMA_TYPE[rawType];
            add(
              issues,
              'WARN',
              'EXPLORATION-TYPE-LEGACY',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' uses legacy type '${rawType}', migrate to '${schemaType}'`,
              'Update exploration entry type to area|quest|event',
            );
          } else {
            add(
              issues,
              'ERROR',
              'EXPLORATION-TYPE-UNKNOWN',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' has unsupported type '${rawType || '<empty>'}'`,
              'Use type area|quest|event',
            );
            return;
          }
          const areaId = typeof castEntry.area_id === 'string' ? castEntry.area_id.trim() : '';
          if (schemaType === 'area' && !areaId) {
            add(
              issues,
              'ERROR',
              'EXPLORATION-AREA-ID',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' missing area_id for area type`,
              'Populate area_id for area entries',
            );
          }
          if (areaId) {
            const areaFile = path.join(base, 'scenario/areas', `${areaId}.md`);
            if (!exists(areaFile)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-AREA-MISSING',
                'player-data/runtime/exploration-log.json',
                `Entry '${castEntry.title || castEntry.id}' references missing area '${areaId}'`,
                'Create scenario/areas file or update area_id',
              );
            } else if (!hasTag(castEntry.tags, `area:${areaId}`)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-TAG-AREA',
                'player-data/runtime/exploration-log.json',
                `Entry '${castEntry.title || normalizedId || `index ${idx}`}' should include tag 'area:${areaId}'`,
                'Tag entries with area:<id> to satisfy guardrails',
              );
            }
          }
          const questId = typeof castEntry.quest_id === 'string' ? castEntry.quest_id.trim() : '';
          if (schemaType === 'quest' && !questId) {
            add(
              issues,
              'ERROR',
              'EXPLORATION-QUEST-ID',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' missing quest_id for quest type`,
              'Populate quest_id referencing scenario/quests',
            );
          }
          if (questId && !questIds.has(questId)) {
            add(
              issues,
              'WARN',
              'EXPLORATION-QUEST-UNKNOWN',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' references unknown quest '${questId}'`,
              'Add quest to scenario/quests/available.json',
            );
          }
          if (questId && !questMarkdownIds.has(questId)) {
            add(
              issues,
              'WARN',
              'EXPLORATION-QUEST-FILE',
              `scenario/quests/${questId}.md`,
              `Quest file missing for quest '${questId}' referenced by exploration log`,
              'Create quest markdown before tagging exploration entry',
            );
          }
          if (questId && !hasTag(castEntry.tags, `quest:${questId}`)) {
            add(
              issues,
              'WARN',
              'EXPLORATION-TAG-QUEST',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' should include tag 'quest:${questId}'`,
              'Tag entries with quest:<id> for linked quests',
            );
          }
          const description = typeof castEntry.description === 'string' ? castEntry.description.trim() : '';
          if (!description || description.replace(/\s+/g, ' ').length < 60) {
            add(
              issues,
              'WARN',
              'EXPLORATION-DESCRIPTION-SHORT',
              'player-data/runtime/exploration-log.json',
              `Description for '${castEntry.title || normalizedId || `index ${idx}`}' is too short`,
              'Provide ≥60 characters detailing hooks/risks',
            );
          }
          const tagsCount = Array.isArray(castEntry.tags)
            ? castEntry.tags.filter((tag) => typeof tag === 'string' && tag.trim()).length
            : 0;
          if (tagsCount < 1) {
            add(
              issues,
              'WARN',
              'EXPLORATION-TAGS-MIN',
              'player-data/runtime/exploration-log.json',
              `Entry '${castEntry.title || normalizedId || `index ${idx}`}' has no tags`,
              'Add at least one descriptive tag (theme, danger, faction)',
            );
          }
        });

        if (state && Array.isArray(state.exploration_log_preview)) {
          state.exploration_log_preview.forEach((previewId) => {
            if (!entryIdSet.has(previewId)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-PREVIEW-MISMATCH',
                'player-data/runtime/state.json',
                `exploration_log_preview references missing id '${previewId}'`,
                'Update preview list to include only existing exploration ids',
              );
            }
          });
        }
      }
    }
  }

  const manifestContentSetPresence: Record<string, boolean> = {
    [BELINTASH_CONTENT_SET_ID]: hasBelintashContentSet,
    [NEXT_GUARDIANS_CONTENT_SET_ID]: hasNextGuardiansContentSet,
    [BALKAN_TRAIL_CONTENT_SET_ID]: hasBalkanTrailContentSet,
    [LAUT_STRONGHOLD_CONTENT_SET_ID]: hasLautStrongholdContentSet,
  };

  const contentSetsNode = runtimeState?.content_sets ?? null;
  Object.entries(CONTENT_SET_STATE_RULES).forEach(([setId, rule]) => {
    const hasSet = manifestContentSetPresence[setId] === true;
    ensureContentSetStateShape(contentSetsNode, setId, hasSet, rule, issues);
  });

  ensureLautDependencies(
    runtimeState,
    {
      hasLaut: hasLautStrongholdContentSet,
      hasBalkan: hasBalkanTrailContentSet,
      hasNextGuardians: hasNextGuardiansContentSet,
    },
    issues,
  );

  const completedPath = path.join(base, 'player-data/runtime/completed-quests.json');
  if (exists(completedPath)) {
    const completed = loadData(completedPath, issues);
    if (completed && !Array.isArray(completed)) {
      add(
        issues,
        'WARN',
        'FILE-TYPE',
        'player-data/runtime/completed-quests.json',
        'Completed quests should be an array',
        'Use [] or array of {quest_id,title,completed_at}',
      );
    }
  }
}

export default checkRequiredFiles;
