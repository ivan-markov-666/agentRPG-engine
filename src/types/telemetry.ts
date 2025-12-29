export interface TelemetryIssue {
  code: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  file?: string;
  message?: string;
  fix?: string;
}

export interface TelemetryEntry {
  runId: string;
  run_id?: string;
  timestamp: string;
  durationMs?: number;
  duration_ms: number;
  warnings: number;
  errors: number;
  issues: TelemetryIssue[];
  game?: string;
  metadata?: Record<string, unknown>;
}
