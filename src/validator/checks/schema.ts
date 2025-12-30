import fs from 'fs';
import path from 'path';

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
}

export default checkSchemas;
