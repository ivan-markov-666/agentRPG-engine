import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import type { Issue } from '../types';
import type { RuntimeState } from '../../types/runtime-state';

interface CheckContext {
  base: string;
  issues: Issue[];
}

export async function checkOrphans(ctx: CheckContext): Promise<void> {
  const { base, issues } = ctx;
  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return;

  const state = loadData(statePath, issues) as RuntimeState | null;
  if (!state) return;

  const active = state.active_quests || [];
  active.forEach((quest) => {
    if (!quest?.quest_id) return;
    const questFile = path.join(base, 'scenario/quests', `${quest.quest_id}.md`);
    if (!fs.existsSync(questFile)) {
      add(
        issues,
        'ERROR',
        'QUEST-ORPHAN',
        `scenario/quests/${quest.quest_id}.md`,
        'Active quest file missing',
        'Create quest file or remove from active list',
      );
    }
  });

  if (state.current_area_id) {
    const areaFile = path.join(base, 'scenario/areas', `${state.current_area_id}.md`);
    if (!fs.existsSync(areaFile)) {
      add(
        issues,
        'ERROR',
        'AREA-ORPHAN',
        `scenario/areas/${state.current_area_id}.md`,
        'Current area file missing',
        'Create area file or change current_area_id',
      );
    }
  }
}

export default checkOrphans;
