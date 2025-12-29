import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import type { Issue } from '../types';
import type { RuntimeState } from '../../types/runtime-state';
import type { ExplorationLogEntry } from '../../types/exploration-log';

interface CheckContext {
  base: string;
  issues: Issue[];
}

function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export async function checkRequiredFiles(ctx: CheckContext): Promise<void> {
  const { base, issues } = ctx;
  const required = [
    'manifest/entry.json',
    'scenario/index.md',
    'scenario/quests/available.json',
    'scenario/quests/unlock-triggers.json',
    'player-data/runtime/state.json',
    'player-data/runtime/completed-quests.json',
    'config/capabilities.json',
  ];

  required.forEach((relPath) => {
    const fp = path.join(base, relPath);
    if (!exists(fp)) {
      add(issues, 'ERROR', 'FILE-MISSING', relPath, 'Missing required file', 'Create file or fix path');
    }
  });

  const indexPath = path.join(base, 'scenario/index.md');
  if (exists(indexPath)) {
    const stat = fs.statSync(indexPath);
    if (stat.size === 0) {
      add(issues, 'WARN', 'INDEX-EMPTY', 'scenario/index.md', 'Scenario index is empty', 'Add intro/summary');
    } else {
      const content = fs.readFileSync(indexPath, 'utf8').trim();
      if (content.length < 40) {
        add(issues, 'WARN', 'INDEX-SHORT', 'scenario/index.md', 'Scenario index is very short', 'Expand with overview and starting hook');
      }
    }
  }

  const statePath = path.join(base, 'player-data/runtime/state.json');
  const manifestPath = path.join(base, 'manifest/entry.json');

  if (exists(manifestPath)) {
    const manifest = loadData(manifestPath, issues) as Record<string, unknown> | null;
    if (manifest && typeof manifest === 'object') {
      ['id', 'title', 'version'].forEach((field) => {
        if (!manifest[field]) {
          add(issues, 'WARN', 'MANIFEST-FIELD', 'manifest/entry.json', `Missing '${field}'`, 'Add required manifest fields');
        }
      });
    }
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
          if (entry.id) {
            if (seenIds.has(entry.id)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-DUPLICATE-ID',
                'player-data/runtime/exploration-log.json',
                `Duplicate exploration id '${entry.id}' (index ${idx})`,
                'Use unique ids for each entry',
              );
            } else {
              seenIds.add(entry.id);
              entryIdSet.add(entry.id);
            }
          }
          if (entry.title) {
            if (seenTitles.has(entry.title)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-DUPLICATE-TITLE',
                'player-data/runtime/exploration-log.json',
                `Duplicate exploration title '${entry.title}' (index ${idx})`,
                'Use unique titles for each entry',
              );
            } else {
              seenTitles.add(entry.title);
            }
          }
          if (entry.area_id) {
            const areaFile = path.join(base, 'scenario/areas', `${entry.area_id}.md`);
            if (!exists(areaFile)) {
              add(
                issues,
                'WARN',
                'EXPLORATION-AREA-MISSING',
                'player-data/runtime/exploration-log.json',
                `Entry '${entry.title || entry.id}' references missing area '${entry.area_id}'`,
                'Create scenario/areas file or update area_id',
              );
            }
          }
          const description = typeof entry.description === 'string' ? entry.description.trim() : '';
          if (!description || description.replace(/\s+/g, ' ').length < 60) {
            add(
              issues,
              'WARN',
              'EXPLORATION-DESCRIPTION-SHORT',
              'player-data/runtime/exploration-log.json',
              `Description for '${entry.title || entry.id || `index ${idx}`}' is too short`,
              'Provide ≥60 characters detailing hooks/risks',
            );
          }
          const tagsCount = Array.isArray(entry.tags)
            ? entry.tags.filter((tag) => typeof tag === 'string' && tag.trim()).length
            : 0;
          if (tagsCount < 1) {
            add(
              issues,
              'WARN',
              'EXPLORATION-TAGS-MIN',
              'player-data/runtime/exploration-log.json',
              `Entry '${entry.title || entry.id || `index ${idx}`}' has no tags`,
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
