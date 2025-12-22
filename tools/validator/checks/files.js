const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

function exists(p) {
  return fs.existsSync(p);
}

async function checkRequiredFiles(ctx) {
  const { base, issues } = ctx;
  const required = [
    'manifest/entry.json',
    'scenario/index.md',
    'scenario/quests/available.json',
    'scenario/quests/unlock-triggers.json',
    'player-data/runtime/state.json',
    'player-data/runtime/completed-quests.json',
    'config/capabilities.json',
  ];
  required.forEach((rel) => {
    const fp = path.join(base, rel);
    if (!exists(fp)) {
      add(issues, 'ERROR', 'FILE-MISSING', rel, 'Missing required file', 'Create file or fix path');
    }
  });
  // scenario/index.md basic content length
  const indexPath = path.join(base, 'scenario/index.md');
  if (exists(indexPath)) {
    const stat = fs.statSync(indexPath);
    if (stat.size === 0) {
      add(issues, 'WARN', 'INDEX-EMPTY', 'scenario/index.md', 'Scenario index is empty', 'Add intro/summary');
    } else {
      const content = fs.readFileSync(indexPath, 'utf8').trim();
      if (content.length < 40) {
        add(issues, 'WARN', 'INDEX-SHORT', 'scenario/index.md', 'Scenario index is very short', 'Expand with overview and starting hook');
      }
    }
  }
  // exploration log only if exploration is flagged in state
  const statePath = path.join(base, 'player-data/runtime/state.json');
  // manifest minimal fields
  const manifestPath = path.join(base, 'manifest/entry.json');
  if (exists(manifestPath)) {
    const manifest = loadData(manifestPath, issues);
    if (manifest && typeof manifest === 'object') {
      ['id', 'title', 'version'].forEach((field) => {
        if (!manifest[field]) {
          add(issues, 'WARN', 'MANIFEST-FIELD', 'manifest/entry.json', `Missing '${field}'`, 'Add required manifest fields');
        }
      });
    }
  }
  if (exists(statePath)) {
    const state = loadData(statePath, issues);
    const explorationEnabled = state && (state.exploration_enabled === true || (state.exploration && state.exploration.enabled === true));
    const expl = path.join(base, 'player-data/runtime/exploration-log.json');
    if (explorationEnabled && !exists(expl)) {
      add(issues, 'WARN', 'FILE-MISSING-OPTIONAL', 'player-data/runtime/exploration-log.json', 'Exploration log missing (required if exploration is enabled)', 'Create empty [] if exploration is enabled');
    }
    if (exists(expl)) {
      const explData = loadData(expl, issues);
      if (explData && !Array.isArray(explData)) {
        add(issues, 'WARN', 'FILE-TYPE', 'player-data/runtime/exploration-log.json', 'Exploration log should be an array', 'Use [] or array of entries');
      } else if (explorationEnabled && Array.isArray(explData) && explData.length === 0) {
        add(issues, 'WARN', 'EXPLORATION-EMPTY', 'player-data/runtime/exploration-log.json', 'Exploration enabled but log is empty', 'Add entries when exploration occurs or disable exploration');
      }
    }
  }

  // completed-quests should be an array
  const completedPath = path.join(base, 'player-data/runtime/completed-quests.json');
  if (exists(completedPath)) {
    const completed = loadData(completedPath, issues);
    if (completed && !Array.isArray(completed)) {
      add(issues, 'WARN', 'FILE-TYPE', 'player-data/runtime/completed-quests.json', 'Completed quests should be an array', 'Use [] or array of {quest_id,title,completed_at}');
    }
  }
}

module.exports = { checkRequiredFiles };
