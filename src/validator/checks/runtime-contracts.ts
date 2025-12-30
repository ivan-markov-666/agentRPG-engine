import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { validateFileWithSchema } from '../utils/schema';
import type { BasicContext } from '../context';

interface ManifestEntry {
  ui_index?: string;
  saves_index?: string;
  full_history_file?: string;
  scenario_index?: string;
  capabilities_file?: string;
}

const repoSchemasDir = path.resolve(__dirname, '..', '..', '..', 'tools', 'validator', 'schemas');

function getStringField(obj: Record<string, unknown>, key: string): string | null {
  const value = obj[key];
  if (typeof value === 'string' && value.trim()) return value.trim();
  return null;
}

export async function checkRuntimeContracts(ctx: BasicContext): Promise<void> {
  const { base, issues } = ctx;

  const manifestPath = path.join(base, 'manifest/entry.json');
  if (!fs.existsSync(manifestPath)) return;

  const raw = loadData(manifestPath, issues);
  if (!raw || typeof raw !== 'object') return;

  const manifest = raw as ManifestEntry & Record<string, unknown>;

  const pointers: Array<{ key: keyof ManifestEntry; rel: string; code: string }> = [];

  const scenarioIndex = getStringField(manifest as Record<string, unknown>, 'scenario_index');
  if (scenarioIndex) {
    pointers.push({ key: 'scenario_index', rel: scenarioIndex, code: 'SCENARIO-INDEX' });
  }

  const capabilitiesFile = getStringField(manifest as Record<string, unknown>, 'capabilities_file');
  if (capabilitiesFile) {
    pointers.push({ key: 'capabilities_file', rel: capabilitiesFile, code: 'CAPABILITIES-FILE' });
  }

  const uiIndex = getStringField(manifest as Record<string, unknown>, 'ui_index');
  if (uiIndex) {
    pointers.push({ key: 'ui_index', rel: uiIndex, code: 'UI-INDEX' });
  }

  const savesIndex = getStringField(manifest as Record<string, unknown>, 'saves_index');
  if (savesIndex) {
    pointers.push({ key: 'saves_index', rel: savesIndex, code: 'SAVES-INDEX' });
  }

  const fullHistoryFile = getStringField(manifest as Record<string, unknown>, 'full_history_file');
  if (fullHistoryFile) {
    pointers.push({ key: 'full_history_file', rel: fullHistoryFile, code: 'FULL-HISTORY' });
  }

  pointers.forEach(({ rel, code }) => {
    const abs = path.join(base, rel);
    if (!fs.existsSync(abs)) {
      add(
        issues,
        'ERROR',
        'MANIFEST-POINTER-MISSING',
        'manifest/entry.json',
        `Manifest points to missing file (${code}): ${rel}`,
        'Create the file or fix the manifest pointer',
      );
    }
  });

  if (uiIndex) {
    validateFileWithSchema(
      base,
      uiIndex,
      path.join(repoSchemasDir, 'ui.index.schema.json'),
      'UI-INDEX',
      issues,
      { level: 'ERROR' },
    );

    const uiIndexAbs = path.join(base, uiIndex);
    const uiIndexData = loadData(uiIndexAbs, issues) as Record<string, unknown> | null;
    const files = uiIndexData && typeof uiIndexData === 'object'
      ? (uiIndexData.files as Record<string, unknown> | undefined)
      : undefined;

    const sceneRel = files && typeof files.scene === 'string' ? files.scene : null;
    const actionsRel = files && typeof files.actions === 'string' ? files.actions : null;
    const hudRel = files && typeof files.hud === 'string' ? files.hud : null;
    const historyRel = files && typeof files.history === 'string' ? files.history : null;

    [
      { rel: sceneRel, schema: 'ui.scene.schema.json', prefix: 'UI-SCENE' },
      { rel: actionsRel, schema: 'ui.actions.schema.json', prefix: 'UI-ACTIONS' },
      { rel: hudRel, schema: 'ui.hud.schema.json', prefix: 'UI-HUD' },
      { rel: historyRel, schema: 'ui.history.schema.json', prefix: 'UI-HISTORY' },
    ].forEach(({ rel, schema, prefix }) => {
      if (!rel) return;
      const relNormalized = rel.replace(/\\/g, '/');
      const abs = path.join(base, relNormalized);
      if (!fs.existsSync(abs)) {
        add(issues, 'ERROR', 'UI-FILE-MISSING', relNormalized, 'UI contract file missing', 'Create file or update ui/index.json pointers');
        return;
      }
      validateFileWithSchema(base, relNormalized, path.join(repoSchemasDir, schema), prefix, issues, { level: 'ERROR' });
    });
  }

  if (savesIndex) {
    validateFileWithSchema(
      base,
      savesIndex,
      path.join(repoSchemasDir, 'saves.index.schema.json'),
      'SAVES-INDEX',
      issues,
      { level: 'ERROR' },
    );
  }

  if (fullHistoryFile) {
    const abs = path.join(base, fullHistoryFile);
    if (fs.existsSync(abs)) {
      try {
        fs.readFileSync(abs, 'utf8');
      } catch (error) {
        const err = error as Error;
        add(
          issues,
          'ERROR',
          'HISTORY-READ',
          fullHistoryFile,
          'Cannot read full history file',
          err.message,
        );
      }
    }
  }
}

export default checkRuntimeContracts;
