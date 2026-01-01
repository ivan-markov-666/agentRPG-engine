import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'economy-report-test-'));
}

function writeFile(base: string, relative: string, contents: string): void {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
}

(function runEconomyReportTests() {
  const distToolsDir = path.resolve(__dirname, '..', '..', 'dist', 'tools');
  const scriptPath = path.join(distToolsDir, 'economy', 'report.js');

  // Generates JSON report with quest data and issues
  (() => {
    const root = createTempGameRoot();
    writeFile(
      root,
      'scenario/quests/available.json',
      `${JSON.stringify([{ quest_id: 'supply-run', title: 'Supply Run' }, { quest_id: 'missing-quest' }], null, 2)}\n`,
    );
    writeFile(
      root,
      'scenario/quests/supply-run.md',
      `# Supply Run

## Summary
Ensure the troops at Outpost E7 receive supplies before nightfall.

## Rewards
- XP: 450
- Gold: 120
- Loot: Tier II Caches
- Social: Reputation bump with militia
`,
    );

    const jsonOut = path.join(root, 'economy-report.json');
    const result = spawnSync('node', [scriptPath, '--path', root, '--game', 'custom', '--json', jsonOut], {
      encoding: 'utf8',
    });

    assert.strictEqual(result.status, 0, `economy:report failed: ${result.stderr || result.stdout}`);
    assert(fs.existsSync(jsonOut), 'JSON report was not written');

    const report = JSON.parse(fs.readFileSync(jsonOut, 'utf8'));
    assert.strictEqual(report.game, 'custom', 'Report should echo game name');
    assert.strictEqual(report.questsProcessed, 1, 'Only one quest file should be processed');
    assert.strictEqual(report.questsMissingFiles, 1, 'Missing quest should increment counter');
    assert.strictEqual(report.rows.length, 1, 'Rows array should include parsed quest');
    assert.strictEqual(report.rows[0].xp, 450);
    assert.strictEqual(report.rows[0].gold, 120);
    assert.strictEqual(report.rows[0].loot, 'Tier II Caches');
    assert.strictEqual(report.rows[0].social, 'Reputation bump with militia');
    assert.strictEqual(report.issues.length, 1, 'Missing quest should add issue entry');
    assert.strictEqual(report.issues[0].code, 'QUEST-FILE-MISSING');
  })();

  console.log('economy-report tests passed.');
})();
