import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { main as copyBlankGame } from '../scripts/copy-blank-game';

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TS_NODE_CMD = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function createTempWorkspace(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'blank-game-workspace-'));
}

function runValidate(gamePath: string): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(
    TS_NODE_CMD,
    ['ts-node', '--project', 'tsconfig.json', 'src/cli/validate.ts', '--path', gamePath, '--run-id', 'blank-test', '--summary'],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    },
  );
  return { status: result.status ?? 0, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

(function runBlankGameTests() {
  // Copy blank game via helper script and ensure validate passes.
  (() => {
    const workspace = createTempWorkspace();
    const dest = path.join(workspace, 'games', 'blank-copy');

    copyBlankGame(['node', 'copy-blank-game', '--dest', dest]);

    assert(fs.existsSync(path.join(dest, 'manifest', 'entry.json')), 'Manifest should be copied to destination');
    assert(fs.existsSync(path.join(dest, 'samples', 'blank-game')) === false, 'Destination should only contain blank game files');

    const result = runValidate(dest);
    assert.strictEqual(result.status, 0, `Blank game validate run failed:\n${result.stdout}\n${result.stderr}`);
  })();

  // Copy twice with --force and ensure README exists in destination root.
  (() => {
    const workspace = createTempWorkspace();
    const dest = path.join(workspace, 'games', 'blank-force');

    copyBlankGame(['node', 'copy-blank-game', '--dest', dest]);
    const readmePath = path.join(dest, 'README.md');
    fs.writeFileSync(readmePath, 'temporary change', 'utf8');

    copyBlankGame(['node', 'copy-blank-game', '--dest', dest, '--force']);

    const readmeContents = fs.readFileSync(readmePath, 'utf8');
    assert(readmeContents.includes('Blank Game Skeleton'), 'Force copy should restore README contents from template');
  })();

  console.log('blank-game tests passed.');
})();
