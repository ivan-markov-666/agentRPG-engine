import fs from 'fs';
import path from 'path';

import type { TelemetryIssue, TelemetryKpiMetrics } from '@types';

export interface WriteLogOptions {
  runId?: string | null;
  logPath: string;
  issues: TelemetryIssue[];
  startTime: number;
  gameId?: string | null;
  metrics?: TelemetryKpiMetrics;
}

interface TelemetryEntry {
  run_id: string;
  runId: string;
  timestamp: string;
  duration_ms: number;
  durationMs?: number;
  errors: number;
  warnings: number;
  issues: TelemetryIssue[];
  game?: string;
  metrics?: TelemetryKpiMetrics;
}

function toTelemetryEntry(options: WriteLogOptions): TelemetryEntry {
  const durationMs = Date.now() - options.startTime;
  const errors = options.issues.filter((i) => i.level === 'ERROR').length;
  const warnings = options.issues.filter((i) => i.level === 'WARN').length;
  const runId = options.runId && options.runId.trim() ? options.runId : `${Date.now()}`;

  return {
    runId,
    run_id: runId,
    timestamp: new Date().toISOString(),
    duration_ms: durationMs,
    durationMs,
    errors,
    warnings,
    issues: options.issues,
    game: options.gameId || undefined,
    metrics: options.metrics,
  };
}

function readExistingLog(targetPath: string) {
  try {
    const raw = fs.readFileSync(targetPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeLog(options: WriteLogOptions): void {
  const outPath = path.resolve(options.logPath);
  const payload = toTelemetryEntry(options);
  let existing: unknown = null;

  if (fs.existsSync(outPath)) {
    existing = readExistingLog(outPath);
  }

  const entries: TelemetryEntry[] = [];
  if (Array.isArray(existing)) {
    entries.push(...(existing as TelemetryEntry[]));
  } else if (existing && typeof existing === 'object') {
    entries.push(existing as TelemetryEntry);
  }
  entries.push(payload);

  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), 'utf8');
}

export default writeLog;
