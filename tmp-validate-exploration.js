const path = require('path');
const Ajv = require('ajv');
const schema = require(path.resolve(__dirname, 'tools', 'validator', 'schemas', 'exploration-log.schema.json'));
const data = require(path.resolve(__dirname, 'samples', 'blank-game', 'player-data', 'runtime', 'exploration-log.json'));
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
const ok = validate(data);
console.log('valid?', ok);
if (!ok) {
  console.log(validate.errors);
}
