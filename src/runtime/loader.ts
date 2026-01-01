import type {
  HostAdapter,
  ManifestEntry,
  RuntimeState,
  SessionInit,
  SaveFile,
  SaveIndexEntry,
} from '../types';

export interface GameRuntimeSnapshot {
  manifest: ManifestEntry;
  sessionInit: SessionInit | null;
  state: RuntimeState | null;
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
  return { manifest, sessionInit, state };
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
