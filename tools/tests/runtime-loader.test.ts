/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const distRuntimeRoot = path.resolve(__dirname, '..', '..', 'dist', 'runtime');
const { LocalFsHostAdapter } = require(path.join(distRuntimeRoot, 'local-fs-host-adapter.js') as string);
const { loadGameRuntimeSnapshot, loadSaveFile, loadSaveIndex } = require(path.join(
  distRuntimeRoot,
  'loader.js',
) as string);

type FileMap = Record<string, object | string>;

function setupGame(files: FileMap): string {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-loader-test-'));
  Object.entries(files).forEach(([rel, data]) => {
    const fp = path.join(base, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    if (typeof data === 'object' && data !== null) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2), 'utf8');
    } else {
      fs.writeFileSync(fp, data as string, 'utf8');
    }
  });
  return base;
}

(async () => {
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'player-data/session-init.json': { preferred_language: 'en', debug: true },
      'player-data/runtime/state.json': { current_area_id: 'start' },
    });

    const host = new LocalFsHostAdapter(base);
    const snapshot = await loadGameRuntimeSnapshot(host);

    assert.strictEqual(snapshot.manifest.id, 'game-1');
    assert.strictEqual(snapshot.sessionInit.preferred_language, 'en');
    assert.strictEqual(snapshot.state.current_area_id, 'start');
  }

  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-2', title: 'Game 2', version: '0.0.2' },
    });

    const host = new LocalFsHostAdapter(base);
    const snapshot = await loadGameRuntimeSnapshot(host);

    assert.strictEqual(snapshot.manifest.id, 'game-2');
    assert.strictEqual(snapshot.sessionInit, null);
    assert.strictEqual(snapshot.state, null);
  }

  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-save', title: 'Game Save', version: '1.0.0' },
      'player-data/saves/index.json': [
        {
          save_id: 'save-1',
          created_at: '2025-01-01T10:00:00Z',
          scene_id: 'default-area',
          summary: 'First save',
          file_path: 'player-data/saves/save-1.json',
        },
      ],
      'player-data/saves/save-1.json': {
        schema_version: '1.0',
        save_id: 'save-1',
        created_at: '2025-01-01T10:00:00Z',
        scene_id: 'default-area',
        summary: 'First save',
        cursor: { scene_id: 'default-area', depth: 1 },
        state: { current_area_id: 'default-area', stats: { health: 50 } },
      },
    });

    const host = new LocalFsHostAdapter(base);
    const index = await loadSaveIndex(host);
    assert.strictEqual(index.length, 1, 'Expected one save entry');
    assert.strictEqual(index[0].save_id, 'save-1');

    const saveFile = await loadSaveFile(host, index[0].file_path);
    assert.strictEqual(saveFile.save_id, 'save-1');
    assert.strictEqual(saveFile.cursor.scene_id, 'default-area');
    assert.strictEqual(saveFile.cursor.depth, 1);
    assert.strictEqual(saveFile.state.stats.health, 50);
  }

  console.log('runtime-loader tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
