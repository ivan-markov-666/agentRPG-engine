/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

type Issues = Array<{ code: string } & Record<string, unknown>>;
type FileMap = Record<string, unknown>;

const distValidatorRoot = path.resolve(__dirname, '..', '..', '..', 'dist', 'validator');
const { checkCapabilities } = require(path.join(distValidatorRoot, 'checks', 'capabilities.js') as string);
const { checkQuests } = require(path.join(distValidatorRoot, 'checks', 'quests.js') as string);
const { checkAreas } = require(path.join(distValidatorRoot, 'checks', 'areas.js') as string);
const { checkRequiredFiles } = require(path.join(distValidatorRoot, 'checks', 'files.js') as string);
const { checkSchemas } = require(path.join(distValidatorRoot, 'checks', 'schema.js') as string);

function setupGame(files: Record<string, unknown>): string {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'validator-test-'));
  Object.entries(files).forEach(([rel, data]) => {
    const fp = path.join(base, rel);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(
      fp,
      typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`,
      'utf8',
    );
  });
  return base;
}

function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const SAMPLE_QUEST_MARKDOWN = `# Quest Known
## Summary
Detailed summary describing the stakes and motivations to satisfy guardrails.
## Story
The militia prepares a final push to reclaim the watchtower before rival factions intervene.
## Hooks
- Rally point announced at the [[default-area]].
## Encounters
- Siege the outer wall.
## Steps
- Establish supply lines.
- Assault the watchtower.
## Rewards
- XP: 180 XP for leadership.
- Gold: 90 gold coins funded by the council.
- Loot: Banner recovered from the battlements.
- Social: Influence gain with the militia commanders.
## Notes
- NPCs: Commander Aeris coordinates the strike.
## Outcome
- Watchtower secured and signaling restored.
## Aftermath
- Follow-up scouting missions unlock.
## Outcome Hooks
- Hook: Diplomats request protection during negotiations.
## Conditions
- Reputation Friendly with militia.
## Fail State
- Rival faction captures the watchtower and hinders trade.`;

async function runCheck(
  checkFn: (ctx: { base: string; loadJson: typeof loadJson; issues: Issues }) => Promise<void> | void,
  files: FileMap,
): Promise<Issues> {
  const base = setupGame(files);
  const issues: Issues = [];
  const ctx = { base, loadJson, issues };
  await checkFn(ctx);
  return issues;
}

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const SUCCESS_PREFIX = `${GREEN}✔`;
const ERROR_PREFIX = `${RED}✖`;

(async () => {
  // EXPLORATION description/tags minimum and preview mismatch
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1', engine_compat: '1.0.0' },
      'scenario/index.md': '# Index\nLong enough text to pass validation.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        exploration_enabled: true,
        exploration_log_preview: ['unknown-entry'],
      },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'forest-scout',
          title: 'Forest scout',
          type: 'poi',
          area_id: 'forest',
          description: 'Too short.',
          tags: [],
        },
      ],
      'scenario/areas/forest.md': '# Forest\nContent',
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-DESCRIPTION-SHORT'), 'Expected EXPLORATION-DESCRIPTION-SHORT');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAGS-MIN'), 'Expected EXPLORATION-TAGS-MIN');
    assert(issues.some((i) => i.code === 'EXPLORATION-PREVIEW-MISMATCH'), 'Expected EXPLORATION-PREVIEW-MISMATCH');
  }

  // CONTENT-SET-BALKAN-STATE warns when runtime block missing fields / wrapper
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'balkan-trail': {
            enabled: true,
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-BALKAN-STATE'),
      'Expected CONTENT-SET-BALKAN-STATE when runtime fields missing',
    );
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'),
      'Expected CONTENT-SET-STATE-BLOCK when DLC state wrapper missing',
    );
  }

  // CONTENT-SET-BALKAN-STATE satisfied with valid runtime block
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'balkan-trail': {
            enabled: true,
            state: {
              expedition_stage: 'underway',
              convoy_morale: 70,
              supply_tokens: 3,
              alliance_track: {
                byzantine: 1,
                latin: 0,
                voinuk: -1,
              },
              artifact_clues: ['prism_resonance'],
              trail_notes: ['guardian_pass_secured'],
              trails_resolution: 'byzantine',
            },
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-BALKAN-STATE'),
      'Valid Balkan Trail state should not trigger CONTENT-SET-BALKAN-STATE',
    );
    assert(!issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'), 'Proper wrapper should not warn');
  }

  // CONTENT-SET-LAUT dependencies: Balkan Trail missing from manifest
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-REQUIRES-BALKAN'),
      'Expected CONTENT-SET-LAUT-REQUIRES-BALKAN when Balkan Trail missing',
    );
  }

  // CONTENT-SET-LAUT dependencies: Next Guardians missing from manifest
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-REQUIRES-GUARDIANS'),
      'Expected CONTENT-SET-LAUT-REQUIRES-GUARDIANS when Next Guardians missing',
    );
  }

  // CONTENT-SET-LAUT dependencies: unresolved Balkan finale and missing guardian structures
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
          {
            id: 'next-guardians',
            title: 'Next Guardians DLC',
            scenario_index: 'SCENARIOS/DLC/02-next-guardians/index.md',
            capabilities_file: 'CONFIG/next-guardians.capabilities.json',
          },
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'balkan-trail': {
            state: {
              trails_resolution: 'unknown',
            },
          },
          'next-guardians': {
            state: {
              structures: ['barracks'],
              trials_result: '',
            },
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-TRAILS'),
      'Expected CONTENT-SET-LAUT-TRAILS when trails_resolution unresolved',
    );
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-GUARDIANS'),
      'Expected CONTENT-SET-LAUT-GUARDIANS when structures/trials_result missing',
    );
  }
  // CONTENT-SET-LAUT-STATE warns when runtime block missing fields / wrapper
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'laut-stronghold': {
            enabled: true,
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-STATE'),
      'Expected CONTENT-SET-LAUT-STATE when runtime fields missing',
    );
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'),
      'Expected CONTENT-SET-STATE-BLOCK when DLC state wrapper missing',
    );
  }

  // CONTENT-SET-LAUT-STATE satisfied with valid runtime block
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'laut-stronghold': {
            enabled: true,
            state: {
              defense_phase: 'siege',
              stronghold_integrity: 70,
              ward_power: 2,
              woinuk_morale: 65,
              espionage_alert: 1,
              hazard_tokens: 0,
              safehouses: ['clan_ivash'],
              artifact_insight: ['pillar_delta'],
              oath_resolution: 'undecided',
              notes: 'Defensive line holding.',
            },
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-LAUT-STATE'),
      'Valid Laut Stronghold state should not trigger CONTENT-SET-LAUT-STATE',
    );
    assert(!issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'), 'Proper wrapper should not warn');
  }

  // CONTENT-SET-NEXT-GUARDIANS-FILE when DLC assets missing
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'next-guardians',
            title: 'Next Guardians DLC',
            scenario_index: 'SCENARIOS/DLC/02-next-guardians/index.md',
            capabilities_file: 'CONFIG/next-guardians.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-NEXT-GUARDIANS-FILE'),
      'Expected CONTENT-SET-NEXT-GUARDIANS-FILE when DLC files missing',
    );
  }

  // CONTENT-SET-NEXT-GUARDIANS-FILE satisfied when DLC assets exist
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'next-guardians',
            title: 'Next Guardians DLC',
            scenario_index: 'SCENARIOS/DLC/02-next-guardians/index.md',
            capabilities_file: 'CONFIG/next-guardians.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'SCENARIOS/DLC/02-next-guardians/index.md': '# DLC Index\nSummary of quests.',
      'SCENARIOS/DLC/02-next-guardians/dlc-ng-01-initiation.md': '# Quest 1\nDetails.',
      'SCENARIOS/DLC/02-next-guardians/dlc-ng-02-built-citadel.md': '# Quest 2\nDetails.',
      'SCENARIOS/DLC/02-next-guardians/dlc-ng-03-legacy-trials.md': '# Quest 3\nDetails.',
      'CONFIG/next-guardians.capabilities.json': { morale_meter: { enabled: true } },
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-NEXT-GUARDIANS-FILE'),
      'Next Guardians DLC files present should not trigger CONTENT-SET-NEXT-GUARDIANS-FILE',
    );
  }

  // EXPLORATION legacy type + missing tags
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nThis index provides enough narrative context to satisfy length checks for the validator overview.',
      'scenario/areas/forest.md': '# Forest\nDetails about the forest and nearby threats exceeding the minimum length requirement.',
      'scenario/quests/available.json': [{ quest_id: 'quest-1', title: 'Quest One' }],
      'scenario/quests/quest-1.md': SAMPLE_QUEST_MARKDOWN,
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { exploration_enabled: true },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'forest-scout',
          title: 'Forest Scout',
          type: 'poi',
          area_id: 'forest',
          quest_id: 'quest-1',
          description:
            'A patrol through the forest outskirts revealed strange glyphs and the lingering scent of alchemical fire across the ridge.',
          tags: ['scouting']
        }
      ],
      'player-data/runtime/completed-quests.json': []
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-TYPE-LEGACY'), 'Expected EXPLORATION-TYPE-LEGACY');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAG-AREA'), 'Expected EXPLORATION-TAG-AREA');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAG-QUEST'), 'Expected EXPLORATION-TAG-QUEST');
  }

  // CONTENT-SET-BELINTASH-FILE warns when DLC assets missing
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'belintash-crack',
            title: 'Belintash DLC',
            scenario_index: 'SCENARIOS/DLC/01-belintash-crack/index.md',
            capabilities_file: 'CONFIG/belintash-crack.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-BELINTASH-FILE'),
      'Expected CONTENT-SET-BELINTASH-FILE when DLC files missing',
    );
  }

  // CONTENT-SET-BELINTASH-FILE satisfied when DLC assets exist
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'belintash-crack',
            title: 'Belintash DLC',
            scenario_index: 'SCENARIOS/DLC/01-belintash-crack/index.md',
            capabilities_file: 'CONFIG/belintash-crack.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'SCENARIOS/DLC/01-belintash-crack/index.md': '# DLC Index\nSummary of quests.',
      'SCENARIOS/DLC/01-belintash-crack/dlc-bc-01-stabilize.md': '# Quest 1\nDetails.',
      'SCENARIOS/DLC/01-belintash-crack/dlc-bc-02-rescue.md': '# Quest 2\nDetails.',
      'SCENARIOS/DLC/01-belintash-crack/dlc-bc-03-shattered-vision.md': '# Quest 3\nDetails.',
      'CONFIG/belintash-crack.capabilities.json': { momentum: { enabled: true } },
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-BELINTASH-FILE'),
      'Belintash DLC files present should not trigger CONTENT-SET-BELINTASH-FILE',
    );
  }

  // CONTENT-SET-BALKAN-TRAIL-FILE warns when DLC assets missing
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-BALKAN-TRAIL-FILE'),
      'Expected CONTENT-SET-BALKAN-TRAIL-FILE when DLC files missing',
    );
  }

  // CONTENT-SET-BALKAN-TRAIL-FILE satisfied when DLC assets exist
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'balkan-trail',
            title: 'Balkan Trail DLC',
            scenario_index: 'SCENARIOS/DLC/03-balkan-trail/index.md',
            capabilities_file: 'CONFIG/balkan-trail.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'SCENARIOS/DLC/03-balkan-trail/index.md': '# DLC Index\nSummary of quests.',
      'SCENARIOS/DLC/03-balkan-trail/dlc-bt-01-map-of-light.md': '# Quest 1\nDetails.',
      'SCENARIOS/DLC/03-balkan-trail/dlc-bt-02-guardians-pass.md': '# Quest 2\nDetails.',
      'SCENARIOS/DLC/03-balkan-trail/dlc-bt-03-beam-over-salonika.md': '# Quest 3\nDetails.',
      'CONFIG/balkan-trail.capabilities.json': { supply_tokens: { enabled: true } },
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-BALKAN-TRAIL-FILE'),
      'Balkan Trail DLC files present should not trigger CONTENT-SET-BALKAN-TRAIL-FILE',
    );
  }

  // CONTENT-SET-LAUT-FILE warns when DLC assets missing
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-LAUT-FILE'),
      'Expected CONTENT-SET-LAUT-FILE when DLC files missing',
    );
  }

  // CONTENT-SET-LAUT-FILE satisfied when DLC assets exist
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'laut-stronghold',
            title: 'Laut Stronghold DLC',
            scenario_index: 'SCENARIOS/DLC/04-laut-stronghold/index.md',
            capabilities_file: 'CONFIG/laut-stronghold.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'SCENARIOS/DLC/04-laut-stronghold/index.md': '# DLC Index\nSummary of quests.',
      'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-01-shadows.md': '# Quest 1\nDetails.',
      'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-02-three-walls.md': '# Quest 2\nDetails.',
      'SCENARIOS/DLC/04-laut-stronghold/dlc-ls-03-oath.md': '# Quest 3\nDetails.',
      'CONFIG/laut-stronghold.capabilities.json': { stronghold_integrity: { enabled: true } },
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-LAUT-FILE'),
      'Laut Stronghold DLC files present should not trigger CONTENT-SET-LAUT-FILE',
    );
  }

  // CONTENT-SET-BELINTASH-STATE warns when runtime block missing fields
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'belintash-crack',
            title: 'Belintash DLC',
            scenario_index: 'SCENARIOS/DLC/01-belintash-crack/index.md',
            capabilities_file: 'CONFIG/belintash-crack.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'belintash-crack': {
            enabled: true,
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(issues.some((i) => i.code === 'CONTENT-SET-BELINTASH-STATE'), 'Expected CONTENT-SET-BELINTASH-STATE when fields missing');
    assert(
      issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'),
      'Expected CONTENT-SET-STATE-BLOCK warning when state wrapper missing',
    );
  }

  // CONTENT-SET-BELINTASH-STATE satisfied with valid runtime state
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.0.1',
        content_sets: [
          {
            id: 'belintash-crack',
            title: 'Belintash DLC',
            scenario_index: 'SCENARIOS/DLC/01-belintash-crack/index.md',
            capabilities_file: 'CONFIG/belintash-crack.capabilities.json',
          },
        ],
      },
      'scenario/index.md': '# Intro\nLong enough text for validator baseline.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        content_sets: {
          'belintash-crack': {
            enabled: true,
            state: {
              collapse_stage: 1,
              rescued_archivists: 2,
              hazard_timer: 'stable',
              support_nodes: ['steam:north'],
              notes: 'Stabilized northern vents.',
            },
          },
        },
      },
      'player-data/runtime/completed-quests.json': [],
    });
    assert(
      !issues.some((i) => i.code === 'CONTENT-SET-BELINTASH-STATE'),
      'Valid belintash state should not trigger CONTENT-SET-BELINTASH-STATE',
    );
    assert(!issues.some((i) => i.code === 'CONTENT-SET-STATE-BLOCK'), 'Proper wrapper should not warn');
  }

  // EXPLORATION quest guardrails (missing quest_id and unknown quest)
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nThis intro is long enough to pass the validator threshold for scenario context.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { exploration_enabled: true },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'mystery-hook',
          title: 'Mystery Hook',
          type: 'quest',
          description:
            'A clandestine contact hints at a hidden vault beneath the old library, but refuses to share specifics until proof of loyalty appears.',
          tags: ['hook']
        },
        {
          id: 'unknown-quest',
          title: 'Unknown Quest',
          type: 'quest',
          quest_id: 'quest-missing',
          description:
            'The militia suspects saboteurs near the upper ridge and wants advance scouts to confirm before committing troops.',
          tags: ['hook']
        }
      ],
      'player-data/runtime/completed-quests.json': []
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-QUEST-ID'), 'Expected EXPLORATION-QUEST-ID');
    assert(issues.some((i) => i.code === 'EXPLORATION-QUEST-UNKNOWN'), 'Expected EXPLORATION-QUEST-UNKNOWN');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAG-QUEST'), 'Expected EXPLORATION-TAG-QUEST when quest tag missing');
  }

  // EXPLORATION area cross references and preview list
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nSatisfies validator narrative length expectations.',
      'scenario/areas/landing.md': '# Landing\nArea description long enough to pass guardrails. [[quest-main]] referenced.',
      'scenario/quests/available.json': [{ quest_id: 'quest-main', title: 'Main Quest' }],
      'scenario/quests/quest-main.md': SAMPLE_QUEST_MARKDOWN.replace('[[default-area]]', '[[landing]]'),
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {
        exploration_enabled: true,
        exploration_log_preview: ['landing-scout', 'missing-entry']
      },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'landing-scout',
          title: 'Landing Scout',
          type: 'area',
          area_id: 'landing',
          added_at: '2025-12-28T10:00:00.000Z',
          origin: 'gm-suggested',
          description:
            'Recon teams survey the landing zone, interview refugees, and mark suspicious supply drops that do not match manifests.',
          tags: ['hook']
        },
        {
          id: 'landing-quest',
          title: 'Landing Quest Lead',
          type: 'quest',
          quest_id: 'quest-main',
          added_at: '2025-12-28T11:00:00.000Z',
          origin: 'gm-suggested',
          description:
            'After the scouting report, operatives identify a hidden glyph chamber tied to quest-main but cannot mark it on the dossier yet.',
          tags: ['hook']
        }
      ],
      'player-data/runtime/completed-quests.json': []
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-TAG-AREA'), 'Expected EXPLORATION-TAG-AREA when area tag missing');
    assert(issues.some((i) => i.code === 'EXPLORATION-TAG-QUEST'), 'Expected EXPLORATION-TAG-QUEST when quest tag missing');
    assert(issues.some((i) => i.code === 'EXPLORATION-PREVIEW-MISMATCH'), 'Expected EXPLORATION-PREVIEW-MISMATCH for missing entry');
  }

  // EXPLORATION log missing while enabled
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nContext text for validator guardrails.',
      'scenario/areas/forest.md': '# Forest\nArea content over minimum length.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { exploration_enabled: true },
      'player-data/runtime/completed-quests.json': []
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-LOG-MISSING'), 'Expected EXPLORATION-LOG-MISSING when exploration enabled without log');
  }

  // QUEST area linkage missing exploration tag
  {
    const issues = await runCheck(checkQuests, {
      'scenario/areas/harbor.md': '# Harbor\nArea text mentioning [[quest-main]].',
      'scenario/quests/available.json': [{ quest_id: 'quest-main', title: 'Main Quest' }],
      'scenario/quests/quest-main.md': SAMPLE_QUEST_MARKDOWN.replace('[[default-area]]', '[[harbor]]'),
      'scenario/quests/unlock-triggers.json': { 'quest-main': 'always' },
      'player-data/runtime/exploration-log.json': [
        {
          id: 'harbor-patrol',
          title: 'Harbor Patrol',
          type: 'area',
          area_id: 'harbor',
          description:
            'Patrols sweep the harbor boardwalk searching for contraband shipments and ambushed supply vessels rumored by refugees.',
          added_at: '2025-12-28T10:00:00.000Z',
          origin: 'player-request',
          tags: ['watch']
        }
      ]
    });
    assert(issues.some((i) => i.code === 'EXPLORATION-QUEST-MISMATCH'), 'Expected EXPLORATION-QUEST-MISMATCH when quest tag missing');
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

  // CAP-RUNTIME-BOUNDS
  {
    const issues = await runCheck(checkCapabilities, {
      'config/capabilities.json': {
        armor: { enabled: true, desc: 'Physical protection' }
      },
      'player-data/runtime/state.json': { stats: { armor: 5 } },
    });
    assert(issues.some((i) => i.code === 'CAP-RUNTIME-BOUNDS'), 'Expected CAP-RUNTIME-BOUNDS');
  }

  // CAP-SCHEMA guardrail (negative min)
  {
    const base = setupGame({
      'config/capabilities.json': { health: { enabled: true, min: -5, max: 100 } },
      'player-data/runtime/state.json': { stats: {} },
    });
    const issues: Issues = [];
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
    const issues: Issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'STATE-SCHEMA'), 'Expected STATE-SCHEMA for health 150');
  }

  // STATE-SCHEMA guardrail (nested negative stat)
  {
    const base = setupGame({
      'config/capabilities.json': { armor: { enabled: true, min: 0, max: 50 } },
      'player-data/runtime/state.json': { stats: { armor: { bonus: -1 } } },
    });
    const issues: Issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'STATE-SCHEMA'), 'Expected STATE-SCHEMA for nested negative stat');
  }

  // STATE-SCHEMA valid runtime state with inventories/flags
  {
    const base = setupGame({
      'player-data/runtime/state.json': {
        current_area_id: 'default-area',
        current_day: 2,
        current_hour: 14,
        active_quests: [
          {
            quest_id: 'quest-1',
            status: 'active',
            progress: 0.5,
            current_step_id: 'step-1',
            flags: { rescued: true }
          }
        ],
        stats: {
          health: 50,
          energy: 30,
          mana: 10,
          stamina: 40,
          hunger: 15,
          thirst: 5,
          morale: 70,
          reputation: { guild: 10, mages: -5 },
          currency: { gold: 200, gems: { type: 'shard', value: 2 } },
          status_effects: { burning: { stack: 0 } },
          armor: 5
        },
        flags: {
          tutorial_complete: true,
          favor_tokens: 2
        },
        inventories: [
          {
            id: 'backpack',
            name: 'Backpack',
            slots: { used: 1, max: 10 },
            items: [
              { item_id: 'potion', title: 'Health Potion', qty: 2, meta: { rarity: 'common' } },
              { item_id: 'bandage', title: 'Bandage', qty: 3 }
            ]
          }
        ],
        exploration_enabled: true,
        exploration_log_preview: ['village-square']
      }
    });
    const issues: Issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(!issues.some((i) => i.code === 'STATE-SCHEMA'), 'Valid runtime state should not trigger STATE-SCHEMA');
  }

  // STATE-SCHEMA invalid runtime state (negative values, bad inventory)
  {
    const base = setupGame({
      'player-data/runtime/state.json': {
        current_day: -1,
        current_hour: 30,
        stats: {
          health: -10,
          status_effects: { poison: { stack: -1 } }
        },
        inventories: [
          {
            id: 'bag',
            items: [{ item_id: 'corrupted', qty: -3 }]
          }
        ],
        exploration_log_preview: ['village-square']
      }
    });
    const issues: Issues = [];
    const ctx = { base, loadJson, issues };
    await checkSchemas(ctx);
    assert(issues.some((i) => i.code === 'STATE-SCHEMA'), 'Invalid runtime state should trigger STATE-SCHEMA');
  }

  // EXPLORATION-SCHEMA guardrail
  {
    const base = setupGame({
      'player-data/runtime/exploration-log.json': [
        { id: 'bad entry', title: 'City', type: 'unknown', origin: 'gm' }
      ],
    });
    const issues: Issues = [];
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

  // INDEX-QUEST-MISSING and INDEX-QUEST-UNKNOWN
  {
    const issues = await runCheck(checkQuests, {
      'scenario/index.md': `# Index
## Quest Overview
| Quest | Unlock | Summary |
| --- | --- | --- |
| [Quest Alpha](scenario/quests/quest-alpha.md) | always | Alpha summary |
| [Ghost Quest](scenario/quests/ghost.md) | always | Ghost summary |
`,
      'scenario/quests/available.json': [
        { quest_id: 'quest-alpha', title: 'Quest Alpha' },
        { quest_id: 'quest-beta', title: 'Quest Beta' }
      ],
      'scenario/quests/quest-alpha.md':
        '# Quest Alpha\n## Summary\nThis is a long enough summary for the alpha quest to satisfy guardrails.\n## Steps\n- step one\n- step two\n## Rewards\n- XP: 100 XP\n- Gold: 50 gold',
      'scenario/quests/quest-beta.md':
        '# Quest Beta\n## Summary\nThis is a long enough summary for the beta quest to satisfy guardrails.\n## Steps\n- step one\n- step two\n## Rewards\n- XP: 120 XP\n- Gold: 60 gold',
      'scenario/quests/unlock-triggers.json': { 'quest-alpha': 'always', 'quest-beta': 'always' },
    });
    assert(issues.some((i) => i.code === 'INDEX-QUEST-MISSING'), 'Expected INDEX-QUEST-MISSING for quest-beta absent in index');
    assert(issues.some((i) => i.code === 'INDEX-QUEST-UNKNOWN'), 'Expected INDEX-QUEST-UNKNOWN for ghost quest in index');
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

  // UNLOCK-DEPENDENCY-UNKNOWN
  {
    const questContent = `# Quest Main
## Summary
This summary has sufficient descriptive text to pass guardrails for narratives.
## Story
Explain the factions rallying around the quest target and how success changes the balance of power.
## Hooks
- Hook from [[default-area]] urging action.
## Encounters
- Ambush near the river.
## Steps
- Scout the area.
- Resolve the threat.
## Rewards
- XP: 120 XP for restoring order.
- Gold: 60 gold coins for expenses.
- Loot: Relic recovered from the shrine.
- Social: Reputation boost with the town council.
## Notes
- NPCs: Council envoy offers support.
## Outcome
- The town regains stability.
## Aftermath
- Follow-up quest unlocks to secure the outskirts.
## Outcome Hooks
- Hook: Merchant requests an escort mission.
## Conditions
- Reputation at least Neutral with the council.
## Fail State
- Smugglers overrun the trade routes.`;
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [{ quest_id: 'quest-main', title: 'Quest Main' }],
      'scenario/quests/quest-main.md': questContent,
      'scenario/quests/unlock-triggers.json': { 'quest-main': ['missing-side-quest'] },
    });
    assert(issues.some((i) => i.code === 'UNLOCK-DEPENDENCY-UNKNOWN'), 'Expected UNLOCK-DEPENDENCY-UNKNOWN');
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

  // COMPLETED-QUEST validation matrix: schema, missing fields, unknown quest
  {
    const issues = await runCheck(checkQuests, {
      'scenario/quests/available.json': [{ quest_id: 'quest-known', title: 'Quest Known' }],
      'scenario/quests/quest-known.md': SAMPLE_QUEST_MARKDOWN,
      'scenario/quests/unlock-triggers.json': { 'quest-known': 'always' },
      'player-data/runtime/completed-quests.json': [
        { quest_id: 'quest-missing', title: 'Unknown Quest', completed_at: '2025-01-01T00:00:00Z' },
        { quest_id: 'quest-known', title: '', completed_at: 'invalid' },
        {},
      ],
    });
    assert(issues.some((i) => i.code === 'COMPLETED-QUEST-UNKNOWN'), 'Expected COMPLETED-QUEST-UNKNOWN');
    assert(issues.some((i) => i.code === 'COMPLETED-TITLE'), 'Expected COMPLETED-TITLE when title empty');
    assert(issues.some((i) => i.code === 'COMPLETED-TIMESTAMP'), 'Expected COMPLETED-TIMESTAMP for invalid ISO');
    assert(issues.some((i) => i.code === 'COMPLETED-ENTRY'), 'Expected COMPLETED-ENTRY when quest_id missing');
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
  const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
  // First run produces CAP-RUNTIME (warn) and writes snapshot
  const first = spawnSync('node', [cliPath, '--path', base1, '--run-id', 'snap-1', '--json', snapFile], { encoding: 'utf8' });
  assert.strictEqual(first.status, 0, `First run should exit 0, got ${first.status}\n${first.stdout}\n${first.stderr}`);
  // Second run with stats fixed, snapshot should report resolved CAP-RUNTIME
  fs.writeFileSync(path.join(base1, 'player-data/runtime/state.json'), JSON.stringify({ stats: { mana: 5 } }, null, 2));
  const second = spawnSync('node', [cliPath, '--path', base1, '--run-id', 'snap-2', '--json', snapFile, '--append', '--snapshot', snapFile], { encoding: 'utf8' });
  assert.strictEqual(second.status, 0, `Second run should exit 0, got ${second.status}\n${second.stdout}\n${second.stderr}`);
  assert(second.stdout.includes('Resolved: CAP-RUNTIME'), 'Snapshot should report resolved CAP-RUNTIME');
  // Strict mode should fail when warning exists
  fs.writeFileSync(path.join(base1, 'player-data/runtime/state.json'), JSON.stringify({ stats: {} }, null, 2));
  const strictRun = spawnSync('node', [cliPath, '--path', base1, '--run-id', 'snap-3', '--strict'], { encoding: 'utf8' });
  assert.strictEqual(strictRun.status, 1, 'Strict should exit with error when WARN present');
}

// YAML fallback (expects WARN if yaml module missing)
{
  const base = setupGame({
    'config/capabilities.yml': 'mana:\n  enabled: true\n',
  });
  const issues: Issues = [];
  const ctx = { base, loadJson, issues };
  await checkCapabilities(ctx);
  const hasYamlWarn = issues.some((i) => i.code === 'YAML-NOT-AVAILABLE' || i.code === 'YAML-PARSE');
  const yamlInstalled = (() => {
    try {
      require.resolve('yaml');
      return true;
    } catch {
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
}

// Summary-only and ignore codes
{
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1', engine_compat: '1.0.0' },
      'scenario/index.md': '# Intro\nThis index is long enough to pass the minimum length.',
      'scenario/quests/available.json': [{ quest_id: 'q1', title: 'Quest One' }],
      'scenario/quests/q1.md': '# Quest One\n## Summary\nThis summary contains enough descriptive text to pass validation.\n## Story\nA short story explaining how the elder needs help securing both the square and the training grounds.\n## Hooks\n- Speak with locals in the [[default-area]] to discover the militia shortage.\n- Follow rumors at the [[training-grounds]] that hint at sabotage.\n## Encounters\n- A staged duel that turns deadly when saboteurs interfere.\n- Wilderness ambush near the training trail.\n## Steps\n- Visit the [[default-area]] to meet the elder\n- Investigate the [[training-grounds]] beyond the hill\n## Rewards\n- XP: 200 XP from the guard captain\n- Gold: 80 gold coins for equipment repairs\n- Loot: Enchanted wolf fang amulet recovered near the [[training-grounds]].\n- Social: Reputation boost with the militia council.\n## Notes\n- NPCs: Elder, militia sergeant Isla.\n- Hooks: Unlocks access to advanced drills upon success.\n## Outcome\n- The militia regains control of the outskirts.\n- New training options open for vetted squads.\n## Aftermath\n- Merchants unlock rare gear.\n- Follow-up quest: Patrol the watchtower ruins.\n## Outcome Hooks\n- [[default-area]] NPC response: Elder offers a diplomacy mission.\n- [[training-grounds]] escalation hook: Saboteur cells regroup for revenge.\n## Conditions\n- Reputation at least Friendly with the guard.\n- Finish within two in-game days.\n## Fail State\n- Merchants increase prices by 20%.\n- Rival squad claims the reward and blocks future access.\n',
      'scenario/areas/default-area.md':
        '# Default Area\n## Description\nThis description is comfortably over sixty characters to satisfy validator requirements for areas.\n## Points of interest\n- Market square\n## Connections\n- [[training-grounds]]\n[[q1]] quest hook for newcomers\n## Notes\n- NPCs: Elder quest giver.\n- Hooks: Newcomer jobs and market rumors.\n## Conditions\n- Reputation Neutral or higher with the militia.\n- No hostile encounters allowed inside the square.\n## Threats\n- Wolves breaching the square cause merchants to double prices.\n- Rival adventurers may poach quests if ignored for sessions.\n',
      'scenario/areas/training-grounds.md':
        '# Training Grounds\n## Description\nA dusty field dedicated to drills and sparring matches for adventurers.\n## Points of interest\n- Weapon racks\n## Connections\n- [[default-area]]\n[[q1]] training session notice\n## Notes\n- NPCs: Sergeant Isla overseeing drills.\n- Hooks: Rival squad challenges and gear requests.\n## Conditions\n- Access allowed only to recruits approved by the elder.\n- Drills must be supervised during daytime hours.\n## Threats\n- Saboteurs may rig training dummies to explode.\n- Skipping nightly patrols triggers wolf ambushes near the village.\n',
      'scenario/quests/unlock-triggers.json': { q1: 'always' },
      'player-data/runtime/state.json': { stats: {} }, // missing mana -> CAP-RUNTIME
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': { mana: { enabled: true, min: 0, max: 10 } },
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const out = spawnSync('node', [cliPath, '--path', base, '--run-id', 'summary-1', '--summary'], { encoding: 'utf8' });
    const outCombined = `${out.stdout || ''}${out.stderr || ''}`;
    assert(outCombined.includes('Summary:'), `Summary mode should print summary line\n${outCombined}`);
    const outIgnore = spawnSync(
      'node',
      [cliPath, '--path', base, '--run-id', 'summary-2', '--summary', '--ignore', 'CAP-RUNTIME,CAP-SCHEMA'],
      { encoding: 'utf8' },
    );
    const outIgnoreCombined = `${outIgnore.stdout || ''}${outIgnore.stderr || ''}`;
    const m = outIgnoreCombined.match(/Summary:\s*(\d+) error\(s\),\s*(\d+) warning\(s\)/);
    assert(m, `Expected Summary line in output\n${outIgnoreCombined}`);
    assert.strictEqual(Number(m[1]), 0, `Ignore run should have 0 errors\n${outIgnoreCombined}`);
    assert.strictEqual(Number(m[2]), 0, `Ignore should remove CAP-RUNTIME warning\n${outIgnoreCombined}`);
  }

  // Unknown flag rejection
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nSome text here that is long enough.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const result = spawnSync('node', [cliPath, '--path', base, '--run-id', 'unknown-flag', '--fake-flag'], { encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    assert.strictEqual(result.status, 1, `CLI should exit 1 on unknown flag\n${output}`);
    assert(output.includes('Unknown flag'), `Unknown flag error should be reported\n${output}`);
  }

  // Snapshot guardrail failure should exit 1
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nSome text here that is long enough.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { stats: {} },
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const missingSnapshot = path.join(base, 'missing-snapshot.json');
    const result = spawnSync('node', [cliPath, '--path', base, '--run-id', 'snapshot-missing', '--snapshot', missingSnapshot], { encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    assert.strictEqual(result.status, 1, `CLI should exit 1 when snapshot read fails\n${output}`);
    assert(output.includes('[ERROR][SNAPSHOT]'), `Snapshot guardrail error should be reported\n${output}`);
  }

  // Log guardrail failure should exit 1
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Intro\nThis scenario overview contains enough descriptive content to pass guardrails easily.',
      'scenario/quests/available.json': [{ quest_id: 'q1', title: 'Quest One' }],
      'scenario/quests/q1.md': '# Quest One\n## Summary\nThis summary contains enough descriptive detail to satisfy the validator requirements for minimum length.\n## Steps\n- Visit the [[default-area]]\n## Rewards\n- XP: 50 experience for helping the militia.\n- Gold: 10 coins for supplies.\n- Loot: Wolf-fang charm token.\n- Social: Praise from the village council.\n',
      'scenario/quests/unlock-triggers.json': {},
      'scenario/areas/default-area.md': '# Default Area\n## Description\nThis is a sufficiently long description explaining the default area details and its bustling market square.\n## Points of interest\n- Market stall\n## Connections\n- [[training-grounds]]\n',
      'scenario/areas/training-grounds.md': '# Training Grounds\n## Description\nTraining grounds description that exceeds the minimum description guardrail length for validation.\n## Points of interest\n- Weapon racks\n## Connections\n- [[default-area]]\n',
      'player-data/runtime/state.json': { stats: {} },
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {}
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const result = spawnSync('node', [cliPath, '--path', base, '--run-id', 'test-run', '--log', base], { encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    assert.strictEqual(result.status, 1, `CLI should exit 1 when telemetry log write fails\n${output}`);
    assert(output.includes('[ERROR][LOG]'), `Log guardrail error should be reported\n${output}`);
  }

  // CLI auto-generates --run-id when missing
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Index\nThis is a sufficiently long description to pass guardrails.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { stats: {} },
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const result = spawnSync('node', [cliPath, '--path', base], { encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    assert.strictEqual(result.status, 0, `CLI should succeed by auto-generating run-id\n${output}`);
    assert(output.includes('[INFO][RUN-ID] Generated run-id'), `Auto-generated run-id info should be printed\n${output}`);
  }

  // CLI logs telemetry with runId
  {
    const base = setupGame({
      'manifest/entry.json': { id: 'game-1', title: 'Game 1', version: '0.0.1' },
      'scenario/index.md': '# Index\nThis is a sufficiently long description to pass guardrails.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': { stats: {} },
      'player-data/runtime/completed-quests.json': [],
      'config/capabilities.json': {},
    });
    const cliPath = path.resolve(__dirname, '..', '..', '..', 'dist', 'cli', 'validate.js');
    const logFile = path.join(base, 'telemetry.json');
    const result = spawnSync('node', [cliPath, '--path', base, '--run-id', 'test-run', '--log', logFile], { encoding: 'utf8' });
    const output = `${result.stdout || ''}${result.stderr || ''}`;
    assert.strictEqual(result.status, 0, `CLI should succeed when run-id provided\n${output}`);
    const loggedRaw = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    const entries = Array.isArray(loggedRaw) ? loggedRaw : [loggedRaw];
    const latest = entries[entries.length - 1];
    assert(latest && typeof latest === 'object', 'Telemetry log should contain at least one entry object');
    assert.strictEqual(latest.runId, 'test-run', 'Telemetry log should include runId field');
  }

  // Manifest schema validation
  {
    const issues = await runCheck(checkSchemas, {
      'manifest/entry.json': {
        id: 'test-game',
        title: 'Test Game',
        version: '1.0.0',
        engine_compat: '1.0.0',
        saves_index: 42
      }
    });
    assert(issues.some((i) => i.code === 'MANIFEST-SCHEMA'), 'Expected MANIFEST-SCHEMA');
  }

  // Manifest missing required fields
  {
    const issues = await runCheck(checkSchemas, {
      'manifest/entry.json': {
        title: 'Test Game',
        version: '1.0.0',
        engine_compat: '1.0.0'
      }
    });
    assert(issues.some((i) => i.code === 'MANIFEST-SCHEMA'), 'Expected MANIFEST-SCHEMA for missing id');
  }

  // Manifest invalid engine_layers type
  {
    const issues = await runCheck(checkSchemas, {
      'manifest/entry.json': {
        id: 'test-game',
        title: 'Test Game',
        version: '1.0.0',
        engine_compat: '1.0.0',
        engine_layers: 'not-an-array'
      }
    });
    assert(issues.some((i) => i.code === 'MANIFEST-SCHEMA'), 'Expected MANIFEST-SCHEMA for invalid engine_layers');
  }

  // Manifest invalid pointers type
  {
    const issues = await runCheck(checkSchemas, {
      'manifest/entry.json': {
        id: 'test-game',
        title: 'Test Game',
        version: '1.0.0',
        engine_compat: '1.0.0',
        capabilities_file: 123
      }
    });
    assert(issues.some((i) => i.code === 'MANIFEST-SCHEMA'), 'Expected MANIFEST-SCHEMA for invalid capabilities_file type');
  }

  // World frame missing when manifest pointer set
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.1.0',
        engine_compat: '1.0.0',
        world_index: 'scenario/world/custom.md'
      },
      'scenario/index.md': '# Index\nThis overview contains more than forty characters to pass validation.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(issues.some((i) => i.code === 'WORLD-FRAME-MISSING'), 'Expected WORLD-FRAME-MISSING when pointer file absent');
  }

  // World frame formatting warnings
  {
    const issues = await runCheck(checkRequiredFiles, {
      'manifest/entry.json': {
        id: 'game-1',
        title: 'Game 1',
        version: '0.1.0',
        engine_compat: '1.0.0'
      },
      'scenario/index.md': '# Index\nThis overview contains more than forty characters to pass validation.',
      'scenario/quests/available.json': [],
      'scenario/quests/unlock-triggers.json': {},
      'scenario/world/index.md': 'World frame content without heading but still quite short description for testing.',
      'player-data/runtime/state.json': {},
      'player-data/runtime/completed-quests.json': [],
    });
    assert(issues.some((i) => i.code === 'WORLD-FRAME-HEADING'), 'Expected WORLD-FRAME-HEADING warning');
    assert(issues.some((i) => i.code === 'WORLD-FRAME-SHORT'), 'Expected WORLD-FRAME-SHORT warning');
  }
})()
  .then(() => {
    console.log(`${SUCCESS_PREFIX} test:validator завърши успешно${RESET}`);
  })
  .catch((error) => {
    console.error(`${ERROR_PREFIX} test:validator се провали${RESET}`);
    console.error(error);
    process.exit(1);
  });
