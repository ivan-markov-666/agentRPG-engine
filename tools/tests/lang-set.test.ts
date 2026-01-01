import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { updateSessionLanguage } from '../scripts/set-language';

function createGameWorkspace(): { root: string; sessionPath: string } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-set-test-'));
  const gameDir = path.join(root, 'games', 'demo', 'player-data');
  fs.mkdirSync(gameDir, { recursive: true });
  const sessionPath = path.join(gameDir, 'session-init.json');
  fs.writeFileSync(sessionPath, JSON.stringify({ preferred_language: 'en', debug: false }, null, 2));
  return { root, sessionPath };
}

(function runLangSetTests() {
  // Updates language and debug flag via --game lookup
  (() => {
    const { root, sessionPath } = createGameWorkspace();

    updateSessionLanguage({ cwd: root, game: 'demo', language: 'bg', debug: true });

    const updated = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
    assert.strictEqual(updated.preferred_language, 'bg');
    assert.strictEqual(updated.debug, true);
  })();

  // Supports --path override when game folder differs
  (() => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lang-set-path-'));
    const target = path.join(root, 'custom');
    fs.mkdirSync(path.join(target, 'player-data'), { recursive: true });
    const sessionPath = path.join(target, 'player-data', 'session-init.json');
    fs.writeFileSync(sessionPath, JSON.stringify({ preferred_language: 'en' }, null, 2));

    updateSessionLanguage({ cwd: root, pathOverride: target, language: 'de', debug: false });

    const updated = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
    assert.strictEqual(updated.preferred_language, 'de');
    assert.strictEqual(updated.debug, false);
  })();

  console.log('lang-set tests passed.');
})();
