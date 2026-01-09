import path from 'path';

import { LocalFsHostAdapter, loadGameRuntimeSnapshot, loadSaveFile, loadSaveIndex } from '../runtime';

function ensureRelativeToBase(baseDir: string, targetPath: string): string {
  if (!path.isAbsolute(targetPath)) {
    return targetPath;
  }
  const rel = path.relative(baseDir, targetPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`[RUNTIME][SAVE] Save path escapes base dir: ${targetPath}`);
  }
  return rel || '.';
}

interface CliArgs {
  path: string | null;
  debug: boolean;
  save: string | null;
  saveId: string | null;
  contentSet: string | null;
  listContentSets: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    path: null,
    debug: false,
    save: null,
    saveId: null,
    contentSet: null,
    listContentSets: false,
  };
  const valueFlags = new Set(['--path', '-p', '--save', '--save-id', '--content-set']);

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const needsValue = valueFlags.has(flag);
    const nextValue = needsValue ? argv[i + 1] : null;

    if (needsValue) {
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error(`Flag ${flag} expects a value`);
      }
    }

    switch (flag) {
      case '--path':
      case '-p':
        args.path = argv[++i];
        break;
      case '--save':
        args.save = argv[++i];
        break;
      case '--save-id':
        args.saveId = argv[++i];
        break;
      case '--content-set':
        args.contentSet = argv[++i];
        break;
      case '--list-content-sets':
        args.listContentSets = true;
        break;
      case '--debug':
        args.debug = true;
        break;
      default:
        if (flag.startsWith('-')) throw new Error(`Unknown flag: ${flag}`);
        throw new Error(`Unexpected argument: ${flag}`);
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const baseDir = args.path ? path.resolve(args.path) : null;

  if (args.save || args.saveId) {
    if (!baseDir) {
      console.error('Using --save or --save-id requires --path games/<gameId> to resolve files relative to the game.');
      process.exit(1);
      return;
    }

    const host = new LocalFsHostAdapter(baseDir);

    let saveRelPath: string | null = null;
    if (args.save) {
      saveRelPath = ensureRelativeToBase(baseDir, path.resolve(baseDir, args.save));
    } else if (args.saveId) {
      const index = await loadSaveIndex(host);
      const entry = index.find((item) => item.save_id === args.saveId);
      if (!entry) {
        console.error(`[RUNTIME][SAVE] save_id '${args.saveId}' not found in player-data/saves/index.json`);
        process.exit(1);
        return;
      }
      saveRelPath = entry.file_path;
    }

    if (!saveRelPath) {
      console.error('[RUNTIME][SAVE] No save path resolved.');
      process.exit(1);
      return;
    }

    const normalizedSavePath = ensureRelativeToBase(baseDir, path.resolve(baseDir, saveRelPath));
    const saveFile = await loadSaveFile(host, normalizedSavePath);

    console.log(`Save ID: ${saveFile.save_id}`);
    console.log(`Summary: ${saveFile.summary}`);
    console.log(`Cursor Scene: ${saveFile.cursor.scene_id}`);
    if (saveFile.created_at) console.log(`Created At: ${saveFile.created_at}`);
    if (args.debug) {
      console.log(JSON.stringify(saveFile, null, 2));
    }
    return;
  }

  if (!baseDir) {
    console.error(
      'Usage: npm run runtime -- --path games/<gameId> [--debug] [--list-content-sets] [--content-set <id>] | --path games/<gameId> --save <rel/path> [--debug] | --path games/<gameId> --save-id <id> [--debug]',
    );
    process.exit(1);
    return;
  }

  const host = new LocalFsHostAdapter(baseDir);
  const snapshot = await loadGameRuntimeSnapshot(host);

  if (args.listContentSets) {
    if (!snapshot.contentSets.length) {
      console.log('No content sets defined in manifest.');
    } else {
      console.log('Content sets:');
      snapshot.contentSets.forEach((set) => {
        console.log(
          ` - ${set.id}${set.enabled ? ' [enabled]' : ''} → scenario=${set.scenarioIndex}, capabilities=${set.capabilitiesFile ?? '<inherit>'}`,
        );
      });
    }
    if (!args.debug) {
      console.log('');
    }
  }

  const resolvedContentSet = (() => {
    if (!snapshot.contentSets.length) return null;
    if (args.contentSet) {
      return snapshot.contentSets.find((set) => set.id === args.contentSet) || null;
    }
    return snapshot.contentSets.find((set) => set.enabled) ?? snapshot.contentSets[0] ?? null;
  })();

  if (args.contentSet && !resolvedContentSet) {
    console.error(`Content set '${args.contentSet}' not found in manifest.`);
    process.exit(1);
    return;
  }

  if (args.debug) {
    console.log(JSON.stringify(snapshot, null, 2));
  } else {
    console.log(`Loaded: ${snapshot.manifest.title} (${snapshot.manifest.id}) v${snapshot.manifest.version}`);
    const lang = snapshot.sessionInit?.preferred_language;
    if (lang) console.log(`preferred_language: ${lang}`);
    if (resolvedContentSet) {
      console.log(
        `Active content set: ${resolvedContentSet.id} (${resolvedContentSet.enabled ? 'enabled' : 'disabled'})`,
      );
      console.log(`Scenario index: ${resolvedContentSet.scenarioIndex}`);
      if (resolvedContentSet.capabilitiesFile) {
        console.log(`Capabilities file: ${resolvedContentSet.capabilitiesFile}`);
      }
    } else if (snapshot.contentSets.length === 0) {
      console.log('No content sets declared; using manifest defaults.');
    }
  }
}

main().catch((err) => {
  const e = err as Error;
  console.error('[ERROR][RUNTIME]', e.message);
  process.exit(1);
});
