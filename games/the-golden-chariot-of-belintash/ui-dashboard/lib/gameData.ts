import path from 'node:path';
import { promises as fs } from 'node:fs';

type SessionInit = {
  player_name: string;
  player_gender: string;
  player_gender_custom?: string;
  preferred_language: string;
  debug?: boolean;
};

type RuntimeState = {
  stats?: Record<string, number | Record<string, unknown>>;
  world_state?: {
    date?: string;
    time_of_day?: string;
    weather?: { type?: string; intensity?: string; temperature_c?: number; wind?: string };
    visibility?: string;
    noise_level?: string;
    location?: { area_id?: string; name?: string; map_marker?: string; coordinates?: [number, number] };
  };
  content_sets?: Record<string, { enabled?: boolean; notes?: string }>;
  current_area_id?: string;
};

type Capability = {
  enabled: boolean;
  desc?: string;
  min?: number;
  max?: number;
  range?: [number, number];
};

type MapIndex = {
  image?: { file?: string; width_px?: number; height_px?: number };
  regions?: Array<{ id: string; label?: string }>;
  ascii_preview?: string[];
  legend?: Record<string, string>;
  notes?: string;
};

type AreaMap = {
  area_id?: string;
  image?: { file?: string; width_px?: number; height_px?: number };
  hotspots?: Array<{ id: string; label?: string; linked_quest_ids?: string[] }>;
  ascii_preview?: string[];
  legend?: Record<string, string>;
  notes?: string;
};

type Scene = {
  title: string;
  description: string;
  location?: string;
  npcs_present?: string[];
};

type ExplorationEntry = {
  id: string;
  title: string;
  description: string;
  area_id?: string;
  quest_id?: string;
  added_at?: string;
};

type TelemetrySummary = {
  errors: number;
  warnings: number;
  cap_errors?: number;
  top_codes?: string[];
};

type DashboardData = {
  session: SessionInit;
  runtime: RuntimeState;
  capabilities: Record<string, Capability>;
  scene: Scene;
  map: MapIndex & { imageDataUrl?: string };
  areaMap?: AreaMap & { imageDataUrl?: string };
  exploration: ExplorationEntry[];
  telemetry: TelemetrySummary;
};

const uiRoot = process.cwd();
const gameRoot = path.resolve(uiRoot, '..');
const repoRoot = path.resolve(gameRoot, '..', '..');

async function readJsonSafe<T>(absPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(absPath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function readBuffer(absPath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(absPath);
  } catch {
    return null;
  }
}

export async function loadDashboardData(): Promise<DashboardData> {
  const session = await readJsonSafe<SessionInit>(
    path.join(gameRoot, 'player-data', 'session-init.json'),
    {
      player_name: 'Player',
      player_gender: 'unknown',
      preferred_language: 'bg',
    },
  );

  const runtime = await readJsonSafe<RuntimeState>(
    path.join(gameRoot, 'player-data', 'runtime', 'state.json'),
    {},
  );

  const capabilities = await readJsonSafe<Record<string, Capability>>(
    path.join(gameRoot, 'config', 'capabilities.json'),
    {},
  );

  const scene = await readJsonSafe<Scene>(
    path.join(gameRoot, 'ui', 'scene.json'),
    {
      title: 'Неизвестна сцена',
      description: 'В момента няма активна сцена. Обнови ui/scene.json.',
      npcs_present: [],
    },
  );

  const map = await readJsonSafe<MapIndex>(
    path.join(gameRoot, 'maps', 'world', 'index.json'),
    {},
  );

  const mapImageBuffer = map.image?.file
    ? await readBuffer(path.join(gameRoot, map.image.file))
    : null;

  const currentAreaId =
    runtime.world_state?.location?.area_id ??
    runtime.current_area_id ??
    'default-area';

  const areaMap = await readJsonSafe<AreaMap>(
    path.join(gameRoot, 'maps', 'areas', `${currentAreaId}.json`),
    { area_id: currentAreaId },
  );

  const areaMapImageBuffer = areaMap.image?.file
    ? await readBuffer(path.join(gameRoot, areaMap.image.file))
    : null;

  const explorationRaw = await readJsonSafe<ExplorationEntry[]>(
    path.join(gameRoot, 'player-data', 'runtime', 'exploration-log.json'),
    [],
  );

  const telemetry = await readJsonSafe<TelemetrySummary>(
    path.join(repoRoot, 'reports', 'run-20260109-full.json'),
    { errors: 0, warnings: 0, cap_errors: 0, top_codes: [] },
  );

  const exploration = explorationRaw.slice(-6).reverse();

  return {
    session,
    runtime,
    capabilities,
    scene,
    map: {
      ...map,
      imageDataUrl: mapImageBuffer ? `data:image/png;base64,${mapImageBuffer.toString('base64')}` : undefined,
    },
    areaMap: {
      ...areaMap,
      imageDataUrl: areaMapImageBuffer
        ? `data:image/png;base64,${areaMapImageBuffer.toString('base64')}`
        : undefined,
    },
    exploration,
    telemetry,
  };
}
