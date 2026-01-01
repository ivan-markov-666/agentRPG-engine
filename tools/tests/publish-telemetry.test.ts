import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { publishTelemetry } from '../scripts/publish-telemetry';

function createTempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'publish-telemetry-test-'));
}

function writeFile(dir: string, rel: string, contents: string): string {
  const target = path.join(dir, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
  return target;
}

(function runPublishTelemetryTests() {
  // Copies only latest archive file by default and includes history when requested
  (() => {
    const root = createTempRoot();
    const archiveDir = 'reports/archive';
    const destDir = 'central/upload';
    const historyPath = 'reports/history.json';

    const olderFile = writeFile(root, `${archiveDir}/older.json`, JSON.stringify({ run_id: 'old' }));
    const newerFile = writeFile(root, `${archiveDir}/newer.json`, JSON.stringify({ run_id: 'new' }));
    // Ensure mtime ordering
    fs.utimesSync(olderFile, new Date(Date.now() - 10_000), new Date(Date.now() - 10_000));
    fs.utimesSync(newerFile, new Date(), new Date());
    writeFile(root, historyPath, JSON.stringify([{ run_id: 'history' }]));

    const result = publishTelemetry({
      cwd: root,
      sourceDir: archiveDir,
      destDir: destDir,
      includeHistory: true,
      historyFile: historyPath,
    });

    assert.strictEqual(result.copied.length, 2, 'Expected archive + history copy');
    const destFiles = fs.readdirSync(path.join(root, destDir));
    assert(destFiles.includes('newer.json'), 'Latest archive should be copied');
    assert(!destFiles.includes('older.json'), 'Older archive should not be copied without --all');
    assert(destFiles.includes('history.json'), 'History file should be copied when includeHistory=true');
  })();

  // Dry-run should not touch filesystem
  (() => {
    const root = createTempRoot();
    const archiveDir = 'reports/archive';
    const destDir = 'central/upload';
    writeFile(root, `${archiveDir}/sample.json`, JSON.stringify({ run_id: 'dry' }));

    const result = publishTelemetry({
      cwd: root,
      sourceDir: archiveDir,
      destDir: destDir,
      dryRun: true,
      copyAll: true,
    });

    assert(result.dryRun, 'dryRun flag should propagate');
    assert.strictEqual(result.copied.length, 1, 'Should report file even in dry-run');
    const destPath = path.join(root, destDir);
    assert(!fs.existsSync(destPath), 'Destination folder should not exist after dry-run');
  })();

  console.log('publish-telemetry tests passed.');
})();
