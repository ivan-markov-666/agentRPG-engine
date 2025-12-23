const path = require('path');
const { validateFileWithSchema } = require('../utils/schema');

async function checkSchemas(ctx) {
  const { base, issues } = ctx;
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
    issues
  );
}

module.exports = { checkSchemas };
