export type ExplorationEntryType = 'area' | 'quest' | 'event';

export type ExplorationOrigin = 'player-request' | 'gm-suggested';

export interface ExplorationLogEntry {
  id: string;
  title: string;
  type: ExplorationEntryType;
  area_id?: string;
  quest_id?: string;
  description: string;
  added_at: string;
  tags: string[];
  origin: ExplorationOrigin;
  notes?: string;
}
