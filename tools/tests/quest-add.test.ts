import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'quest-add-test-'));
}

function writeJson(base: string, relPath: string, data: unknown): string {
  const target = path.join(base, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return target;
}

function writeFile(base: string, relPath: string, contents: string): string {
  const target = path.join(base, relPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
  return target;
}

(function runQuestAddTests() {
  const distToolsDir = path.resolve(__dirname, '..', '..', 'dist', 'tools');
  const scriptPath = path.join(distToolsDir, 'quests', 'add-quest.js');

  // Array format available.json + exploration hook automation
  (() => {
    const root = createTempGameRoot();
    writeJson(root, 'scenario/quests/available.json', []);
    writeJson(root, 'scenario/quests/unlock-triggers.json', {});
    writeJson(root, 'player-data/runtime/exploration-log.json', []);
    writeFile(
      root,
      'scenario/areas/default-area.md',
      `# Default Area
## Description
A bustling hub that easily reaches over sixty characters to satisfy validators.
## Points of interest
- Market square
- Watchtower overlook
## Notes
- NPC: Commander Aeris oversees defenses.
## Connections
- [[training-grounds]]
## Conditions
- Reputation Friendly with militia.
## Threats
- Wolves in the outskirts.
`,
    );

    const title = 'Trial of the Watch';
    const questId = 'trial-of-the-watch';

    const result = spawnSync(
      'node',
      [
        scriptPath,
        '--path',
        root,
        '--title',
        title,
        '--areas',
        'default-area',
        '--steps',
        'Scout the outskirts|Break the siege lines',
        '--hooks',
        'Militia calls for aid|Rumors of sabotage',
        '--encounters',
        'Ambush at the wall|Siege beast assault',
        '--unlock',
        'militia:trusted',
        '--unlock-requires',
        'quest-alpha|quest-beta',
        '--exploration-hook',
        '--auto-rewards-breakdown',
      ],
      { encoding: 'utf8' },
    );

    assert.strictEqual(result.status, 0, `quest:add failed: ${result.stderr || result.stdout}`);

    const questFile = path.join(root, 'scenario', 'quests', `${questId}.md`);
    assert(fs.existsSync(questFile), 'Quest markdown file was not created');
    const questContent = fs.readFileSync(questFile, 'utf8');
    ['# Trial of the Watch', '## Summary', '## Story', '## Hooks', '## Encounters', '## Steps', '## Rewards', '## Linked Areas'].forEach(
      (section) => {
        assert(questContent.includes(section), `Expected quest content to include ${section}`);
      },
    );
    assert(questContent.includes('[[default-area]]'), 'Linked Areas section missing area reference');

    const available = JSON.parse(fs.readFileSync(path.join(root, 'scenario/quests/available.json'), 'utf8'));
    assert(Array.isArray(available), 'Expected available.json to remain array format');
    assert(
      available.some((entry) => entry.quest_id === questId && entry.title === title),
      'Available list missing new quest entry',
    );

    const unlock = JSON.parse(fs.readFileSync(path.join(root, 'scenario/quests/unlock-triggers.json'), 'utf8'));
    assert(Array.isArray(unlock[questId]), 'Unlock trigger should be stored as array when requires provided');
    assert.deepStrictEqual(
      unlock[questId],
      ['militia:trusted', 'quest-alpha', 'quest-beta'],
      'Unlock trigger did not merge policy and requirements',
    );

    const logEntries = JSON.parse(fs.readFileSync(path.join(root, 'player-data/runtime/exploration-log.json'), 'utf8'));
    assert(Array.isArray(logEntries) && logEntries.length === 1, 'Exploration log missing entry for linked area');
    const logEntry = logEntries[0];
    assert.strictEqual(logEntry.area_id, 'default-area', 'Exploration entry should target linked area');
    assert(Array.isArray(logEntry.tags) && logEntry.tags.includes(`quest:${questId}`), 'Exploration entry missing quest tag');

    const duplicate = spawnSync('node', [scriptPath, '--path', root, '--title', title], { encoding: 'utf8' });
    assert.notStrictEqual(duplicate.status, 0, 'Second quest:add run should fail for duplicate quest');
  })();

  // Map format available.json + explicit quest_id
  (() => {
    const root = createTempGameRoot();
    writeJson(root, 'scenario/quests/available.json', { 'existing-quest': 'Existing Quest' });
    writeJson(root, 'scenario/quests/unlock-triggers.json', { 'existing-quest': 'always' });
    writeFile(
      root,
      'scenario/areas/harbor.md',
      `# Harbor
## Description
Harbor description exceeding sixty characters to satisfy validators.
## Points of interest
- Dockside bazaar
## Notes
- NPC: Quartermaster Orlin`,
    );

    const result = spawnSync(
      'node',
      [scriptPath, '--path', root, '--id', 'supply-run', '--title', 'Supply Run North', '--areas', 'harbor'],
      { encoding: 'utf8' },
    );

    assert.strictEqual(result.status, 0, `quest:add failed on map format: ${result.stderr || result.stdout}`);

    const available = JSON.parse(fs.readFileSync(path.join(root, 'scenario/quests/available.json'), 'utf8'));
    assert.strictEqual(available['supply-run'], 'Supply Run North', 'Expected map format to include new quest entry');

    const unlock = JSON.parse(fs.readFileSync(path.join(root, 'scenario/quests/unlock-triggers.json'), 'utf8'));
    assert.strictEqual(unlock['supply-run'], 'always', 'Default unlock policy should be "always" when not provided');

    const questFile = path.join(root, 'scenario/quests/supply-run.md');
    assert(fs.existsSync(questFile), 'Quest markdown file missing for explicit id');
  })();

  console.log('quest-add tests passed.');
})();
