const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const distRuntimeRoot = path.resolve(__dirname, '..', '..', 'dist', 'runtime');
const { LocalFsHostAdapter } = require(path.join(distRuntimeRoot, 'local-fs-host-adapter.js'));
const { loadGameRuntimeSnapshot } = require(path.join(distRuntimeRoot, 'loader.js'));

function setupGame(files) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-loader-test-'));
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

  console.log('runtime-loader tests passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
