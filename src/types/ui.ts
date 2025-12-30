export interface UIIndex {
  schema_version: string;
  files: {
    scene: string;
    actions: string;
    hud: string;
    history: string;
  };
  schemas?: Record<string, string>;
  player_data?: {
    saves_index?: string;
    full_history_file?: string;
  };
}

export interface UIScene {
  schema_version: string;
  scene_id: string;
  title: string;
  description: string;
  location: string;
  area_id?: string;
  npcs_present?: string[];
  timestamp: string;
}

export interface UIAction {
  id: string;
  label: string;
  enabled?: boolean;
  hotkey?: string;
  kind?: string;
}

export interface UIActions {
  schema_version: string;
  actions: UIAction[];
}

export interface UIHud {
  schema_version: string;
  bars?: Record<string, { current: number; max?: number }>;
  status_effects?: Array<Record<string, unknown>>;
  reputation?: Record<string, number>;
  currency?: Record<string, number>;
  needs?: Record<string, number>;
}

export interface UIHistoryEvent {
  id: string;
  type?: string;
  timestamp: string;
  text: string;
}

export interface UIHistory {
  schema_version: string;
  limit?: number;
  full_history_file?: string;
  events: UIHistoryEvent[];
}
