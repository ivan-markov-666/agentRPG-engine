import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { validateFileWithSchema } from '../utils/schema';
import type { BasicContext } from '../context';
import type { Issue } from '../types';

interface ContentSetEntry {
  id?: string;
  scenario_index?: string;
  capabilities_file?: string;
  unlock_condition?: string;
  state_namespace?: string;
}

interface ManifestEntry {
  ui_index?: string;
  saves_index?: string;
  full_history_file?: string;
  scenario_index?: string;
  capabilities_file?: string;
  map_world_index?: string;
  map_assets_dir?: string;
  content_sets?: ContentSetEntry[];
}

const repoSchemasDir = path.resolve(__dirname, '..', '..', '..', 'tools', 'validator', 'schemas');

function normalizeRelPath(rel: string): string {
  return rel.replace(/\\/g, '/');
}

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

  const mapWorldIndex = getStringField(manifest as Record<string, unknown>, 'map_world_index');
  if (mapWorldIndex) {
    pointers.push({ key: 'map_world_index', rel: mapWorldIndex, code: 'MAP-WORLD-INDEX' });
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

  const contentSets = Array.isArray(manifest.content_sets) ? (manifest.content_sets as ContentSetEntry[]) : [];

  contentSets.forEach((set, idx) => {
    const setId = typeof set.id === 'string' && set.id.trim() ? set.id.trim() : null;
    if (!setId) {
      add(
        issues,
        'WARN',
        'CONTENT-SET-ID',
        'manifest/entry.json',
        `content_sets[${idx}] is missing a valid 'id'`,
        'Provide string id (slug) for each content set',
      );
    }

    const setScenarioIndex = getStringField(set as Record<string, unknown>, 'scenario_index');
    if (setScenarioIndex) {
      const abs = path.join(base, setScenarioIndex);
      if (!fs.existsSync(abs)) {
        add(
          issues,
          'ERROR',
          'CONTENT-SET-SCENARIO-MISSING',
          setScenarioIndex,
          `Content set ${setId || `#${idx + 1}`} points to missing scenario_index`,
          'Create file or adjust scenario_index',
        );
      }
    }

    const setCapabilitiesFile = getStringField(set as Record<string, unknown>, 'capabilities_file');
    if (setCapabilitiesFile) {
      const abs = path.join(base, setCapabilitiesFile);
      if (!fs.existsSync(abs)) {
        add(
          issues,
          'ERROR',
          'CONTENT-SET-CAPABILITIES-MISSING',
          setCapabilitiesFile,
          `Content set ${setId || `#${idx + 1}`} points to missing capabilities_file`,
          'Create file or adjust capabilities_file',
        );
      }
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

  const mapAssetsDir = getStringField(manifest as Record<string, unknown>, 'map_assets_dir');
  if (mapAssetsDir) {
    const normalizedDir = normalizeRelPath(mapAssetsDir);
    const absDir = path.join(base, normalizedDir);
    if (!fs.existsSync(absDir)) {
      add(
        issues,
        'ERROR',
        'MAP-ASSETS-DIR-MISSING',
        normalizedDir,
        'Manifest map_assets_dir points to a missing directory',
        'Create the directory or adjust map_assets_dir',
      );
    } else if (!fs.statSync(absDir).isDirectory()) {
      add(
        issues,
        'ERROR',
        'MAP-ASSETS-DIR-TYPE',
        normalizedDir,
        'map_assets_dir must reference a directory',
        'Update the pointer to a directory path',
      );
    }
  }

  if (mapWorldIndex) {
    const normalizedWorld = normalizeRelPath(mapWorldIndex);
    const worldSchema = path.join(repoSchemasDir, 'maps.world.schema.json');
    validateFileWithSchema(base, normalizedWorld, worldSchema, 'MAP-WORLD', issues, { level: 'ERROR' });

    const worldData = loadData(path.join(base, normalizedWorld), issues);
    if (worldData && typeof worldData === 'object') {
      const worldImage = (worldData as { image?: { file?: unknown } }).image;
      const worldImageFile =
        worldImage && typeof worldImage === 'object' && typeof (worldImage as { file?: unknown }).file === 'string'
          ? (worldImage as { file: string }).file
          : null;
      ensureImageExists(base, worldImageFile, 'MAP-WORLD-IMAGE', issues);

      const regions = Array.isArray((worldData as { regions?: unknown }).regions)
        ? ((worldData as { regions: unknown[] }).regions as Record<string, unknown>[])
        : [];
      regions.forEach((region, idx) => {
        if (!region || typeof region !== 'object') return;
        const mapFile =
          typeof (region as { map_file?: unknown }).map_file === 'string'
            ? ((region as { map_file: string }).map_file)
            : null;
        if (mapFile) {
          validateAreaMap(base, mapFile, idx, issues);
        }
      });
    }
  }
}

function ensureImageExists(base: string, relPath: string | null, code: string, issues: Issue[]): void {
  if (!relPath) return;
  const normalized = normalizeRelPath(relPath);
  const abs = path.join(base, normalized);
  if (!fs.existsSync(abs)) {
    add(issues, 'ERROR', code, normalized, 'Referenced map image file is missing', 'Create the image file or update metadata');
  }
}

function validateAreaMap(base: string, relPath: string, regionIndex: number, issues: Issue[]): void {
  const normalized = normalizeRelPath(relPath);
  const abs = path.join(base, normalized);
  if (!fs.existsSync(abs)) {
    add(
      issues,
      'ERROR',
      'MAP-AREA-MISSING',
      normalized,
      `World map region ${regionIndex + 1} references missing area map`,
      'Create the area map file or update regions[].map_file',
    );
    return;
  }

  validateFileWithSchema(
    base,
    normalized,
    path.join(repoSchemasDir, 'maps.area.schema.json'),
    'MAP-AREA',
    issues,
    { level: 'ERROR' },
  );

  const areaData = loadData(abs, issues);
  if (areaData && typeof areaData === 'object') {
    const areaImage = (areaData as { image?: { file?: unknown } }).image;
    const areaImageFile =
      areaImage && typeof areaImage === 'object' && typeof (areaImage as { file?: unknown }).file === 'string'
        ? (areaImage as { file: string }).file
        : null;
    ensureImageExists(base, areaImageFile, 'MAP-AREA-IMAGE', issues);
  }
}

export default checkRuntimeContracts;
