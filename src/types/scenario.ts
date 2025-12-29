export interface ScenarioQuest {
  id: string;
  title: string;
  summary: string;
  unlocks?: string[];
  requires?: string[];
}

export interface ScenarioContract {
  version: string;
  quests: ScenarioQuest[];
  entryQuestId: string;
  metadata?: Record<string, unknown>;
}
