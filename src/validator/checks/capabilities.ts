import fs from 'fs';
import path from 'path';

import { add, loadData } from '../utils/io';
import { resolveCapabilitiesFile } from '../utils/manifest';
import type { Issue } from '../types';
import type { RuntimeState } from '../../types/runtime-state';

interface CapabilityDefinition {
  enabled?: boolean;
  desc?: string;
  min?: number;
  max?: number;
  range?: [number, number];
  note?: string;
  [key: string]: unknown;
}

type CapabilityMap = Record<string, CapabilityDefinition>;

interface CheckContext {
  base: string;
  issues: Issue[];
}

interface ValidateRuntimeContext {
  hasRange: boolean;
  min?: number;
  max?: number;
  outOfRange: string[];
  statusStackIssues: string[];
}

export async function checkCapabilities(ctx: CheckContext): Promise<void> {
  const { base, issues } = ctx;
  const capFileRel = resolveCapabilitiesFile(base, issues);
  if (!capFileRel) return;
  const capPath = path.join(base, capFileRel);
  if (!fs.existsSync(capPath)) return;

  const capsRaw = loadData(capPath, issues);
  if (!capsRaw || typeof capsRaw !== 'object') return;
  const caps = capsRaw as CapabilityMap;

  const statusStackIssues: string[] = [];
  const seen = new Set<string>();

  Object.keys(caps).forEach((key) => {
    if (seen.has(key)) {
      add(issues, 'ERROR', 'CAP-DUP', capFileRel, `Duplicate capability '${key}'`, 'Remove duplicate');
    }
    seen.add(key);
    const def: CapabilityDefinition = caps[key] || {};
    const allowedFields = new Set(['enabled', 'desc', 'min', 'max', 'range', 'note']);

    if (def.enabled === undefined) {
      add(issues, 'WARN', 'CAP-RUNTIME', capFileRel, `No 'enabled' for '${key}'`, 'Set enabled true/false');
    }
    if (def.enabled !== undefined && typeof def.enabled !== 'boolean') {
      add(issues, 'WARN', 'CAP-ENABLED-TYPE', capFileRel, `'enabled' should be boolean for '${key}'`, 'Use true/false');
    }
    if (def.min !== undefined && typeof def.min !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'min' should be number for '${key}'`, 'Fix type');
    }
    if (def.max !== undefined && typeof def.max !== 'number') {
      add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'max' should be number for '${key}'`, 'Fix type');
    }
    if (def.range !== undefined) {
      const range = def.range;
      const validArray = Array.isArray(range) && range.length === 2 && range.every((v) => typeof v === 'number');
      if (!validArray) {
        add(issues, 'WARN', 'CAP-RANGE', capFileRel, `'range' should be [min, max] numbers for '${key}'`, 'Fix range array');
      }
      if (validArray && range[0] > range[1]) {
        add(issues, 'ERROR', 'CAP-RANGE', capFileRel, `'range' min>max for '${key}'`, 'Fix range array order');
      }
      if (validArray && (def.min !== undefined || def.max !== undefined)) {
        add(
          issues,
          'WARN',
          'CAP-RANGE-CONSIST',
          capFileRel,
          `'range' provided; min/max will be ignored for '${key}'`,
          'Use range OR min/max, not both',
        );
      }
    }
    if (def.min !== undefined && def.max !== undefined && def.min > def.max) {
      add(issues, 'ERROR', 'CAP-RANGE', capFileRel, `min > max for '${key}'`, 'Fix range');
    }

    Object.keys(def).forEach((field) => {
      if (!allowedFields.has(field)) {
        add(issues, 'WARN', 'CAP-UNKNOWN', capFileRel, `Unknown field '${field}' on '${key}'`, 'Check spelling or remove');
      }
    });
  });

  const statePath = path.join(base, 'player-data/runtime/state.json');
  if (!fs.existsSync(statePath)) return;
  const state = loadData(statePath, issues) as RuntimeState | null;
  if (!state || typeof state !== 'object') return;
  const stats = state.stats || {};

  const missing: string[] = [];
  const disabledPresent: string[] = [];
  const outOfRange: string[] = [];
  const unknownRuntime: string[] = [];
  const missingBounds: string[] = [];

  Object.keys(caps).forEach((key) => {
    const def: CapabilityDefinition = caps[key] || {};
    const value = (stats as Record<string, unknown>)[key];
    const enabled = def.enabled !== false;

    if (!enabled && (def.min !== undefined || def.max !== undefined || def.range !== undefined)) {
      add(
        issues,
        'WARN',
        'CAP-DISABLED-RANGE',
        'config/capabilities.json',
        `'${key}' is disabled but has min/max/range`,
        'Remove ranges or enable capability',
      );
    }

    if (enabled && value === undefined) {
      missing.push(key);
    }
    if (!enabled && value !== undefined) {
      disabledPresent.push(key);
    }

    const hasRange = Array.isArray(def.range) && def.range.length === 2 && def.range.every((v) => typeof v === 'number');
    const min = typeof def.min === 'number' ? def.min : undefined;
    const max = typeof def.max === 'number' ? def.max : undefined;
    const hasBounds = hasRange || min !== undefined || max !== undefined;

    if (enabled && value !== undefined) {
      if (typeof value === 'number' && !hasBounds) {
        missingBounds.push(key);
      } else {
        validateRuntimeValue(key, value, def, { hasRange, min, max, outOfRange, statusStackIssues });
      }
    }
  });

  if (missing.length > 0) {
    add(
      issues,
      'WARN',
      'CAP-RUNTIME',
      'player-data/runtime/state.json',
      `Missing runtime values: ${missing.join(', ')}`,
      'Add to stats or disable in capabilities.json',
    );
  }
  if (disabledPresent.length > 0) {
    add(
      issues,
      'WARN',
      'CAP-DISABLED-RUNTIME',
      'player-data/runtime/state.json',
      `Runtime has values for disabled capabilities: ${disabledPresent.join(', ')}`,
      'Remove from stats or enable capability',
    );
  }
  if (outOfRange.length > 0) {
    add(
      issues,
      'ERROR',
      'CAP-RUNTIME-RANGE',
      'player-data/runtime/state.json',
      `Runtime values out of range: ${outOfRange.join('; ')}`,
      'Adjust stats or capability ranges',
    );
  }
  if (missingBounds.length > 0) {
    add(
      issues,
      'WARN',
      'CAP-RUNTIME-BOUNDS',
      'config/capabilities.json',
      `Capabilities missing min/max or range but used as numeric runtime stats: ${missingBounds.join(', ')}`,
      'Add min/max or range to the capability definition',
    );
  }
  if (statusStackIssues.length > 0) {
    add(
      issues,
      'WARN',
      'CAP-STATUS-STACK',
      'player-data/runtime/state.json',
      `Invalid status_effects stack: ${statusStackIssues.join('; ')}`,
      'Ensure stack is integer >= 0',
    );
  }

  Object.keys(stats || {}).forEach((key) => {
    if (!caps[key]) {
      unknownRuntime.push(key);
    }
  });

  if (unknownRuntime.length > 0) {
    add(
      issues,
      'WARN',
      'CAP-UNKNOWN-RUNTIME',
      'player-data/runtime/state.json',
      `Runtime has unknown capabilities: ${unknownRuntime.join(', ')}`,
      'Remove or add to capabilities.json',
    );
  }
}

function validateRuntimeValue(
  key: string,
  value: unknown,
  def: CapabilityDefinition,
  ctx: ValidateRuntimeContext,
  pathLabel: string = key,
): void {
  const { hasRange, min, max, outOfRange, statusStackIssues } = ctx;

  if (value === null || value === undefined) return;

  if (typeof value === 'number') {
    if (hasRange && Array.isArray(def.range)) {
      if (value < def.range[0] || value > def.range[1]) {
        outOfRange.push(`${pathLabel} (${value} not in [${def.range[0]},${def.range[1]}])`);
      }
    } else {
      if (min !== undefined && value < min) {
        outOfRange.push(`${pathLabel} (${value} < min ${min})`);
      }
      if (max !== undefined && value > max) {
        outOfRange.push(`${pathLabel} (${value} > max ${max})`);
      }
    }
    return;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (key === 'status_effects') {
      Object.entries(value as Record<string, { stack?: number }>).forEach(([effectId, data]) => {
        if (data && typeof data === 'object' && 'stack' in data) {
          const stack = data.stack;
          if (!Number.isInteger(stack) || (typeof stack === 'number' && stack < 0)) {
            statusStackIssues.push(`${effectId}.stack=${stack}`);
          }
        }
      });
      return;
    }
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      if (typeof childValue === 'number' || (childValue && typeof childValue === 'object')) {
        validateRuntimeValue(key, childValue, def, ctx, `${pathLabel}.${childKey}`);
      }
    });
  }
}

export default checkCapabilities;
