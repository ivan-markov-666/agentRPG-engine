const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const { checkCapabilities } = require('../checks/capabilities');
const { checkQuests } = require('../checks/quests');
const { checkRequiredFiles } = require('../checks/files');

function setupGame(files) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-'));
  Object.entries(files).forEach(([rel, data]) => {
    const fp = path.join(base, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    if (typeof data === 'object') {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    } else {
      fs.writeFileSync(fp, data, 'utf8');
    }
  });
  return base;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function runCheck(checkFn, files) {
  const base = setupGame(files);
  const issues = [];
  const ctx = { base, loadJson, issues };
  await checkFn(ctx);
  return issues;
}

(async () => {
  // CAP-UNKNOWN-RUNTIME
  {
    const issues = await runCheck(checkCapabilities, {
      'config/capabilities.json': { mana: { enabled: true } },
      'player-data/runtime/state.json': { stats: { mana: 5, stamina_extra: 3 } },
    });
    assert(issues.some((i) => i.code === 'CAP-UNKNOWN-RUNTIME'), 'Expected CAP-UNKNOWN-RUNTIME');
  }

  // CAP-RUNTIME-RANGE
  {
    const issues = await runCheck(checkCapabilities, {
      'config/capabilities.json': { mana: { enabled: true, min: 0, max: 100 } },
      'player-data/runtime/state.json': { stats: { mana: 120 } },
    });
    assert(issues.some((i) => i.code === 'CAP-RUNTIME-RANGE'), 'Expected CAP-RUNTIME-RANGE');
  }

  // QUEST-LINK and UNLOCK-UNKNOWN
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [{ quest_id: 'main-quest', title: 'Main Quest' }],
      'scenario/quests/main-quest.md': '# Main\n## Summary\ntext\n## Steps\n- step\n## Rewards\n- xp\n\nLink [[missing-area]]',
      'scenario/quests/unlock-triggers.json': { 'missing-quest': 'always' },
    });
    assert(issues.some((i) => i.code === 'QUEST-LINK'), 'Expected QUEST-LINK');
    assert(issues.some((i) => i.code === 'UNLOCK-UNKNOWN'), 'Expected UNLOCK-UNKNOWN');
  }

  // QUEST-CONTENT (missing Rewards)
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [{ quest_id: 'side-quest', title: 'Side Quest' }],
      'scenario/quests/side-quest.md': '# Side\n## Summary\ntext\n## Steps\n- step\n\n', // no Rewards
      'scenario/quests/unlock-triggers.json': {},
    });
    assert(issues.some((i) => i.code === 'QUEST-CONTENT'), 'Expected QUEST-CONTENT');
  }

  // INDEX-EMPTY and MANIFEST-FIELD
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1' }, // missing title/version
      'scenario/index.md': '',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    assert(issues.some((i) => i.code === 'INDEX-EMPTY'), 'Expected INDEX-EMPTY');
    assert(issues.some((i) => i.code === 'MANIFEST-FIELD'), 'Expected MANIFEST-FIELD');
  }

  // Integration: snapshot + strict
  {
    const base1 = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nSome text here that is long enough.',
      'scenario/quests/available.json': [{ quest_id: 'q1', title: 'Quest 1' }],
      'scenario/quests/q1.md': '# Q1\n## Summary\ntext\n## Steps\n- step\n## Rewards\n- xp',
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { stats: {} }, // missing mana
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': { mana: { enabled: true, min: 0, max: 10 } },
    });
    const snapFile = path.join(base1, 'snap.json');
    const cliPath = path.resolve(__dirname, '../index.js');
    // First run produces CAP-RUNTIME (warn) and writes snapshot
    const first = spawnSync('node', [cliPath, '--path', base1, '--json', snapFile], { encoding: 'utf8' });
    assert.strictEqual(first.status, 0, `First run should exit 0, got ${first.status}\n${first.stdout}\n${first.stderr}`);
    // Second run with stats fixed, snapshot should report resolved CAP-RUNTIME
    fs.writeFileSync(path.join(base1, 'player-data/runtime/state.json'), JSON.stringify({ stats: { mana: 5 } }, null, 2));
    const second = spawnSync('node', [cliPath, '--path', base1, '--json', snapFile, '--append', '--snapshot', snapFile], { encoding: 'utf8' });
    assert.strictEqual(second.status, 0, `Second run should exit 0, got ${second.status}\n${second.stdout}\n${second.stderr}`);
    assert(second.stdout.includes('Resolved: CAP-RUNTIME'), 'Snapshot should report resolved CAP-RUNTIME');
    // Strict mode should fail when warning exists
    fs.writeFileSync(path.join(base1, 'player-data/runtime/state.json'), JSON.stringify({ stats: {} }, null, 2));
    const strictRun = spawnSync('node', [cliPath, '--path', base1, '--strict'], { encoding: 'utf8' });
    assert.strictEqual(strictRun.status, 1, 'Strict should exit with error when WARN present');
  }

  // YAML fallback (expects WARN if yaml module missing)
  {
    const base = setupGame({
      'config/capabilities.yml': 'mana:\n  enabled: true\n',
    });
    const issues = [];
    const ctx = { base, loadJson, issues };
    await checkCapabilities(ctx);
    const hasYamlWarn = issues.some((i) => i.code === 'YAML-NOT-AVAILABLE' || i.code === 'YAML-PARSE');
    assert(hasYamlWarn, 'Expected YAML warning when parsing YAML without parser');
  }

  // Exploration empty when enabled
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nSome text here that is long enough.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { exploration_enabled: true },
      'player-data/runtime/completed-quests.json': [],
      'player-data/runtime/exploration-log.json': [],
      'config/capabilities.json': {},
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-EMPTY'), 'Expected EXPLORATION-EMPTY');
  }

  // Summary-only and ignore codes
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\ntext long enough to pass.',
      'scenario/quests/available.json': [{ quest_id: 'q1', title: 'Q1' }],
      'scenario/quests/q1.md': '# Q1\n## Summary\ns\n## Steps\n- s\n## Rewards\n- r\n',
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { stats: {} }, // missing mana -> CAP-RUNTIME
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': { mana: { enabled: true } },
    });
    const cliPath = path.resolve(__dirname, '../index.js');
    const out = spawnSync('node', [cliPath, '--path', base, '--summary'], { encoding: 'utf8' });
    assert(out.stdout.includes('Summary:'), 'Summary mode should print summary line');
    const outIgnore = spawnSync('node', [cliPath, '--path', base, '--summary', '--ignore', 'CAP-RUNTIME'], { encoding: 'utf8' });
    assert(outIgnore.stdout.includes('Summary: 0 error(s), 0 warning(s)'), 'Ignore should remove CAP-RUNTIME warning');
  }

  console.log('All validator tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
