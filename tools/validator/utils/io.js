const fs = require('fs');
const path = require('path');

function add(issues, level, code, file, message, fix) {
  issues && issues.push({ level, code, file, message, fix });
}

function loadData(filePath, issues) {
  const ext = path.extname(filePath).toLowerCase();
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    add(issues, 'ERROR', 'FILE-READ', filePath, 'Cannot read file', e.message);
    return null;
  }
  if (ext === '.yaml' || ext === '.yml') {
    try {
      // Lazy require to avoid hard dependency if not installed; emit WARN if missing
      const yaml = require('yaml');
      return yaml.parse(raw);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        add(issues, 'WARN', 'YAML-NOT-AVAILABLE', filePath, 'YAML parser not installed; skipping YAML parse', 'Install yaml npm package or use JSON');
      } else {
        add(issues, 'ERROR', 'YAML-PARSE', filePath, 'Invalid YAML', e.message);
      }
      return null;
    }
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    add(issues, 'ERROR', 'JSON-PARSE', filePath, 'Invalid JSON', e.message);
    return null;
  }
}

module.exports = { loadData, add };
