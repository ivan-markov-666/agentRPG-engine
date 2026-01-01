import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseArgs, runValidateMetrics, CliArgs } from '../scripts/validate-metrics';
import { ArchiveTelemetryOptions } from '../archive-telemetry';

function createTempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-metrics-test-'));
  fs.mkdirSync(path.join(root, 'games', 'demo'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'analysis', 'reports'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'analysis'), { recursive: true });
  return root;
}

function writeHistory(root: string, entries: number): void {
  const historyPath = path.join(root, 'docs/analysis/reports/telemetry-history.json');
  const data = Array.from({ length: entries }, (_, idx) => ({ run_id: `run-${idx}` }));
  fs.writeFileSync(historyPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

type SpawnCall = { command: string; args: string[] };

function createSpawnMock(statuses: number[]): { fn: typeof import('node:child_process').spawnSync; calls: SpawnCall[] } {
  const calls: SpawnCall[] = [];
  const fn = ((command: string, args: string[]) => {
    calls.push({ command, args });
    return { status: statuses.length ? statuses.shift()! : 0 };
  }) as typeof import('node:child_process').spawnSync;
  return { fn, calls };
}

(function runValidateMetricsTests() {
  // Auto-archive triggers when history length exceeds threshold
  (() => {
    const root = createTempProject();
    writeHistory(root, 5);

    const spawnMock = createSpawnMock([0, 0]);
    const archiveCalls: ArchiveTelemetryOptions[] = [];
    const args: CliArgs = {
      game: 'demo',
      customPath: null,
      runId: 'test-run',
      history: null,
      log: null,
      out: null,
      limit: null,
      autoArchive: 3,
      archiveLabel: 'limit-trigger',
      archiveDir: null,
      archiveDryRun: true,
      extraValidatorArgs: [],
    };

    const result = runValidateMetrics(args, {
      rootDir: root,
      deps: {
        spawnSyncFn: spawnMock.fn,
        archiveTelemetryFn: (options) => {
          archiveCalls.push(options);
          return { skipped: false };
        },
        fsModule: fs,
        now: () => new Date('2026-01-01T10:00:00Z'),
      },
    });

    assert.strictEqual(result.validatorStatus, 0, 'Validator should report success');
    assert.strictEqual(result.metricsStatus, 0, 'Metrics should run after validator success');
    assert.strictEqual(result.archiveTriggered, true, 'Auto-archive should trigger');
    assert.strictEqual(archiveCalls.length, 1, 'Archive should be invoked exactly once');
    assert.strictEqual(archiveCalls[0].dryRun, true, 'Archive dry-run flag should propagate');

    assert.strictEqual(spawnMock.calls.length, 2, 'validate and metrics scripts should run');
    const validateCall = spawnMock.calls[0];
    assert(validateCall.args.includes('validate'), 'First npm invocation should be validate script');
    assert(validateCall.args.includes('--run-id') && validateCall.args.includes('test-run'), 'Run ID should be forwarded');
    const metricsCall = spawnMock.calls[1];
    assert(metricsCall.args.includes('metrics:report'), 'Second npm invocation should be metrics:report script');
  })();

  // Metrics should not execute if validator fails
  (() => {
    const root = createTempProject();
    writeHistory(root, 1);

    const spawnMock = createSpawnMock([1]); // validator fails
    const args: CliArgs = {
      game: 'demo',
      customPath: null,
      runId: null,
      history: null,
      log: null,
      out: null,
      limit: null,
      autoArchive: null,
      archiveLabel: null,
      archiveDir: null,
      archiveDryRun: false,
      extraValidatorArgs: ['--extra-flag'],
    };

    const result = runValidateMetrics(args, {
      rootDir: root,
      deps: {
        spawnSyncFn: spawnMock.fn,
        archiveTelemetryFn: () => ({ skipped: true }),
        fsModule: fs,
      },
    });

    assert.strictEqual(result.validatorStatus, 1, 'Validator failure should be reported');
    assert.strictEqual(result.metricsStatus, null, 'Metrics should not run after validator failure');
    assert.strictEqual(spawnMock.calls.length, 1, 'Only validator should run');
    assert(spawnMock.calls[0].args.includes('--extra-flag'), 'Extra validator args should be forwarded');
  })();

  // parseArgs should split validator args after --
  (() => {
    const args = parseArgs(['node', 'script', '--game', 'demo', '--', '--strict', '--warnings']);
    assert.deepStrictEqual(args.extraValidatorArgs, ['--strict', '--warnings']);
    assert.strictEqual(args.game, 'demo');
  })();

  console.log('validate-metrics tests passed.');
})();
