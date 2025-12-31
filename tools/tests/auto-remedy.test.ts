import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'auto-remedy-test-'));
}

(function runTests() {
  // exploration:init creates exploration-log.json
  (() => {
    const root = createTempGameRoot();
    const scriptPath = path.join(__dirname, '..', 'exploration', 'init-log.js');

    const result = spawnSync(
      'node',
      [scriptPath, '--path', root],
      { encoding: 'utf8' },
    );

    assert.strictEqual(result.status, 0, `exploration:init failed: ${result.stderr || result.stdout}`);

    const logPath = path.join(root, 'player-data', 'runtime', 'exploration-log.json');
    assert(fs.existsSync(logPath), 'Expected exploration-log.json to be created');
    const parsed = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    assert(Array.isArray(parsed), 'Expected exploration-log.json to be an array');
  })();

  // quest:scaffold creates a quest markdown scaffold
  (() => {
    const root = createTempGameRoot();
    const scriptPath = path.join(__dirname, '..', 'quests', 'scaffold-quest.js');

    const result = spawnSync(
      'node',
      [scriptPath, '--path', root, '--id', 'test-quest', '--title', 'Test Quest', '--area', 'default-area'],
      { encoding: 'utf8' },
    );

    assert.strictEqual(result.status, 0, `quest:scaffold failed: ${result.stderr || result.stdout}`);

    const questFile = path.join(root, 'scenario', 'quests', 'test-quest.md');
    assert(fs.existsSync(questFile), 'Expected quest markdown file to be created');
    const content = fs.readFileSync(questFile, 'utf8');
    assert(content.includes('# Test Quest'), 'Expected quest header');
    assert(content.includes('## Summary'), 'Expected Summary section');
    assert(content.includes('## Steps'), 'Expected Steps section');
    assert(content.includes('## Rewards'), 'Expected Rewards section');
    assert(content.includes('[[default-area]]'), 'Expected area link');
  })();

  console.log('auto-remedy tests passed.');
})();
