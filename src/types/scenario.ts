export interface ScenarioQuest {
  id: string;
  title: string;
  summary: string;
  unlocks?: string[];
  requires?: string[];
  tags?: string[];
  area_ids?: string[];
}

export interface ScenarioContract {
  version: string;
  quests: ScenarioQuest[];
  entryQuestId: string;
  metadata?: Record<string, unknown>;
}

export interface QuestRewardsBreakdown {
  xp?: number;
  gold?: number;
  loot?: string[];
  social?: string[];
  notes?: string[];
}

export interface QuestDefinition {
  id: string;
  title: string;
  summary: string;
  story: string;
  hooks: string[];
  encounters: string[];
  steps: string[];
  rewards: QuestRewardsBreakdown;
  notes: string[];
  outcome: string[];
  outcomeHooks: string[];
  failState: string[];
  aftermath: string[];
  conditions: string[];
  linkedAreas?: string[];
  originFile: string;
}
