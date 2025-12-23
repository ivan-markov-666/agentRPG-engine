const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const { checkCapabilities } = require('../checks/capabilities');
const { checkQuests } = require('../checks/quests');
const { checkAreas } = require('../checks/areas');
const { checkRequiredFiles } = require('../checks/files');
const { checkSchemas } = require('../checks/schema');

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
  // EXPLORATION description/tags minimum and preview mismatch
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Index\nLong enough text to pass validation.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        exploration_enabled: true,
        exploration_log_preview: ['unknown-entry']
      },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'forest-scout',
          title: 'Forest scout',
          type: 'poi',
          area_id: 'forest',
          description: 'Too short.',
          tags: []
        }
      ],
      'scenario/areas/forest.md': '# Forest\nContent',
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {}
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-DESCRIPTION-SHORT'), 'Expected EXPLORATION-DESCRIPTION-SHORT');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAGS-MIN'), 'Expected EXPLORATION-TAGS-MIN');
    assert(issues.some((i) => i.code === 'EXPLORATION-PREVIEW-MISMATCH'), 'Expected EXPLORATION-PREVIEW-MISMATCH');
  }

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

  // CAP-SCHEMA guardrail (negative min)
  {
    const base = setupGame({
      'config/capabilities.json': { health: { enabled: true, min: -5, max: 100 } },
      'player-data/runtime/state.json': { stats: {} },
    });
    const issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'CAP-SCHEMA'), 'Expected CAP-SCHEMA for invalid min');
  }

  // STATE-SCHEMA guardrail (runtime out of range)
  {
    const base = setupGame({
      'config/capabilities.json': { health: { enabled: true, min: 0, max: 100 } },
      'player-data/runtime/state.json': { stats: { health: 150, reputation: { guild: 200 } } },
    });
    const issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'STATE-SCHEMA'), 'Expected STATE-SCHEMA for health 150');
  }

  // EXPLORATION-SCHEMA guardrail
  {
    const base = setupGame({
      'player-data/runtime/exploration-log.json': [
        { id: 'bad entry', title: 'City', type: 'unknown', origin: 'gm' }
      ],
    });
    const issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'EXPLORATION-SCHEMA'), 'Expected EXPLORATION-SCHEMA for invalid entry');
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

  // QUEST-ID-DUPLICATE and QUEST-TITLE-SHORT
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [
        { quest_id: 'duplicate', title: 'One' },
        { quest_id: 'duplicate', title: 'Two' }
      ],
      'scenario/quests/duplicate.md': '# Duplicate Quest\n## Summary\ntext that is more than enough characters to skip warnings\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/unlock-triggers.json': { duplicate: 'always' },
    });
    assert(issues.some((i) => i.code === 'QUEST-ID-DUPLICATE'), 'Expected QUEST-ID-DUPLICATE');
    assert(issues.some((i) => i.code === 'QUEST-TITLE-SHORT'), 'Expected QUEST-TITLE-SHORT');
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

  // UNLOCK-MISSING
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [
        { quest_id: 'q-missing-unlock', title: 'Quest Missing Unlock' },
        { quest_id: 'q-has-unlock', title: 'Quest Has Unlock' }
      ],
      'scenario/quests/q-missing-unlock.md': '# Quest Missing Unlock\n## Summary\nThis summary has enough content to avoid warnings.\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/q-has-unlock.md': '# Quest Has Unlock\n## Summary\nThis summary has enough content to avoid warnings.\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/unlock-triggers.json': { 'q-has-unlock': 'always' },
    });
    assert(issues.some((i) => i.code === 'UNLOCK-MISSING'), 'Expected UNLOCK-MISSING');
  }

  // UNLOCK-FORMAT, UNLOCK-EMPTY, UNLOCK-DUPLICATE
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [
        { quest_id: 'quest-a', title: 'Quest Alpha' },
        { quest_id: 'quest-b', title: 'Quest Beta' }
      ],
      'scenario/quests/quest-a.md': '# Quest Alpha\n## Summary\nThis quest has enough description to pass validation by default with some added padding text.\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/quest-b.md': '# Quest Beta\n## Summary\nAnother summary with enough words to pass the minimum length threshold for guardrails.\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/unlock-triggers.json': {
        'quest-a': [' ', 'quest-b', 'quest-b'],
        'quest-b': 42
      },
    });
    assert(issues.some((i) => i.code === 'UNLOCK-FORMAT'), 'Expected UNLOCK-FORMAT for quest-b value type');
    assert(issues.filter((i) => i.code === 'UNLOCK-EMPTY').length >= 1, 'Expected UNLOCK-EMPTY for blank array entry');
    assert(issues.some((i) => i.code === 'UNLOCK-DUPLICATE'), 'Expected UNLOCK-DUPLICATE for repeated condition');
  }

  // QUEST-AREA-BACKLINK
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [{ quest_id: 'forest-quest', title: 'Forest Quest' }],
      'scenario/quests/forest-quest.md': '# Forest Quest\n## Summary\nA long enough description talking about the forest and its dangers while referencing [[forest-area]].\n## Steps\n- Scout the [[forest-area]]\n## Rewards\n- reward\n',
      'scenario/areas/forest-area.md': '# Forest Area\n## Description\nDense trees and whispering spirits inhabit this forest making it mysterious and dangerous for new adventurers.\n## Points of interest\n- Hidden shrine\n## Connections\n- [[default-area]]',
      'scenario/areas/default-area.md': '# Default Area\n## Description\nEnough words to describe this safe haven for more than sixty characters.\n## Points of interest\n- Market stall\n## Connections\n- [[forest-area]]',
      'scenario/quests/unlock-triggers.json': { 'forest-quest': 'always' },
    });
    assert(issues.some((i) => i.code === 'QUEST-AREA-BACKLINK'), 'Expected QUEST-AREA-BACKLINK');
  }

  // AREA structural guardrails
  {
    const issues = await runCheck(checkAreas, {
      'scenario/areas/void.md': '# Void\nJust floating rocks and silence.',
    });
    assert(issues.some((i) => i.code === 'AREA-DESCRIPTION'), 'Expected AREA-DESCRIPTION when section missing');
    assert(issues.some((i) => i.code === 'AREA-POINTS'), 'Expected AREA-POINTS warning');
    assert(issues.some((i) => i.code === 'AREA-CONNECTIONS'), 'Expected AREA-CONNECTIONS warning');
  }

  // AREA link formatting and quest backlink
  {
    const issues = await runCheck(checkAreas, {
      'scenario/areas/valley.md': '# Verdant Valley\n## Description\nThis valley stretches for miles with tiered terraces and an emerald river providing more than sixty characters of lore.\n## Points of interest\nVisit [[quest-hook]] for adventures.\n## Connections\n- [[unknown-area]]\n',
      'scenario/quests/quest-hook.md': '# Quest Hook\n## Summary\nThis is a sufficiently long description for the quest hook without mentioning the valley.\n## Steps\n- step\n## Rewards\n- reward\n',
    });
    assert(issues.some((i) => i.code === 'AREA-POINTS-FORMAT'), 'Expected AREA-POINTS-FORMAT for non-list points section');
    assert(issues.some((i) => i.code === 'AREA-LINK'), 'Expected AREA-LINK for missing target area');
    assert(issues.some((i) => i.code === 'AREA-QUEST-BACKLINK'), 'Expected AREA-QUEST-BACKLINK when quest lacks [[area]] mention');
  }

  // QUEST-ENTRY, QUEST-TITLE-MISMATCH, SUMMARY/STEPS/REWARDS format
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [
        { quest_id: 'main-quest', title: 'Main Quest' },
        { quest_id: 'broken-quest', title: '' },
      ],
      'scenario/quests/main-quest.md': '# Wrong Heading\n## Summary\nToo short.\n## Steps\nDo something without bullet\n## Rewards\nXP\n',
      'scenario/quests/broken-quest.md': '# Broken Quest\n## Summary\nThis summary has enough content to avoid warnings.\n## Steps\n- step\n## Rewards\n- reward\n',
      'scenario/quests/unlock-triggers.json': {},
    });
    assert(issues.some((i) => i.code === 'QUEST-ENTRY'), 'Expected QUEST-ENTRY for missing title');
    assert(issues.some((i) => i.code === 'QUEST-TITLE-MISMATCH'), 'Expected QUEST-TITLE-MISMATCH');
    assert(issues.some((i) => i.code === 'QUEST-SUMMARY-SHORT'), 'Expected QUEST-SUMMARY-SHORT');
    assert(issues.some((i) => i.code === 'QUEST-STEPS-FORMAT'), 'Expected QUEST-STEPS-FORMAT');
    assert(issues.some((i) => i.code === 'QUEST-REWARDS-SHORT'), 'Expected QUEST-REWARDS-SHORT');
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
    const yamlInstalled = (() => {
      try {
        require.resolve('yaml');
        return true;
      } catch (e) {
        return false;
      }
    })();
    if (yamlInstalled) {
      assert(!hasYamlWarn, 'YAML module installed; should parse without warnings');
    } else {
      assert(hasYamlWarn, 'Expected YAML warning when parser is missing');
    }
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

  // Exploration duplicates and missing area checks
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nThis index provides a detailed overview of the campaign and passes the length check.',
      'scenario/quests/available.json': [{ quest_id: 'quest-1', title: 'Quest One' }],
      'scenario/quests/unlock-triggers.json': {},
      'scenario/areas/default-area.md': '# Default area\n',
      'player-data/runtime/state.json': { exploration_enabled: true },
      'player-data/runtime/completed-quests.json': [],
      'player-data/runtime/exploration-log.json': [
        { id: 'cliff-outlook', title: 'Velora Cliff Outlook', type: 'landmark' },
        { id: 'cliff-outlook', title: 'Velora Cliff Outlook', type: 'landmark' },
        { id: 'mistwood-tower', title: 'Mistwood Tower', type: 'poi', area_id: 'missing-area' }
      ],
      'config/capabilities.json': {},
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-DUPLICATE-ID'), 'Expected EXPLORATION-DUPLICATE-ID');
    assert(issues.some((i) => i.code === 'EXPLORATION-DUPLICATE-TITLE'), 'Expected EXPLORATION-DUPLICATE-TITLE');
    assert(issues.some((i) => i.code === 'EXPLORATION-AREA-MISSING'), 'Expected EXPLORATION-AREA-MISSING');
  }

  // Summary-only and ignore codes
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nThis index is long enough to pass the minimum length.',
      'scenario/quests/available.json': [{ quest_id: 'q1', title: 'Quest One' }],
      'scenario/quests/q1.md': '# Quest One\n## Summary\nThis summary contains enough descriptive text to pass validation.\n## Steps\n- Go to the forest\n- Investigate the ruins\n## Rewards\n- 200 XP and a bronze amulet\n',
      'scenario/quests/unlock-triggers.json': { q1: 'always' },
      'player-data/runtime/state.json': { stats: {} }, // missing mana -> CAP-RUNTIME
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': { mana: { enabled: true, min: 0, max: 10 } },
    });
    const cliPath = path.resolve(__dirname, '../index.js');
    const out = spawnSync('node', [cliPath, '--path', base, '--summary'], { encoding: 'utf8' });
    const outCombined = `${out.stdout || ''}${out.stderr || ''}`;
    assert(outCombined.includes('Summary:'), `Summary mode should print summary line\n${outCombined}`);
    const outIgnore = spawnSync('node', [cliPath, '--path', base, '--summary', '--ignore', 'CAP-RUNTIME'], { encoding: 'utf8' });
    const outIgnoreCombined = `${outIgnore.stdout || ''}${outIgnore.stderr || ''}`;
    const m = outIgnoreCombined.match(/Summary:\s*(\d+) error\(s\),\s*(\d+) warning\(s\)/);
    assert(m, `Expected Summary line in output\n${outIgnoreCombined}`);
    assert.strictEqual(Number(m[1]), 0, `Ignore run should have 0 errors\n${outIgnoreCombined}`);
    assert.strictEqual(Number(m[2]), 0, `Ignore should remove CAP-RUNTIME warning\n${outIgnoreCombined}`);
  }

  console.log('All validator tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
