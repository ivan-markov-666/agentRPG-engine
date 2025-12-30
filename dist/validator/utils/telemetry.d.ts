import type { TelemetryIssue } from '@types';
export interface WriteLogOptions {
    runId?: string | null;
    logPath: string;
    issues: TelemetryIssue[];
    startTime: number;
    gameId?: string | null;
}
export declare function writeLog(options: WriteLogOptions): void;
export default writeLog;
//# sourceMappingURL=telemetry.d.ts.map