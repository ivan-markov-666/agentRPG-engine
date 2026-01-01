import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { remedyOrphans } from '../remedy/orphans';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'auto-remedy-test-'));
}

function writeJson(base: string, relPath: string, data: unknown): string {
  const target = path.join(base, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return target;
}

(function runTests() {
  const distToolsDir = path.resolve(__dirname, '..', '..', 'dist', 'tools');

  // exploration:init creates exploration-log.json
  (() => {
    const root = createTempGameRoot();
    const scriptPath = path.join(distToolsDir, 'exploration', 'init-log.js');

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
    const scriptPath = path.join(distToolsDir, 'quests', 'scaffold-quest.js');

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

  // remedy:orphans scaffolds missing quest + fallback area
  (() => {
    const root = createTempGameRoot();
    writeJson(root, 'player-data/runtime/state.json', {
      current_area_id: 'missing-area',
      active_quests: [{ quest_id: 'lost-quest' }],
    });
    fs.mkdirSync(path.join(root, 'scenario/quests'), { recursive: true });
    fs.mkdirSync(path.join(root, 'scenario/areas'), { recursive: true });

    const result = remedyOrphans({ base: root });
    assert(result.createdQuests.includes('lost-quest'), 'Expected lost-quest scaffold');
    assert.strictEqual(result.fallbackAreaId, 'default-area', 'Expected fallback to default-area');

    const questFile = path.join(root, 'scenario/quests/lost-quest.md');
    assert(fs.existsSync(questFile), 'Quest scaffold file missing');
    assert(fs.readFileSync(questFile, 'utf8').includes('# lost-quest'), 'Quest scaffold missing heading');

    const areaFile = path.join(root, 'scenario/areas/default-area.md');
    assert(fs.existsSync(areaFile), 'Default area scaffold missing');

    const stateAfter = JSON.parse(fs.readFileSync(path.join(root, 'player-data/runtime/state.json'), 'utf8'));
    assert.strictEqual(stateAfter.current_area_id, 'default-area', 'State did not fallback to default-area');
  })();

  // remedy:orphans no-op when files exist
  (() => {
    const root = createTempGameRoot();
    writeJson(root, 'player-data/runtime/state.json', {
      current_area_id: 'existing-area',
      active_quests: [{ quest_id: 'existing-quest' }],
    });
    fs.mkdirSync(path.join(root, 'scenario/quests'), { recursive: true });
    fs.mkdirSync(path.join(root, 'scenario/areas'), { recursive: true });
    fs.writeFileSync(path.join(root, 'scenario/quests/existing-quest.md'), '# Existing Quest\n', 'utf8');
    fs.writeFileSync(path.join(root, 'scenario/areas/existing-area.md'), '# Existing Area\n', 'utf8');

    const result = remedyOrphans({ base: root });
    assert.strictEqual(result.createdQuests.length, 0, 'Should not create quest scaffold when file exists');
    assert.strictEqual(result.stateUpdated, false, 'State should remain unchanged');
  })();

  console.log('auto-remedy tests passed.');
})();
