import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { resolveCapabilitiesFile, resolveScenarioIndex } from '../utils/manifest';
import type { Issue } from '../types';
import type { RuntimeState } from '../../types/runtime-state';
import type { ExplorationLogEntry } from '../../types/exploration-log';

type ExplorationSchemaType = 'area' | 'quest' | 'event';

const SCHEMA_EXPLORATION_TYPES = new Set<ExplorationSchemaType>(['area', 'quest', 'event']);
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
  if (exists(manifestPath)) {
    manifestData = loadData(manifestPath, issues) as Record<string, unknown> | null;
    if (manifestData && typeof manifestData === 'object') {
      ['id', 'title', 'version'].forEach((field) => {
        if (!manifestData?.[field]) {
          add(issues, 'WARN', 'MANIFEST-FIELD', 'manifest/entry.json', `Missing '${field}'`, 'Add required manifest fields');
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

  if (exists(statePath)) {
    const state = loadData(statePath, issues) as RuntimeState | null;
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
          if (questId) {
            if (!questIds.has(questId)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-QUEST-UNKNOWN',
                'player-data/runtime/exploration-log.json',
                `Entry '${castEntry.title || normalizedId || `index ${idx}`}' references unknown quest '${questId}'`,
                'Add quest to scenario/quests/available.json',
              );
            }
            if (!questMarkdownIds.has(questId)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-QUEST-FILE',
                `scenario/quests/${questId}.md`,
                `Quest file missing for quest '${questId}' referenced by exploration log`,
                'Create quest markdown before tagging exploration entry',
              );
            }
            if (!hasTag(castEntry.tags, `quest:${questId}`)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-TAG-QUEST',
                'player-data/runtime/exploration-log.json',
                `Entry '${castEntry.title || normalizedId || `index ${idx}`}' should include tag 'quest:${questId}'`,
                'Tag entries with quest:<id> for linked quests',
              );
            }
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
