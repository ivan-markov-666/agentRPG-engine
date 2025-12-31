import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { archiveTelemetry } from '../archive-telemetry';

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'telemetry-archive-test-'));
}

function writeHistory(dir: string, fileName: string, entries: unknown[]): string {
  const filePath = path.join(dir, fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf8');
  return filePath;
}

function listFiles(dir: string): string[] {
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
}

(function runTests() {
  // Below threshold should skip and keep file intact
  (() => {
    const tmp = createTempDir();
    const historyRel = 'reports/history.json';
    const entries = Array.from({ length: 3 }, (_, i) => ({ run_id: `run-${i}`, warnings: 0, errors: 0 }));
    writeHistory(tmp, historyRel, entries);
    const result = archiveTelemetry({ cwd: tmp, history: historyRel, archive: 'reports/archive', min: 5 });
    assert(result.skipped, 'Expected archive to skip');
    assert.strictEqual(result.reason, 'below-threshold', 'Expected below-threshold reason');
    const after = JSON.parse(fs.readFileSync(path.join(tmp, historyRel), 'utf8'));
    assert.strictEqual(after.length, 3, 'History should remain untouched');
    assert.strictEqual(listFiles(path.join(tmp, 'reports/archive')).length, 0, 'Archive directory should be empty');
  })();

  // Meets threshold (>=50) -> archive file and reset history
  (() => {
    const tmp = createTempDir();
    const historyRel = 'reports/history.json';
    const entries = Array.from({ length: 55 }, (_, i) => ({ run_id: `run-${i}`, warnings: 0, errors: 0 }));
    writeHistory(tmp, historyRel, entries);
    const result = archiveTelemetry({ cwd: tmp, history: historyRel, archive: 'reports/archive', min: 50 });
    assert(!result.skipped, 'Archive should run');
    const archiveDir = path.join(tmp, 'reports/archive');
    const files = listFiles(archiveDir);
    assert.strictEqual(files.length, 1, 'Archive file should be created');
    const archived = JSON.parse(fs.readFileSync(path.join(archiveDir, files[0]), 'utf8'));
    assert.strictEqual(archived.length, 55, 'Archived JSON should contain all entries');
    const historyContents = fs.readFileSync(path.join(tmp, historyRel), 'utf8').trim();
    assert.strictEqual(historyContents, '[]', 'History should be reset to []');
  })();

  // Missing history file -> error
  (() => {
    const tmp = createTempDir();
    let threw = false;
    try {
      archiveTelemetry({ cwd: tmp, history: 'missing.json' });
    } catch (err) {
      threw = true;
      const message = err instanceof Error ? err.message : String(err);
      assert(/Telemetry file not found/.test(message), 'Expected missing file error');
    }
    assert(threw, 'Expected archiveTelemetry to throw when history missing');
  })();

  // Archive directory inaccessible -> error
  (() => {
    const tmp = createTempDir();
    const historyRel = 'reports/history.json';
    const entries = Array.from({ length: 5 }, (_, i) => ({ run_id: `run-${i}`, warnings: 0, errors: 0 }));
    writeHistory(tmp, historyRel, entries);
    const archivePath = path.join(tmp, 'reports/archive');
    // Create a file where the archive directory should be to force mkdir failure
    fs.mkdirSync(path.dirname(archivePath), { recursive: true });
    fs.writeFileSync(archivePath, 'not a dir', 'utf8');
    let threw = false;
    try {
      archiveTelemetry({ cwd: tmp, history: historyRel, archive: 'reports/archive', min: 3 });
    } catch (err) {
      threw = true;
      const message = err instanceof Error ? err.message : String(err);
      assert(/Cannot access archive directory/.test(message), 'Expected archive directory error');
    }
    assert(threw, 'Expected archiveTelemetry to throw when archive path is not a directory');
  })();

  console.log('archive-telemetry tests passed.');
})();
