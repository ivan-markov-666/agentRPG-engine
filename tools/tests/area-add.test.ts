import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function createTempGameRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'area-add-test-'));
}

(function runAreaAddTests() {
  const distToolsDir = path.resolve(__dirname, '..', '..', 'dist', 'tools');
  const scriptPath = path.join(distToolsDir, 'areas', 'add-area.js');

  // Minimal args rely on placeholders and humanized title
  (() => {
    const root = createTempGameRoot();

    const result = spawnSync('node', [scriptPath, '--path', root, '--id', 'watch-post'], { encoding: 'utf8' });
    assert.strictEqual(result.status, 0, `area:add failed: ${result.stderr || result.stdout}`);

    const areaFile = path.join(root, 'scenario', 'areas', 'watch-post.md');
    assert(fs.existsSync(areaFile), 'Expected area markdown file');

    const content = fs.readFileSync(areaFile, 'utf8');
    ['# Watch Post', '## Description', '## Points of interest', '## Connections', '## Notes', '## Conditions', '## Threats'].forEach(
      (section) => {
        assert(content.includes(section), `Missing section ${section}`);
      },
    );
    assert(
      content.includes('Describe the vibe, key locations, NPCs'),
      'Placeholder description should be present when missing',
    );
    assert(content.includes('- (poi-id) Name — short hook or gameplay affordance'), 'Expected POI placeholder bullet');
    assert(content.includes('- [[default-area]] main route into the region'), 'Expected connections placeholder bullet');
    assert(
      content.includes('- Entry condition: Friendly reputation with the guard.'),
      'Expected conditions placeholder bullet',
    );
  })();

  // Custom metadata overrides placeholders
  (() => {
    const root = createTempGameRoot();
    const result = spawnSync(
      'node',
      [
        scriptPath,
        '--path',
        root,
        '--id',
        'harbor-district',
        '--title',
        'Harbor District',
        '--description',
        'Bustling docks packed with smugglers, guild merchants, and covert faction agents.',
        '--points',
        'Dockmaster office|Smuggler tunnels',
        '--connections',
        '[[market-square]] main trade lane',
        '--notes',
        'NPC: Quartermaster Orlin|Threat: Saboteurs lurking',
        '--conditions',
        'Requires Harbor Pass',
        '--threats',
        'Supply shortages',
      ],
      { encoding: 'utf8' },
    );

    assert.strictEqual(result.status, 0, `area:add failed with custom args: ${result.stderr || result.stdout}`);

    const content = fs.readFileSync(path.join(root, 'scenario', 'areas', 'harbor-district.md'), 'utf8');
    assert(content.includes('# Harbor District'), 'Custom title should appear in heading');
    assert(content.includes('Bustling docks packed with smugglers'), 'Custom description should be used');
    assert(content.includes('- Dockmaster office'), 'Custom POI bullet should be present');
    assert(content.includes('- [[market-square]] main trade lane'), 'Custom connection should persist');
    assert(content.includes('- NPC: Quartermaster Orlin'), 'Custom note should persist');
    assert(content.includes('- Requires Harbor Pass'), 'Custom condition should persist');
    assert(content.includes('- Supply shortages'), 'Custom threat should persist');
  })();

  // Duplicate protection refuses overwrite
  (() => {
    const root = createTempGameRoot();
    const target = path.join(root, 'scenario', 'areas', 'existing.md');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, '# Existing\n', 'utf8');

    const result = spawnSync('node', [scriptPath, '--path', root, '--id', 'existing'], { encoding: 'utf8' });
    assert.notStrictEqual(result.status, 0, 'Expected area:add to fail when file already exists');
  })();

  console.log('area-add tests passed.');
})();
