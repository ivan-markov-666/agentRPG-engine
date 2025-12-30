import fs from 'fs';
import path from 'path';

import { loadData } from './io';
import type { Issue } from '../types';

export interface ManifestPointers {
  scenarioIndex: string;
  capabilitiesFile: string | null;
}

export function readManifest(base: string, issues?: Issue[]): Record<string, unknown> | null {
  const manifestPath = path.join(base, 'manifest/entry.json');
  if (!fs.existsSync(manifestPath)) return null;
  const raw = loadData(manifestPath, issues);
  if (!raw || typeof raw !== 'object') return null;
  return raw as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function resolveScenarioIndex(base: string, issues?: Issue[]): string {
  const manifest = readManifest(base, issues);
  const fromManifest = manifest ? asNonEmptyString(manifest.scenario_index) : null;
  return fromManifest || 'scenario/index.md';
}

export function resolveCapabilitiesFile(base: string, issues?: Issue[]): string | null {
  const manifest = readManifest(base, issues);
  const fromManifest = manifest ? asNonEmptyString(manifest.capabilities_file) : null;
  if (fromManifest) return fromManifest;

  const candidates = ['config/capabilities.json', 'config/capabilities.yaml', 'config/capabilities.yml'];
  for (const rel of candidates) {
    const abs = path.join(base, rel);
    if (fs.existsSync(abs)) return rel;
  }

  // Backward-compatible default: capabilities are considered mandatory.
  // If nothing is found, require the historical default path so FILE-MISSING triggers.
  return 'config/capabilities.json';
}
