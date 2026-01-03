import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

function setupGame(files: Record<string, unknown>): string {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'exploration-lint-'));
  Object.entries(files).forEach(([rel, data]) => {
    const fp = path.join(base, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  });
  return base;
}

function runLint(baseDir: string, extraArgs: string[] = []): { code: number; stdout: string; stderr: string } {
  const cliPath = path.resolve(__dirname, 'lint-log.ts');
  const result = spawnSync(
    process.execPath,
    [cliPath, '--dir', baseDir, ...extraArgs],
    { encoding: 'utf8' },
  );
  return { code: result.status ?? 0, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

(async () => {
  // Lint handles legacy types, missing tags, and schema
  {
    const base = setupGame({
      'scenario/areas/forest.md': '# Forest\nContent',
      'scenario/quests/available.json': [{ quest_id: 'quest-1', title: 'Quest One' }],
      'scenario/quests/quest-1.md': '# Quest One\n## Summary\nLong enough summary.\n',
      'player-data/runtime/exploration-log.json': [
        {
          id: 'forest-legacy',
          title: 'Forest Legacy',
          type: 'poi',
          area_id: 'forest',
          quest_id: 'quest-1',
          description:
            'Legacy entry referencing existing area/quest but missing required tags to ensure lint catches legacy conversions.',
          added_at: '2025-12-01T00:00:00.000Z',
          origin: 'player-request',
          tags: [],
        },
      ],
    });
    const { code, stdout } = runLint(base);
    assert.strictEqual(code, 0, 'lint should exit 0 with warnings');
    assert(stdout.includes('EXPLORATION-TYPE-LEGACY'), 'Should warn about legacy type');
    assert(stdout.includes('EXPLORATION-TAG-AREA'), 'Should warn about missing area tag');
    assert(stdout.includes('EXPLORATION-TAG-QUEST'), 'Should warn about missing quest tag');
  }

  // Lint errors on schema violations and missing quest file
  {
    const base = setupGame({
      'scenario/areas/landing.md': '# Landing\nContent',
      'scenario/quests/available.json': [{ quest_id: 'quest-missing', title: 'Missing Quest' }],
      'player-data/runtime/exploration-log.json': [
        {
          id: 'landing-entry',
          title: 'Landing Entry',
          type: 'quest',
          quest_id: 'quest-missing',
          description: 'Hook description long enough to avoid schema warnings for description length.',
          added_at: '2025-12-01T00:00:00.000Z',
          origin: 'gm-suggested',
          tags: ['hook'],
        },
      ],
    });
    const { code, stdout } = runLint(base, ['--strict']);
    assert.strictEqual(code, 1, 'strict lint should exit 1 when errors present');
    assert(stdout.includes('EXPLORATION-QUEST-FILE'), 'Should warn about missing quest file');
    assert(stdout.includes('EXPLORATION-QUEST-ID'), 'Strict mode should treat missing quest_id as error');
  }
})();
