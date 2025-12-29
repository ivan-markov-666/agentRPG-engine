const fs = require('fs');
const path = require('path');
const { validateFileWithSchema } = require('../utils/schema');

function isExplorationEnabled(base, loadJson) {
  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return false;
  try {
    const loader = typeof loadJson === 'function'
      ? loadJson
      : (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const state = loader(statePath);
    if (!state || typeof state !== 'object') return false;
    return state.exploration_enabled === true || (state.exploration && state.exploration.enabled === true);
  } catch (err) {
    return false;
  }
}

async function checkSchemas(ctx) {
  const { base, issues, loadJson } = ctx;
  validateFileWithSchema(
    base,
    'config/capabilities.json',
    path.join(__dirname, '..', 'schemas', 'capabilities.schema.json'),
    'CAP',
    issues
  );
  validateFileWithSchema(
    base,
    'player-data/runtime/state.json',
    path.join(__dirname, '..', 'schemas', 'state.schema.json'),
    'STATE',
    issues
  );
  validateFileWithSchema(
    base,
    'player-data/runtime/exploration-log.json',
    path.join(__dirname, '..', 'schemas', 'exploration-log.schema.json'),
    'EXPLORATION',
    issues,
    { level: isExplorationEnabled(base, loadJson) ? 'ERROR' : 'WARN' }
  );
}

module.exports = { checkSchemas };
