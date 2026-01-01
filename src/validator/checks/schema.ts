import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { validateFileWithSchema } from '../utils/schema';
import { resolveCapabilitiesFile } from '../utils/manifest';
import type { Issue } from '../types';
import type { ValidatorContext } from '../context';
import type { RuntimeState } from '../../types/runtime-state';

function isExplorationEnabled(base: string, loadJson?: (filePath: string) => unknown): boolean {
  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return false;

  try {
    const loader =
      typeof loadJson === 'function'
        ? loadJson
        : (filePath: string) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const state = loader(statePath) as RuntimeState | null;
    if (!state || typeof state !== 'object') return false;
    return Boolean(
      state.exploration_enabled === true ||
        (state.exploration && state.exploration.enabled === true),
    );
  } catch {
    return false;
  }
}

const repoSchemasDir = path.resolve(__dirname, '..', '..', '..', 'tools', 'validator', 'schemas');

export async function checkSchemas(ctx: ValidatorContext): Promise<void> {
  const { base, issues, loadJson } = ctx;
  const schemasDir = repoSchemasDir;

  const capabilitiesFile = resolveCapabilitiesFile(base, issues);
  if (capabilitiesFile) {
    validateFileWithSchema(
      base,
      capabilitiesFile,
      path.join(schemasDir, 'capabilities.schema.json'),
      'CAP',
      issues,
    );
  }

  validateFileWithSchema(
    base,
    'manifest/entry.json',
    path.join(schemasDir, 'manifest.entry.schema.json'),
    'MANIFEST',
    issues,
  );

  validateFileWithSchema(
    base,
    'player-data/runtime/state.json',
    path.join(schemasDir, 'state.schema.json'),
    'STATE',
    issues,
  );

  validateFileWithSchema(
    base,
    'player-data/session-init.json',
    path.join(schemasDir, 'session-init.schema.json'),
    'SESSION-INIT',
    issues,
  );

  validateFileWithSchema(
    base,
    'player-data/runtime/exploration-log.json',
    path.join(schemasDir, 'exploration-log.schema.json'),
    'EXPLORATION',
    issues,
    { level: isExplorationEnabled(base, loadJson) ? 'ERROR' : ('WARN' as Issue['level']) },
  );

  validateFileWithSchema(
    base,
    'player-data/runtime/completed-quests.json',
    path.join(schemasDir, 'completed-quests.schema.json'),
    'COMPLETED',
    issues,
  );

  validateFileWithSchema(
    base,
    'player-data/saves/index.json',
    path.join(schemasDir, 'saves.index.schema.json'),
    'SAVES-INDEX',
    issues,
  );

  // Validate individual save files
  const savesIndexPath = path.join(base, 'player-data/saves/index.json');
  if (fs.existsSync(savesIndexPath)) {
    const savesIndex = loadData(savesIndexPath, issues) as unknown[] | null;
    if (Array.isArray(savesIndex)) {
      savesIndex.forEach((saveEntry, idx) => {
        if (typeof saveEntry === 'object' && saveEntry && 'file_path' in saveEntry) {
          const filePath = String(saveEntry.file_path);
          const fullPath = path.join(base, filePath);
          if (!fs.existsSync(fullPath)) {
            add(issues, 'ERROR', 'SAVE-FILE-MISSING', `player-data/saves/index.json`, `Save file '${filePath}' does not exist (entry ${idx})`, 'Create save file or fix file_path');
          } else {
            validateFileWithSchema(
              base,
              filePath,
              path.join(schemasDir, 'saves.save.schema.json'),
              'SAVE',
              issues,
            );
          }
        }
      });
    }
  }
}

export default checkSchemas;
