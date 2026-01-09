import type {
  HostAdapter,
  ManifestEntry,
  RuntimeState,
  SessionInit,
  SaveFile,
  SaveIndexEntry,
} from '../types';

export interface ContentSetSnapshot {
  id: string;
  enabled: boolean;
  scenarioIndex: string;
  capabilitiesFile: string | null;
  unlockCondition?: string;
  stateNamespace?: string;
}

export interface GameRuntimeSnapshot {
  manifest: ManifestEntry;
  sessionInit: SessionInit | null;
  state: RuntimeState | null;
  contentSets: ContentSetSnapshot[];
}

async function readJsonOptional<T>(host: HostAdapter, relPath: string): Promise<T | null> {
  try {
    const raw = await host.readFile(relPath);
    return JSON.parse(raw) as T;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e && e.code === 'ENOENT') return null;
    throw err;
  }
}

async function readJsonRequired<T>(host: HostAdapter, relPath: string): Promise<T> {
  const raw = await host.readFile(relPath);
  return JSON.parse(raw) as T;
}

export async function loadGameRuntimeSnapshot(host: HostAdapter): Promise<GameRuntimeSnapshot> {
  const manifest = await readJsonRequired<ManifestEntry>(host, 'manifest/entry.json');
  const sessionInit = await readJsonOptional<SessionInit>(host, 'player-data/session-init.json');
  const state = await readJsonOptional<RuntimeState>(host, 'player-data/runtime/state.json');

  const sets: ContentSetSnapshot[] = (manifest.content_sets || []).map((set) => {
    const scenarioIndex = set.scenario_index || manifest.scenario_index || 'scenario/index.md';
    const capabilitiesFile = set.capabilities_file || manifest.capabilities_file || null;
    const stateNamespace = set.state_namespace || set.id;
    const runtimeSetState = state?.content_sets?.[set.id];
    const isFirstSet = manifest.content_sets && manifest.content_sets.length > 0
      ? set.id === manifest.content_sets[0].id
      : false;
    const enabled = runtimeSetState?.enabled ?? set.default_enabled ?? isFirstSet;

    return {
      id: set.id,
      enabled: !!enabled,
      scenarioIndex,
      capabilitiesFile,
      unlockCondition: set.unlock_condition,
      stateNamespace,
    };
  });

  return { manifest, sessionInit, state, contentSets: sets };
}

export async function loadSaveFile(host: HostAdapter, savePath: string): Promise<SaveFile> {
  const raw = await host.readFile(savePath);
  return JSON.parse(raw) as SaveFile;
}

export async function loadSaveIndex(
  host: HostAdapter,
  indexPath = 'player-data/saves/index.json',
): Promise<SaveIndexEntry[]> {
  const entries = await readJsonOptional<SaveIndexEntry[]>(host, indexPath);
  if (!entries) return [];
  if (!Array.isArray(entries)) {
    throw new Error(`Invalid save index format at ${indexPath} (expected array).`);
  }
  return entries;
}
