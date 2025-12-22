  const statusStackIssues = [];
const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

async function checkCapabilities(ctx) {
  const { base, issues } = ctx;
  const candidates = ['config/capabilities.json', 'config/capabilities.yaml', 'config/capabilities.yml'];
  let capFileRel = null;
  let capPath = null;
  for (const rel of candidates) {
    const abs = path.join(base, rel);
    if (fs.existsSync(abs)) {
      capFileRel = rel;
      capPath = abs;
      break;
    }
  }
  if (!capPath) return;
  const caps = loadData(capPath, issues);
  if (!caps) return;
  const statusStackIssues = [];
  const seen = new Set();
  Object.keys(caps).forEach((k) => {
    if (seen.has(k)) add(issues, 'ERROR', 'CAP-DUP', capFileRel, `Duplicate capability '${k}'`, 'Remove duplicate');
    seen.add(k);
    const def = caps[k] || {};
    const allowedFields = new Set(['enabled', 'desc', 'min', 'max', 'range', 'note']);
    if (def.enabled === undefined) add(issues, 'WARN', 'CAP-RUNTIME', capFileRel, `No 'enabled' for '${k}'`, 'Set enabled true/false');
    if (def.enabled !== undefined && typeof def.enabled !== 'boolean') {
      add(issues, 'WARN', 'CAP-ENABLED-TYPE', capFileRel, `'enabled' should be boolean for '${k}'`, 'Use true/false');
    }
    if (def.min !== undefined && typeof def.min !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'min' should be number for '${k}'`, 'Fix type');
    }
    if (def.max !== undefined && typeof def.max !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'max' should be number for '${k}'`, 'Fix type');
    }
    if (def.range !== undefined) {
      const r = def.range;
      const validArray = Array.isArray(r) && r.length === 2 && r.every((v) => typeof v === 'number');
      if (!validArray) {
        add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'range' should be [min, max] numbers for '${k}'`, 'Fix range array');
      }
      if (validArray && r[0] > r[1]) {
        add(issues, 'ERROR', 'CAP-RANGE', capFileRel, `'range' min>max for '${k}'`, 'Fix range array order');
      }
      if (validArray && (def.min !== undefined || def.max !== undefined)) {
        add(issues, 'WARN', 'CAP-RANGE-CONSIST', capFileRel, `'range' provided; min/max will be ignored for '${k}'`, 'Use range OR min/max, not both');
      }
    }
    if (def.min !== undefined && def.max !== undefined && def.min > def.max) {
      add(issues, 'ERROR', 'CAP-RANGE', capFileRel, `min > max for '${k}'`, 'Fix range');
    }
    Object.keys(def).forEach((field) => {
      if (!allowedFields.has(field)) {
        add(issues, 'WARN', 'CAP-UNKNOWN', capFileRel, `Unknown field '${field}' on '${k}'`, 'Check spelling or remove');
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
    if (enabled && value !== undefined) {
      validateRuntimeValue(k, value, def, { hasRange, min, max, outOfRange, statusStackIssues });
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
  if (statusStackIssues.length > 0) {
    add(issues, 'WARN', 'CAP-STATUS-STACK', 'player-data/runtime/state.json', `Invalid status_effects stack: ${statusStackIssues.join('; ')}`, 'Ensure stack is integer >= 0');
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

function validateRuntimeValue(key, value, def, ctx, path = key) {
  const { hasRange, min, max, outOfRange, statusStackIssues } = ctx;
  if (value === null || value === undefined) return;
  if (typeof value === 'number') {
    if (hasRange) {
      if (value < def.range[0] || value > def.range[1]) outOfRange.push(`${path} (${value} not in [${def.range[0]},${def.range[1]}])`);
    } else {
      if (min !== undefined && value < min) outOfRange.push(`${path} (${value} < min ${min})`);
      if (max !== undefined && value > max) outOfRange.push(`${path} (${value} > max ${max})`);
    }
    return;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (key === 'status_effects') {
      Object.entries(value).forEach(([effectId, data]) => {
        if (data && typeof data === 'object' && 'stack' in data) {
          const stack = data.stack;
          if (!Number.isInteger(stack) || stack < 0) {
            statusStackIssues.push(`${effectId}.stack=${stack}`);
          }
        }
      });
      return;
    }
    Object.entries(value).forEach(([childKey, childValue]) => {
      if (typeof childValue === 'number' || (childValue && typeof childValue === 'object')) {
        validateRuntimeValue(key, childValue, def, ctx, `${path}.${childKey}`);
      }
    });
  }
}
