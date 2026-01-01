import { RuntimeState } from './runtime-state';

export interface SaveIndexEntry {
  save_id: string;
  created_at: string;
  scene_id: string;
  summary: string;
  file_path: string;
}

export interface SaveCursor {
  scene_id: string;
  [key: string]: unknown;
}

export interface SaveFile {
  schema_version: string;
  save_id: string;
  created_at: string;
  scene_id: string;
  summary: string;
  cursor: SaveCursor;
  state: RuntimeState;
}
