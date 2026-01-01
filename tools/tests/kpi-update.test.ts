import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { updateKpiMetrics } from '../scripts/update-kpi';

function createTempGame(): { root: string; gamePath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kpi-test-'));
  const gamePath = path.join(root, 'games', 'demo');
  fs.mkdirSync(gamePath, { recursive: true });
  return { root, gamePath };
}

(function runKpiTests() {
  (() => {
    const { root, gamePath } = createTempGame();
    const telemetryDir = path.join(gamePath, 'telemetry');
    fs.mkdirSync(telemetryDir, { recursive: true });
    const kpiPath = path.join(telemetryDir, 'kpi.json');
    fs.writeFileSync(
      kpiPath,
      JSON.stringify(
        {
          firstActiveQuestMs: 60000,
          refusalAttempts: 1,
          refusalSuccesses: 1,
        },
        null,
        2,
      ),
      'utf8',
    );

    updateKpiMetrics({
      cwd: root,
      game: 'demo',
      firstActiveQuestMs: 90000,
      validationAttempts: 2,
      completedQuests: 1,
      debugEnabled: true,
    });

    const updated = JSON.parse(fs.readFileSync(kpiPath, 'utf8'));
    assert.strictEqual(updated.firstActiveQuestMs, 90000);
    assert.strictEqual(updated.refusalAttempts, 1);
    assert.strictEqual(updated.validationAttempts, 2);
    assert.strictEqual(updated.completedQuests, 1);
    assert.strictEqual(updated.debugEnabled, true);
  })();

  (() => {
    const { root, gamePath } = createTempGame();
    const customPath = path.join(root, 'custom-game');
    fs.mkdirSync(path.join(customPath, 'telemetry'), { recursive: true });

    updateKpiMetrics({
      cwd: root,
      pathOverride: customPath,
      firstActiveQuestMs: 120000,
      refusalAttempts: 3,
      refusalSuccesses: 2,
    });

    const kpiPath = path.join(customPath, 'telemetry', 'kpi.json');
    const updated = JSON.parse(fs.readFileSync(kpiPath, 'utf8'));
    assert.strictEqual(updated.firstActiveQuestMs, 120000);
    assert.strictEqual(updated.refusalAttempts, 3);
    assert.strictEqual(updated.refusalSuccesses, 2);
  })();

  console.log('kpi-update tests passed.');
})();
