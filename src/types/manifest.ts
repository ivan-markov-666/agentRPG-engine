export interface ContentSetEntry {
  id: string;
  title: string;
  description?: string;
  scenario_index?: string;
  capabilities_file?: string;
  unlock_condition?: string;
  default_enabled?: boolean;
  state_namespace?: string;
  notes?: string;
}

export interface ManifestEntry {
  id: string;
  game_id?: string;
  title: string;
  version: string;
  engine_compat: string;
  engine_layers?: string[];

  capabilities_file?: string;
  scenario_index?: string;

  ui_index?: string;
  saves_index?: string;
  full_history_file?: string;
  world_index?: string;
  map_world_index?: string;
  map_assets_dir?: string;
  map_cli?: {
    version: string;
    entrypoint?: string;
    commands?: Record<string, string>;
  };
  engine_features?: Record<string, boolean>;
  engine_notes?: string;
  content_sets?: ContentSetEntry[];
}
