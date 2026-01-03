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
}
