#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

interface QuestSpec {
  path: string;
  title: string;
  summary?: string;
}

interface ContentSetCliArgs {
  game: string;
  basePath: string | null;
  id: string | null;
  title: string | null;
  description: string | null;
  scenarioIndex: string | null;
  capabilitiesFile: string | null;
  capabilitiesTemplatePath: string | null;
  unlockCondition: string | null;
  defaultEnabled: boolean;
  stateNamespace: string | null;
  notes: string | null;
  stateTemplatePath: string | null;
  skipFiles: boolean;
  skipState: boolean;
  quests: QuestSpec[];
  preset: string | null;
}

interface ContentSetPreset {
  id: string;
  title: string;
  description?: string;
  scenarioIndex?: string;
  capabilitiesFile?: string;
  capabilitiesTemplatePath?: string;
  unlockCondition?: string;
  defaultEnabled?: boolean;
  stateNamespace?: string;
  notes?: string;
  stateTemplatePath?: string;
  quests?: QuestSpec[];
}

const CONTENT_SET_PRESETS: Record<string, ContentSetPreset> = {
  'laut-stronghold': {
    id: 'laut-stronghold',
    title: 'Лаут — войнушкото селище',
    description: 'Тактически DLC около отбраната на селището Лаут с ward ритуали, археология и шпионаж.',
    scenarioIndex: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
    capabilitiesFile: 'CONFIG/laut-stronghold.capabilities.json',
    capabilitiesTemplatePath: 'tools/templates/content-set/laut-stronghold.capabilities.json',
    stateTemplatePath: 'tools/templates/content-set/laut-stronghold.state.json',
    unlockCondition: "state.laut.alliance >= 'trusted'",
    stateNamespace: 'laut_stronghold',
    notes: 'Stronghold defense phases, ward rituals, voinuk clan diplomacy.',
    quests: [
      {
        path: 'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-01-shadows.md',
        title: 'Сенки над Лаут',
        summary: 'Разузнаване между воинушките фамилии и safehouse intrigue.',
      },
      {
        path: 'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-02-three-walls.md',
        title: 'Обсадата на Трите стени',
        summary: 'Три защитни линии + ward ритуал в тунелите.',
      },
      {
        path: 'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-03-oath.md',
        title: 'Клетвата към лъча',
        summary: 'Финалният избор между ward, евакуация или сенчест пакт.',
      },
    ],
  },
};

function parseArgs(argv: string[]): ContentSetCliArgs {
  const args: ContentSetCliArgs = {
    game: 'demo',
    basePath: null,
    id: null,
    title: null,
    description: null,
    scenarioIndex: null,
    capabilitiesFile: null,
    capabilitiesTemplatePath: null,
    unlockCondition: null,
    defaultEnabled: false,
    stateNamespace: null,
    notes: null,
    stateTemplatePath: null,
    skipFiles: false,
    skipState: false,
    quests: [],
    preset: null,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) {
          args.game = next;
          i += 1;
        }
        break;
      case '--path':
      case '-p':
        if (next) {
          args.basePath = next;
          i += 1;
        }
        break;
      case '--id':
        if (next) {
          args.id = next;
          i += 1;
        }
        break;
      case '--title':
        if (next) {
          args.title = next;
          i += 1;
        }
        break;
      case '--description':
        if (next) {
          args.description = next;
          i += 1;
        }
        break;
      case '--preset':
        if (next) {
          args.preset = next;
          i += 1;
        }
        break;
      case '--quest':
        if (next) {
          const spec = parseQuestArg(next);
          if (spec) {
            args.quests.push(spec);
          } else {
            console.warn(`[WARN] Unable to parse --quest value '${next}'. Expected format path::Title[::Summary].`);
          }
          i += 1;
        }
        break;
      case '--scenario-index':
        if (next) {
          args.scenarioIndex = next;
          i += 1;
        }
        break;
      case '--capabilities-file':
        if (next) {
          args.capabilitiesFile = next;
          i += 1;
        }
        break;
      case '--capabilities-template':
        if (next) {
          args.capabilitiesTemplatePath = next;
          i += 1;
        }
        break;
      case '--unlock':
        if (next) {
          args.unlockCondition = next;
          i += 1;
        }
        break;
      case '--default-enabled':
        args.defaultEnabled = true;
        break;
      case '--state-namespace':
        if (next) {
          args.stateNamespace = next;
          i += 1;
        }
        break;
      case '--notes':
        if (next) {
          args.notes = next;
          i += 1;
        }
        break;
      case '--state-template':
        if (next) {
          args.stateTemplatePath = next;
          i += 1;
        }
        break;
      case '--no-files':
        args.skipFiles = true;
        break;
      case '--no-state':
        args.skipState = true;
        break;
      default:
        break;
    }
  }

  return args;
}

function ensureDirForFile(fp: string): void {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
}

function writeJson(fp: string, data: unknown): void {
  ensureDirForFile(fp);
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readJson<T>(fp: string): T {
  const raw = fs.readFileSync(fp, 'utf8');
  return JSON.parse(raw) as T;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function renderScenarioTemplate(title: string, id: string, description?: string | null): string {
  const intro = description?.trim()
    ? description.trim()
    : 'Добави кратко описание за кампанията и нейните теми.';
  return `# ${title}

${intro}

| # | Quest | Summary |
|---|-------|---------|
| 1 | [[${id}-quest-01]] | TODO: основен куест |

> Създай таблица с куестове и връзки към \`scenario/quests\` файлове за този content set.
`;
}

function renderQuestTemplate(title: string, summary?: string, contentSetId?: string): string {
  const intro = summary?.trim() || 'Резюмирай основния конфликт, сетъп и очаквани предизвикателства.';
  const hook = contentSetId ? `content_sets.${contentSetId}.state` : 'content_sets.<id>.state';
  return `# ${title}

> ${intro}

## Сцена A
- TODO: детайлизирай първа сцена / setup.

## Сцена B
- TODO: основен конфликт / избори.

## Сцена C
- TODO: кулминация и последици.

## State Hooks
\`\`\`json
{
  "${hook}": {
    "example_field": "update"
  }
}
\`\`\`
`;
}

function renderCapabilitiesTemplate(title: string): string {
  const key = slugify(title) || 'content-set';
  return `${JSON.stringify(
    {
      [`${key}_momentum`]: {
        enabled: true,
        desc: `${title} momentum meter`,
        min: 0,
        max: 100,
      },
    },
    null,
    2,
  )}\n`;
}

function main() {
  const args = parseArgs(process.argv);
  const presetKey = args.preset?.trim() || null;
  const preset = presetKey ? CONTENT_SET_PRESETS[presetKey] : null;
  if (presetKey && !preset) {
    console.error(`[ERROR] Unknown preset '${presetKey}'. Available presets: ${Object.keys(CONTENT_SET_PRESETS).join(', ')}`);
    process.exit(1);
  }
  const manifestId = args.id ? slugify(args.id) : preset?.id ? slugify(preset.id) : null;
  if (!manifestId) {
    console.error('[ERROR] Missing required --id (slug).');
    process.exit(1);
  }
  const title = args.title?.trim() || preset?.title?.trim();
  if (!title) {
    console.error('[ERROR] Missing required --title.');
    process.exit(1);
  }
  const description = args.description?.trim() ?? preset?.description ?? null;

  const baseDir = args.basePath ? path.resolve(args.basePath) : path.resolve('games', args.game);
  const manifestPath = path.join(baseDir, 'manifest/entry.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`[ERROR] manifest/entry.json not found at ${manifestPath}`);
    process.exit(1);
  }

  const manifest = readJson<Record<string, unknown>>(manifestPath);
  const contentSetsRaw = Array.isArray(manifest.content_sets) ? manifest.content_sets : [];
  if (contentSetsRaw.some((entry) => entry && typeof entry === 'object' && entry.id === manifestId)) {
    console.error(`[ERROR] content set '${manifestId}' already exists in manifest.`);
    process.exit(1);
  }

  const scenarioIndex = args.scenarioIndex || preset?.scenarioIndex || `scenario/dlc/${manifestId}/index.md`;
  const capabilitiesFile = args.capabilitiesFile || preset?.capabilitiesFile || `config/${manifestId}.capabilities.json`;
  const unlockCondition = args.unlockCondition?.trim() || preset?.unlockCondition || undefined;
  const stateNamespace = args.stateNamespace || preset?.stateNamespace || manifestId.replace(/-/g, '_');
  const notes = args.notes?.trim() || preset?.notes || undefined;
  const defaultEnabled = args.defaultEnabled || Boolean(preset?.defaultEnabled);
  const capabilitiesTemplatePath = args.capabilitiesTemplatePath || preset?.capabilitiesTemplatePath || null;
  const stateTemplatePath = args.stateTemplatePath || preset?.stateTemplatePath || null;
  const questSpecs = args.quests.length > 0 ? args.quests : preset?.quests ?? [];

  const contentSetEntry: Record<string, unknown> = {
    id: manifestId,
    title,
    description: description || undefined,
    scenario_index: scenarioIndex,
    capabilities_file: capabilitiesFile,
    unlock_condition: unlockCondition,
    default_enabled: defaultEnabled || undefined,
    state_namespace: stateNamespace,
    notes,
  };

  manifest.content_sets = [...contentSetsRaw, contentSetEntry];
  writeJson(manifestPath, manifest);

  if (!args.skipFiles) {
    const scenarioPath = path.join(baseDir, scenarioIndex);
    if (!fs.existsSync(scenarioPath)) {
      ensureDirForFile(scenarioPath);
      fs.writeFileSync(scenarioPath, renderScenarioTemplate(title, manifestId, description), 'utf8');
      console.log(`[INFO] Created scenario index: ${scenarioIndex}`);
    } else {
      console.log(`[INFO] Scenario file already exists, skipping: ${scenarioIndex}`);
    }

    const capabilitiesPath = path.join(baseDir, capabilitiesFile);
    if (!fs.existsSync(capabilitiesPath)) {
      ensureDirForFile(capabilitiesPath);
      if (capabilitiesTemplatePath) {
        const templateAbs = path.resolve(capabilitiesTemplatePath);
        if (!fs.existsSync(templateAbs)) {
          console.warn(`[WARN] capabilities template not found: ${templateAbs}. Falling back to default.`);
          fs.writeFileSync(capabilitiesPath, renderCapabilitiesTemplate(title), 'utf8');
        } else {
          fs.copyFileSync(templateAbs, capabilitiesPath);
        }
      } else {
        fs.writeFileSync(capabilitiesPath, renderCapabilitiesTemplate(title), 'utf8');
      }
      console.log(`[INFO] Created capabilities file: ${capabilitiesFile}`);
    } else {
      console.log(`[INFO] Capabilities file already exists, skipping: ${capabilitiesFile}`);
    }

    questSpecs.forEach((spec) => {
      const questPath = path.join(baseDir, spec.path);
      if (fs.existsSync(questPath)) {
        console.log(`[INFO] Quest file already exists, skipping: ${spec.path}`);
        return;
      }
      ensureDirForFile(questPath);
      const questContent = renderQuestTemplate(spec.title, spec.summary, manifestId);
      fs.writeFileSync(questPath, questContent, 'utf8');
      console.log(`[INFO] Created quest file: ${spec.path}`);
    });
  }

  if (!args.skipState) {
    const statePath = path.join(baseDir, 'player-data/runtime/state.json');
    if (fs.existsSync(statePath)) {
      const state = readJson<Record<string, unknown>>(statePath);
      const contentState = (state.content_sets && typeof state.content_sets === 'object'
        ? { ...(state.content_sets as Record<string, unknown>) }
        : {}) as Record<string, unknown>;
      if (!contentState[manifestId]) {
        let templateState: unknown | undefined;
        if (stateTemplatePath) {
          const templateAbs = path.resolve(stateTemplatePath);
          if (fs.existsSync(templateAbs)) {
            templateState = readJson<unknown>(templateAbs);
          } else {
            console.warn(`[WARN] state template not found: ${templateAbs}. Skipping template merge.`);
          }
        }
        contentState[manifestId] = {
          enabled: defaultEnabled,
          state: templateState,
          notes: 'TODO: Populate runtime progress for this content set.',
        };
        state.content_sets = contentState;
        writeJson(statePath, state);
        console.log(`[INFO] Added runtime state stub for content set '${manifestId}'.`);
      }
    }
  }

  console.log(`[SUCCESS] Added content set '${manifestId}' to manifest at ${manifestPath}.`);
  console.log(`Scenario index: ${scenarioIndex}`);
  console.log(`Capabilities file: ${capabilitiesFile}`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('[ERROR]', message);
  process.exit(1);
}

function parseQuestArg(raw: string): QuestSpec | null {
  const parts = raw.split('::');
  if (parts.length < 2) return null;
  const [questPath, title, summary] = parts;
  if (!questPath?.trim() || !title?.trim()) return null;
  return {
    path: questPath.trim(),
    title: title.trim(),
    summary: summary?.trim(),
  };
}
