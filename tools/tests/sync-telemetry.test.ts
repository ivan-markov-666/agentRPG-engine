import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { SpawnSyncReturns } from 'node:child_process';

import { syncTelemetry } from '../scripts/sync-telemetry';

function createTempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'sync-telemetry-test-'));
}

function writeFile(root: string, rel: string, contents: string): void {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
}

function createLogger() {
  const logs: string[] = [];
  const logger = {
    log: (msg: string) => logs.push(msg),
    error: (msg: string) => logs.push(`ERROR: ${msg}`),
  };
  return { logs, logger };
}

function createSpawnResult(status = 0): SpawnSyncReturns<Buffer> {
  const empty = Buffer.from('');
  return {
    pid: 0,
    output: [],
    stdout: empty,
    stderr: empty,
    status,
    signal: null,
  };
}

type SpawnFn = typeof import('node:child_process').spawnSync;

function createSpawnStub(status = 0, onCall?: (command: string, args: string[]) => void): SpawnFn {
  return ((command: string, argsOrOptions?: unknown) => {
    const args = Array.isArray(argsOrOptions) ? (argsOrOptions as string[]) : [];
    onCall?.(command, [...args]);
    return createSpawnResult(status);
  }) as SpawnFn;
}

(function runSyncTelemetryTests() {
  // Copies files recursively to a local destination
  (() => {
    const root = createTempRoot();
    const sourceDir = 'docs/reports/central-upload';
    const destDir = 'central/mirror';
    writeFile(root, `${sourceDir}/bundle/latest.json`, JSON.stringify({ run_id: 'local' }));
    writeFile(root, `${sourceDir}/bundle/meta.txt`, 'meta');
    const { logs, logger } = createLogger();

    syncTelemetry({ cwd: root, sourceDir, dest: destDir, logger });

    const destPath = path.join(root, destDir, 'bundle/latest.json');
    assert(fs.existsSync(destPath), 'Expected file to be copied to destination');
    const summaryLine = logs.find((line) => line.startsWith('[SYNC] Files copied to'));
    assert(summaryLine && summaryLine.includes(path.join(root, destDir)), 'Expected copy summary log');
  })();

  // Dry-run should report actions without touching filesystem
  (() => {
    const root = createTempRoot();
    const sourceDir = 'docs/reports/central-upload';
    const destDir = 'central/dry-run';
    writeFile(root, `${sourceDir}/bundle/latest.json`, JSON.stringify({ run_id: 'dry' }));
    const { logs, logger } = createLogger();

    syncTelemetry({ cwd: root, sourceDir, dest: destDir, dryRun: true, logger });

    assert(!fs.existsSync(path.join(root, destDir)), 'Destination must not exist after dry-run');
    assert(logs.some((line) => line.includes('[SYNC][DRY-RUN]')), 'Expected dry-run copy logs');
    assert(logs.some((line) => line.includes('(dry-run)')), 'Expected summary to highlight dry-run');
  })();

  // S3 sync invokes aws cli and respects dry-run flag
  (() => {
    const root = createTempRoot();
    const sourceDir = 'docs/reports/central-upload';
    writeFile(root, `${sourceDir}/bundle/latest.json`, JSON.stringify({ run_id: 's3' }));
    const { logger } = createLogger();
    const calls: { cmd: string; args: string[] }[] = [];
    const spawnStub = createSpawnStub(0, (cmd, args) => {
      calls.push({ cmd, args });
    });

    syncTelemetry({ cwd: root, sourceDir, dest: 's3://bucket/path', dryRun: true, spawnFn: spawnStub, logger });

    assert.strictEqual(calls.length, 1, 'Expected a single aws cli invocation');
    const invocation = calls[0];
    assert.strictEqual(invocation.cmd, 'aws');
    assert.deepStrictEqual(invocation.args.slice(0, 3), ['s3', 'sync', path.join(root, sourceDir)]);
    assert(invocation.args.includes('--delete'), 'Expected --delete option');
    assert(invocation.args.includes('--dryrun'), 'Expected --dryrun option when dryRun=true');
  })();

  // Surfaces aws cli failures as errors
  (() => {
    const root = createTempRoot();
    const sourceDir = 'docs/reports/central-upload';
    writeFile(root, `${sourceDir}/bundle/latest.json`, JSON.stringify({ run_id: 's3-error' }));
    const spawnStub = createSpawnStub(2);

    assert.throws(
      () => syncTelemetry({ cwd: root, sourceDir, dest: 's3://bucket/path', spawnFn: spawnStub }),
      /aws s3 sync failed with code 2/
    );
  })();

  console.log('sync-telemetry tests passed.');
})();
