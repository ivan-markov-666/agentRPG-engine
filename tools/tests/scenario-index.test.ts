import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'scenario-index-test-'));
}

function writeFile(base: string, relative: string, contents: string): string {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents, 'utf8');
  return target;
}

(function runScenarioIndexTests() {
  const distToolsDir = path.resolve(__dirname, '..', '..', 'dist', 'tools');
  const scriptPath = path.join(distToolsDir, 'scenario', 'update-index.js');

  // Successful generation with single quest + area
  (() => {
    const root = createTempGameRoot();
    writeFile(root, 'scenario/quests/available.json', `${JSON.stringify([{ quest_id: 'trial-run', title: 'Trial Run' }], null, 2)}\n`);
    writeFile(root, 'scenario/quests/unlock-triggers.json', `${JSON.stringify({ 'trial-run': 'always' }, null, 2)}\n`);
    writeFile(
      root,
      'scenario/quests/trial-run.md',
      `# Trial Run

## Summary
Prove your readiness by completing a focused combat drill near the outpost perimeter.

## Story
The militia commander needs proof of skill.
`,
    );
    writeFile(
      root,
      'scenario/areas/outpost.md',
      `# Outpost

## Description
Forward operating base with clear lines of sight and defensive positions exceeding sixty chars.
`,
    );

    const result = spawnSync('node', [scriptPath, '--path', root, '--game', 'custom'], { encoding: 'utf8' });
    assert.strictEqual(result.status, 0, `scenario:index failed: ${result.stderr || result.stdout}`);

    const indexPath = path.join(root, 'scenario', 'index.md');
    assert(fs.existsSync(indexPath), 'Expected scenario/index.md to be generated');
    const content = fs.readFileSync(indexPath, 'utf8');
    assert(content.includes('# custom — Scenario Overview'), 'Heading should use provided game name');
    assert(content.includes('| [Trial Run](scenario/quests/trial-run.md) | always | Prove your readiness'), 'Quest row missing data');
    assert(
      content.includes('| [Outpost](scenario/areas/outpost.md) | Forward operating base'),
      'Area row missing description',
    );
  })();

  // Missing quest markdown should fail early
  (() => {
    const root = createTempGameRoot();
    writeFile(root, 'scenario/quests/available.json', `${JSON.stringify([{ quest_id: 'ghost-quest', title: 'Ghost Quest' }], null, 2)}\n`);

    const result = spawnSync('node', [scriptPath, '--path', root], { encoding: 'utf8' });
    assert.notStrictEqual(result.status, 0, 'scenario:index should fail when quest file is missing');
    assert(
      (result.stderr || result.stdout).includes('Quest markdown missing for'),
      'Error output should mention missing quest file',
    );
  })();

  console.log('scenario-index tests passed.');
})();
