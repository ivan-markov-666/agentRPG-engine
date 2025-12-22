const path = require('path');
const { add, loadData } = require('./io');

function getAjv(issues) {
  try {
    // Lazy require
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const Ajv = require('ajv');
    return new Ajv({ allErrors: true, strict: false });
  } catch (e) {
    add(issues, 'WARN', 'SCHEMA-NOT-AVAILABLE', 'validator', 'ajv not installed; skipping schema validation', 'Install ajv or ignore if not needed');
    return null;
  }
}

function validateFileWithSchema(base, relFile, schemaPath, codePrefix, issues) {
  const filePath = path.join(base, relFile);
  const data = loadData(filePath, issues);
  if (!data) return;
  const ajv = getAjv(issues);
  if (!ajv) return;
  const schema = loadData(schemaPath, issues);
  if (!schema) return;
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (!ok && Array.isArray(validate.errors)) {
    validate.errors.forEach((err) => {
      const msg = `${err.instancePath || '/'} ${err.message || ''}`.trim();
      add(issues, 'WARN', `${codePrefix}-SCHEMA`, relFile, msg, 'Adjust to schema');
    });
  }
}

module.exports = { validateFileWithSchema };
