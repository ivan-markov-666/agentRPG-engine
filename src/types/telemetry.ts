export interface TelemetryIssue {
  code: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  file?: string;
  message: string;
  fix?: string;
}

export interface TelemetryEntry {
  runId: string;
  timestamp: string;
  durationMs: number;
  game: string;
  warnings: number;
  errors: number;
  issues: TelemetryIssue[];
  metadata?: Record<string, unknown>;
}
