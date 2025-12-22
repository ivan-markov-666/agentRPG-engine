const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

async function checkOrphans(ctx) {
  const { base, issues } = ctx;
  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return;
  const state = loadData(statePath, issues);
  if (!state) return;

  // Active quests without files
  const active = state.active_quests || [];
  active.forEach((q) => {
    if (!q.quest_id) return;
    const questFile = path.join(base, 'scenario/quests', `${q.quest_id}.md`);
    if (!fs.existsSync(questFile)) {
      add(issues, 'ERROR', 'QUEST-ORPHAN', `scenario/quests/${q.quest_id}.md`, 'Active quest file missing', 'Create quest file or remove from active');
    }
  });

  // Area orphan
  if (state.current_area_id) {
    const areaFile = path.join(base, 'scenario/areas', `${state.current_area_id}.md`);
    if (!fs.existsSync(areaFile)) {
      add(issues, 'ERROR', 'AREA-ORPHAN', `scenario/areas/${state.current_area_id}.md`, 'Current area file missing', 'Create area file or change current_area_id');
    }
  }
}

module.exports = { checkOrphans };
