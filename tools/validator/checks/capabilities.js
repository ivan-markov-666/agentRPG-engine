const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

async function checkCapabilities(ctx) {
  const { base, issues } = ctx;
  const capPath = path.join(base, 'config/capabilities.json');
  if (!fs.existsSync(capPath)) return;
  const caps = loadData(capPath, issues);
  if (!caps) return;
  const seen = new Set();
  Object.keys(caps).forEach((k) => {
    if (seen.has(k)) add(issues, 'ERROR', 'CAP-DUP', 'config/capabilities.json', `Duplicate capability '${k}'`, 'Remove duplicate');
    seen.add(k);
    const def = caps[k] || {};
    const allowedFields = new Set(['enabled', 'desc', 'min', 'max', 'range', 'note']);
    if (def.enabled === undefined) add(issues, 'WARN', 'CAP-RUNTIME', 'config/capabilities.json', `No 'enabled' for '${k}'`, 'Set enabled true/false');
    if (def.enabled !== undefined && typeof def.enabled !== 'boolean') {
      add(issues, 'WARN', 'CAP-ENABLED-TYPE', 'config/capabilities.json', `'enabled' should be boolean for '${k}'`, 'Use true/false');
    }
    if (def.min !== undefined && typeof def.min !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', 'config/capabilities.json', `'min' should be number for '${k}'`, 'Fix type');
    }
    if (def.max !== undefined && typeof def.max !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', 'config/capabilities.json', `'max' should be number for '${k}'`, 'Fix type');
    }
    if (def.range !== undefined) {
      const r = def.range;
      const validArray = Array.isArray(r) && r.length === 2 && r.every((v) => typeof v === 'number');
      if (!validArray) {
        add(issues, 'WARN', 'CAP-RANGE', 'config/capabilities.json', `'range' should be [min, max] numbers for '${k}'`, 'Fix range array');
      }
      if (validArray && r[0] > r[1]) {
        add(issues, 'ERROR', 'CAP-RANGE', 'config/capabilities.json', `'range' min>max for '${k}'`, 'Fix range array order');
      }
      if (validArray && (def.min !== undefined || def.max !== undefined)) {
        add(issues, 'WARN', 'CAP-RANGE-CONSIST', 'config/capabilities.json', `'range' provided; min/max will be ignored for '${k}'`, 'Use range OR min/max, not both');
      }
    }
    if (def.min !== undefined && def.max !== undefined && def.min > def.max) {
      add(issues, 'ERROR', 'CAP-RANGE', 'config/capabilities.json', `min > max for '${k}'`, 'Fix range');
    }
    Object.keys(def).forEach((field) => {
      if (!allowedFields.has(field)) {
        add(issues, 'WARN', 'CAP-UNKNOWN', 'config/capabilities.json', `Unknown field '${field}' on '${k}'`, 'Check spelling or remove');
      }
    });
  });
  // runtime alignment
  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return;
  const state = loadData(statePath, issues);
  if (!state) return;
  const stats = state.stats || {};
  const missing = [];
  const disabledPresent = [];
  const outOfRange = [];
  const unknownRuntime = [];
  Object.keys(caps).forEach((k) => {
    const def = caps[k] || {};
    const value = stats[k];
    const enabled = def.enabled !== false; // default true
    if (!enabled && (def.min !== undefined || def.max !== undefined || def.range !== undefined)) {
      add(issues, 'WARN', 'CAP-DISABLED-RANGE', 'config/capabilities.json', `'${k}' is disabled but has min/max/range`, 'Remove ranges or enable capability');
    }
    if (enabled && value === undefined) missing.push(k);
    if (!enabled && value !== undefined) disabledPresent.push(k);
    const hasRange = Array.isArray(def.range) && def.range.length === 2 && def.range.every((v) => typeof v === 'number');
    const min = typeof def.min === 'number' ? def.min : undefined;
    const max = typeof def.max === 'number' ? def.max : undefined;
    if (enabled && value !== undefined && typeof value === 'number') {
      if (hasRange) {
        if (value < def.range[0] || value > def.range[1]) outOfRange.push(`${k} (${value} not in [${def.range[0]},${def.range[1]}])`);
      } else {
        if (min !== undefined && value < min) outOfRange.push(`${k} (${value} < min ${min})`);
        if (max !== undefined && value > max) outOfRange.push(`${k} (${value} > max ${max})`);
      }
    }
  });
  if (missing.length > 0) {
    const list = missing.join(', ');
    add(issues, 'WARN', 'CAP-RUNTIME', 'player-data/runtime/state.json', `Missing runtime values: ${list}`, 'Add to stats or disable in capabilities.json');
  }
  if (disabledPresent.length > 0) {
    add(issues, 'WARN', 'CAP-DISABLED-RUNTIME', 'player-data/runtime/state.json', `Runtime has values for disabled capabilities: ${disabledPresent.join(', ')}`, 'Remove from stats or enable capability');
  }
  if (outOfRange.length > 0) {
    add(issues, 'ERROR', 'CAP-RUNTIME-RANGE', 'player-data/runtime/state.json', `Runtime values out of range: ${outOfRange.join('; ')}`, 'Adjust stats or capability ranges');
  }
  Object.keys(stats || {}).forEach((k) => {
    if (!caps[k]) {
      unknownRuntime.push(k);
    }
  });
  if (unknownRuntime.length > 0) {
    add(issues, 'WARN', 'CAP-UNKNOWN-RUNTIME', 'player-data/runtime/state.json', `Runtime has unknown capabilities: ${unknownRuntime.join(', ')}`, 'Remove or add to capabilities.json');
  }
}

module.exports = { checkCapabilities };
