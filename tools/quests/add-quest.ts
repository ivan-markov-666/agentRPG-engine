#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REWARD_TIER_MULTIPLIERS = { easy: 0.85, standard: 1, epic: 1.4 } as const;
type RewardTier = keyof typeof REWARD_TIER_MULTIPLIERS | (string & {});
const DEFAULT_REWARD_TIER: keyof typeof REWARD_TIER_MULTIPLIERS = 'standard';

interface QuestCliArgs {
  game: string;
  id: string | null;
  title: string | null;
  summary: string;
  story: string;
  hooks: string[];
  encounters: string[];
  steps: string[];
  rewards: string[];
  notes: string[];
  areas: string[];
  autoAreaNotes: boolean;
  autoAreaHooks: boolean;
  autoEncounters: boolean;
  syncAreaNotes: boolean;
  conditions: string[];
  fail: string[];
  areaConditions: boolean;
  areaThreats: boolean;
  outcome: string[];
  aftermath: string[];
  outcomeHooks: string[];
  autoOutcomeHooks: boolean;
  autoRewardsBreakdown: boolean;
  autoAftermath: boolean;
  autoAreaBacklinks: boolean;
  unlockCondition: string | null;
  unlockRequires: string[];
  rewardTier: RewardTier;
  explorationHook: boolean;
}

interface AreaDetail {
  areaId: string;
  areaFile: string;
  content?: string;
}

interface ExplorationEntry {
  id: string;
  title: string;
  type: string;
  area_id: string;
  origin?: string;
  added_at: string;
  description: string;
  tags: string[];
}

type UnlockValue = string | string[];
type UnlockMap = Record<string, UnlockValue>;

type AvailableArrayEntry = { quest_id: string; title: string };
type AvailableData = AvailableArrayEntry[] | Record<string, string>;

interface FormatFallback {
  lines?: string[];
  enumerated?: boolean;
  default?: string;
}

const DEFAULT_SUMMARY = 'Describe the hook, stakes and starting point in 2-3 sentences.';
const DEFAULT_STORY = 'Expand on the background, factions involved, and the stakes for success or failure.';

function listFromArg(value?: string | null): string[] {
  if (!value) return [];
  return value.split('|').map((s) => s.trim()).filter(Boolean);
}

export function parseArgs(argv: string[]): QuestCliArgs {
  const args: QuestCliArgs = {
    game: 'demo',
    id: null,
    title: null,
    summary: DEFAULT_SUMMARY,
    story: DEFAULT_STORY,
    hooks: [],
    encounters: [],
    steps: [],
    rewards: [],
    notes: [],
    areas: [],
    autoAreaNotes: false,
    autoAreaHooks: false,
    autoEncounters: false,
    syncAreaNotes: false,
    conditions: [],
    fail: [],
    areaConditions: false,
    areaThreats: false,
    outcome: [],
    aftermath: [],
    outcomeHooks: [],
    autoOutcomeHooks: false,
    autoRewardsBreakdown: false,
    autoAftermath: false,
    autoAreaBacklinks: false,
    unlockCondition: null,
    unlockRequires: [],
    rewardTier: DEFAULT_REWARD_TIER,
    explorationHook: false,
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
      case '--id':
        if (next) {
          args.id = next;
          i += 1;
        }
        break;
      case '--title':
      case '-t':
        if (next) {
          args.title = next;
          i += 1;
        }
        break;
      case '--summary':
        if (next) {
          args.summary = next;
          i += 1;
        }
        break;
      case '--story':
        if (next) {
          args.story = next;
          i += 1;
        }
        break;
      case '--hooks':
        if (next) {
          args.hooks = listFromArg(next);
          i += 1;
        }
        break;
      case '--encounters':
        if (next) {
          args.encounters = listFromArg(next);
          i += 1;
        }
        break;
      case '--steps':
        if (next) {
          args.steps = listFromArg(next);
          i += 1;
        }
        break;
      case '--rewards':
        if (next) {
          args.rewards = listFromArg(next);
          i += 1;
        }
        break;
      case '--notes':
        if (next) {
          args.notes = listFromArg(next);
          i += 1;
        }
        break;
      case '--conditions':
        if (next) {
          args.conditions = listFromArg(next);
          i += 1;
        }
        break;
      case '--fail':
        if (next) {
          args.fail = listFromArg(next);
          i += 1;
        }
        break;
      case '--outcome-hooks':
        if (next) {
          args.outcomeHooks = listFromArg(next);
          i += 1;
        }
        break;
      case '--outcome':
        if (next) {
          args.outcome = listFromArg(next);
          i += 1;
        }
        break;
      case '--aftermath':
        if (next) {
          args.aftermath = listFromArg(next);
          i += 1;
        }
        break;
      case '--areas':
        if (next) {
          args.areas = listFromArg(next);
          i += 1;
        }
        break;
      case '--reward-tier':
        if (next) {
          args.rewardTier = next.toLowerCase();
          i += 1;
        }
        break;
      case '--exploration-hook':
        args.explorationHook = true;
        break;
      case '--unlock':
        if (next) {
          args.unlockCondition = next;
          i += 1;
        }
        break;
      case '--unlock-requires':
        if (next) {
          args.unlockRequires = listFromArg(next);
          i += 1;
        }
        break;
      case '--auto-area-notes':
        args.autoAreaNotes = true;
        break;
      case '--auto-area-backlinks':
        args.autoAreaBacklinks = true;
        break;
      case '--auto-area-hooks':
        args.autoAreaHooks = true;
        break;
      case '--auto-encounters':
        args.autoEncounters = true;
        break;
      case '--sync-area-notes':
        args.syncAreaNotes = true;
        break;
      case '--area-conditions':
        args.areaConditions = true;
        break;
      case '--area-threats':
        args.areaThreats = true;
        break;
      case '--auto-outcome-hooks':
        args.autoOutcomeHooks = true;
        break;
      case '--auto-rewards-breakdown':
        args.autoRewardsBreakdown = true;
        break;
      case '--auto-aftermath':
        args.autoAftermath = true;
        break;
      default:
        break;
    }
  }
  return args;
}

export function slugify(value: string | null): string | null {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readJson<T>(fp: string, fallback: T): T {
  if (!fs.existsSync(fp)) return fallback;
  try {
    const data = JSON.parse(fs.readFileSync(fp, 'utf8')) as T;
    return data;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[ERROR] Cannot parse ${fp}: ${message}`);
    process.exit(1);
  }
}

function writeJson(fp: string, data: unknown): void {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function resolveRewardMultiplier(tier: RewardTier): number {
  const multipliers: Record<string, number> = { ...REWARD_TIER_MULTIPLIERS };
  return multipliers[tier] ?? REWARD_TIER_MULTIPLIERS[DEFAULT_REWARD_TIER];
}

function roundRewardValue(value: number): number {
  if (!Number.isFinite(value)) return 10;
  return Math.max(10, Math.round(value / 10) * 10);
}

function ensureDescriptionLength(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length >= 60) {
    return normalized;
  }
  return `${normalized} Expand on factions involved, local dangers, and tangible rewards to keep this entry above the minimum length.`;
}

function generateUniqueExplorationId(existingIds: Set<string>, seed?: string | null): string {
  const fallbackSeed = seed || `hook-${Date.now()}`;
  let slugBase = slugify(fallbackSeed) || `hook-${Date.now()}`;
  if (slugBase.length > 55) {
    slugBase = slugBase.slice(0, 55);
  }
  let candidate = slugBase;
  let counter = 2;
  while (existingIds.has(candidate)) {
    candidate = `${slugBase}-${counter}`;
    counter += 1;
  }
  existingIds.add(candidate);
  return candidate;
}

export function collectQuestIds(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data
      .map((entry) => (entry && typeof entry === 'object' && 'quest_id' in entry ? (entry.quest_id as string) : null))
      .filter((value): value is string => Boolean(value));
  }
  if (data && typeof data === 'object') {
    return Object.keys(data as Record<string, unknown>);
  }
  return [];
}

function buildUnlockValue(unlockCondition: string | null, unlockRequires: string[]): string | string[] {
  const requires = Array.from(new Set(unlockRequires));
  const condition = unlockCondition && unlockCondition.trim();
  if (requires.length && condition) {
    return [condition, ...requires];
  }
  if (requires.length) {
    return requires;
  }
  return condition || 'always';
}

function updateUnlockTriggers(unlockPath: string, questId: string, unlockValue: UnlockValue): void {
  const data = readJson<UnlockMap | unknown[]>(unlockPath, {});
  if (Array.isArray(data)) {
    console.error('[ERROR] unlock-triggers.json must be an object map (quest_id -> condition)');
    process.exit(1);
  }
  const map: UnlockMap = data && typeof data === 'object' ? { ...(data as UnlockMap) } : {};
  if (Object.prototype.hasOwnProperty.call(map, questId)) {
    console.error(`[ERROR] unlock-triggers already defines quest '${questId}'. Remove the old entry first.`);
    process.exit(1);
  }
  map[questId] = unlockValue;
  writeJson(unlockPath, map);
}

function updateAvailable(availablePath: string, questId: string, title: string): void {
  const data = readJson<AvailableData | unknown>(availablePath, []);
  let updated: AvailableData;
  if (Array.isArray(data)) {
    if (data.some((entry) => entry.quest_id === questId || entry.title === title)) {
      console.error(`[ERROR] quest_id or title already present in available.json (${questId} / ${title})`);
      process.exit(1);
    }
    updated = [...data, { quest_id: questId, title }];
  } else if (data && typeof data === 'object') {
    const map = data as Record<string, string>;
    if (map[questId]) {
      console.error(`[ERROR] quest_id '${questId}' already present in available.json`);
      process.exit(1);
    }
    if (Object.values(map).includes(title)) {
      console.error(`[ERROR] title '${title}' already used in available.json`);
      process.exit(1);
    }
    updated = { ...map, [questId]: title };
  } else {
    updated = [{ quest_id: questId, title }];
  }
  writeJson(availablePath, updated);
}

function formatList(items: string[], fallbackLines: FormatFallback): string {
  if (items.length) {
    return items.map((item, idx) => (fallbackLines.enumerated ? `${idx + 1}. ${item}` : `- ${item}`)).join('\n');
  }
  if (Array.isArray(fallbackLines.lines)) {
    return fallbackLines.lines.join('\n');
  }
  return fallbackLines.default || '';
}

function addUniqueLines(targetArray: string[], newLines: string[]): Set<string> {
  const existing = new Set(targetArray);
  newLines.forEach((line) => {
    if (line && !existing.has(line)) {
      targetArray.push(line);
      existing.add(line);
    }
  });
  return existing;
}

function extractSectionLines(content: string, heading: string): string[] {
  const sectionRegex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const sectionMatch = content.match(sectionRegex);
  if (!sectionMatch) return [];
  return sectionMatch[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

function ensureAreaSectionLine(areaDetail: AreaDetail, heading: string, line: string): boolean {
  const { areaFile } = areaDetail;
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaFile, 'utf8');
    areaDetail.content = content;
  }
  const sectionRegex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n##\\s|\\n#\\s|$)`, 'i');
  const match = sectionRegex.exec(content);
  let updatedContent;
  if (match) {
    const section = match[0];
    if (section.includes(line)) {
      return false;
    }
    const replacement = section.endsWith('\n') ? `${section}${line}\n` : `${section}\n${line}\n`;
    updatedContent = content.replace(section, replacement);
  } else {
    updatedContent = `${content.trimEnd()}\n\n## ${heading}\n${line}\n`;
  }
  fs.writeFileSync(areaFile, updatedContent, 'utf8');
  areaDetail.content = updatedContent;
  return true;
}

function ensureAreaNote(areaDetail: AreaDetail, questId: string, questTitle: string): boolean {
  const noteLine = `- Quest hook: [[${questId}]] — ${questTitle}`;
  return ensureAreaSectionLine(areaDetail, 'Notes', noteLine);
}

function ensureAreaBacklink(areaDetail: AreaDetail, questId: string, questTitle: string): boolean {
  const backlinkLine = `- [[${questId}]] quest tie-in: ${questTitle}`;
  return ensureAreaSectionLine(areaDetail, 'Connections', backlinkLine);
}

function appendQuestNoteIfMissing(questFile: string, areaId: string, questId: string): boolean {
  const noteLine = `- [[${areaId}]]: Add encounter/POI hooks for quest [[${questId}]].`;
  const content = fs.readFileSync(questFile, 'utf8');
  const notesSectionRegex = /## Notes([\s\S]*?)(?=\n## |\n# |\s*$)/i;
  const match = notesSectionRegex.exec(content);
  let updatedContent;
  if (match) {
    const section = match[0];
    if (section.includes(noteLine)) {
      return false;
    }
    const replacement = section.endsWith('\n') ? `${section}${noteLine}\n` : `${section}\n${noteLine}\n`;
    updatedContent = content.replace(section, replacement);
  } else {
    updatedContent = `${content.trimEnd()}\n\n## Notes\n${noteLine}\n`;
  }
  fs.writeFileSync(questFile, updatedContent, 'utf8');
  return true;
}

function buildEncounterSuggestion(areaDetail: AreaDetail, questTitle: string): string {
  const { areaId } = areaDetail;
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaDetail.areaFile, 'utf8');
    areaDetail.content = content;
  }
  const poiLines = extractSectionLines(content, 'Points of interest');
  const noteLines = extractSectionLines(content, 'Notes');
  const connectionLines = extractSectionLines(content, 'Connections');
  const descriptor = poiLines[0] || noteLines[0] || connectionLines[0];
  if (descriptor) {
    return `Encounter near [[${areaId}]]: ${descriptor}`;
  }
  return `Encounter near [[${areaId}]]: escalate the conflict tied to "${questTitle}".`;
}

function buildConditionSuggestions(areaDetail: AreaDetail): string[] {
  const lines = extractSectionLines(areaDetail.content || '', 'Conditions');
  return lines.map((line) => `[[${areaDetail.areaId}]] condition: ${line}`);
}

function buildThreatSuggestions(areaDetail: AreaDetail): string[] {
  const lines = extractSectionLines(areaDetail.content || '', 'Threats');
  return lines.map((line) => `[[${areaDetail.areaId}]] threat: ${line}`);
}

function buildAftermathSuggestions(areaDetail: AreaDetail, questTitle: string): string[] {
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaDetail.areaFile, 'utf8');
    areaDetail.content = content;
  }
  const threats = extractSectionLines(content, 'Threats');
  const conditions = extractSectionLines(content, 'Conditions');
  const aftermath: string[] = [];
  threats.forEach((threat) => {
    aftermath.push(`[[${areaDetail.areaId}]] fallout: Resolve "${threat}" after "${questTitle}".`);
  });
  conditions.forEach((condition) => {
    aftermath.push(`[[${areaDetail.areaId}]] follow-up requirement: ${condition}`);
  });
  if (!aftermath.length) {
    aftermath.push(`[[${areaDetail.areaId}]] follow-up patrol to solidify the quest outcome.`);
  }
  return aftermath;
}

function buildOutcomeHookSuggestions(areaDetail: AreaDetail): string[] {
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaDetail.areaFile, 'utf8');
    areaDetail.content = content;
  }
  const notes = extractSectionLines(content, 'Notes');
  const threats = extractSectionLines(content, 'Threats');
  const conditions = extractSectionLines(content, 'Conditions');
  const hooks: string[] = [];
  threats.forEach((threat) => {
    hooks.push(`[[${areaDetail.areaId}]] escalation hook: ${threat}`);
  });
  conditions.forEach((condition) => {
    hooks.push(`[[${areaDetail.areaId}]] follow-up requirement: ${condition}`);
  });
  if (notes.length) {
    hooks.push(`[[${areaDetail.areaId}]] NPC response: ${notes[0]}`);
  }
  return hooks;
}

function syncExplorationHooks(logPath: string, areaDetails: AreaDetail[], questId: string, questTitle: string): {
  created: number;
  tagged: number;
} {
  if (!areaDetails.length) {
    return { created: 0, tagged: 0 };
  }
  const logData = readJson<ExplorationEntry[]>(logPath, []);
  if (!Array.isArray(logData)) {
    console.error(`[ERROR] Exploration log at ${logPath} must be an array.`);
    process.exit(1);
  }
  const questTag = `quest:${questId}`;
  const existingIds = new Set(
    logData.map((entry) => (entry && typeof entry.id === 'string' ? entry.id : null)).filter(
      (id): id is string => Boolean(id),
    ),
  );
  let created = 0;
  let tagged = 0;
  let changed = false;
  areaDetails.forEach((detail) => {
    const areaId = detail.areaId;
    if (!areaId) return;
    const normalizedArea = areaId.trim();
    let entry = logData.find((item) => item && item.area_id === normalizedArea);
    if (!entry) {
      const newId = generateUniqueExplorationId(existingIds, `${normalizedArea}-${questId}`);
      const description = ensureDescriptionLength(
        `${questTitle} unlocks scouting opportunities near ${normalizedArea}. Note the factions involved, risks, and rewards to brief the GM.`,
      );
      entry = {
        id: newId,
        title: `${questTitle} hook near ${normalizedArea}`,
        type: 'side-quest-hook',
        area_id: normalizedArea,
        origin: 'gm-suggested',
        added_at: new Date().toISOString(),
        description,
        tags: [],
      };
      logData.push(entry);
      existingIds.add(newId);
      created += 1;
      changed = true;
    }
    if (!Array.isArray(entry.tags)) {
      entry.tags = [];
    }
    const tagsSet = new Set(entry.tags.filter((tag) => typeof tag === 'string' && tag.trim()));
    const beforeHasQuestTag = tagsSet.has(questTag);
    tagsSet.add(questTag);
    tagsSet.add(`area:${normalizedArea}`);
    if (tagsSet.size === 0) {
      tagsSet.add('hook');
    }
    const limitedTags = Array.from(tagsSet).slice(0, 10);
    const tagsChanged =
      limitedTags.length !== entry.tags.length || limitedTags.some((tag, idx) => entry!.tags[idx] !== tag);
    if (tagsChanged) {
      entry.tags = limitedTags;
      changed = true;
      if (!beforeHasQuestTag && entry.tags.includes(questTag)) {
        tagged += 1;
      }
    }
  });
  if (changed) {
    writeJson(logPath, logData);
  }
  return { created, tagged };
}

function ensureRewardLine(rewards: string[], matcher: RegExp, builder: () => string | null): void {
  if (!rewards.some((reward) => matcher.test(reward))) {
    const line = builder();
    if (line) rewards.push(line);
  }
}

function autoPopulateRewards(args: QuestCliArgs, areaDetails: AreaDetail[]): void {
  const stepsCount = Math.max(1, args.steps.length || 1);
  const tierMultiplier = resolveRewardMultiplier(args.rewardTier);
  const areaCount = Math.max(1, areaDetails.length || 1);
  const xpAmount = roundRewardValue(Math.max(100, stepsCount * 50) * tierMultiplier);
  const goldAmount = roundRewardValue(Math.max(40, areaCount * 40) * tierMultiplier);
  const primaryArea = areaDetails[0]?.areaId;
  const lootSource = primaryArea
    ? `Recovered relic tied to [[${primaryArea}]]`
    : 'Signature gear granted by the quest patron';
  const socialTarget = areaDetails.length
    ? `Reputation boost with ${areaDetails.map((detail) => `[[${detail.areaId}]]`).join(', ')}`
    : 'Reputation boost with the quest faction';

  ensureRewardLine(args.rewards, /^\s*-\s*XP:/i, () => `- XP: ${xpAmount} XP for resolving ${args.title}.`);
  ensureRewardLine(
    args.rewards,
    /^\s*-\s*Gold:/i,
    () => `- Gold: ${goldAmount} gold coins released by the militia quartermaster.`,
  );
  ensureRewardLine(args.rewards, /^\s*-\s*Loot:/i, () => `- Loot: ${lootSource}.`);
  ensureRewardLine(args.rewards, /^\s*-\s*Social:/i, () => `- Social: ${socialTarget}.`);
}

function buildMarkdown(
  title: string,
  summary: string,
  story: string,
  hooks: string[],
  encounters: string[],
  steps: string[],
  rewards: string[],
  notes: string[],
  areas: string[],
  conditions: string[],
  fail: string[],
  outcome: string[],
  aftermath: string[],
  outcomeHooks: string[],
): string {
  const storySection = story && story.trim() ? story.trim() : 'Expand on the narrative beats and key NPC motivations.';
  const hooksSection = formatList(hooks, {
    lines: ['- Hook 1: Who is asking for help?', '- Hook 2: What rumor or complication arises?'],
  });
  const encountersSection = formatList(encounters, {
    lines: ['- Encounter 1: Outline enemies, hazards, or puzzles.', '- Encounter 2: Escalation or boss moment.'],
  });
  const stepsSection = steps.length
    ? steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')
    : '1. Outline key beats or challenges.';
  const rewardsSection =
    rewards.length > 0
      ? rewards
          .map((r) => {
            const lower = r.toLowerCase();
            if (lower.includes('xp') || lower.includes('experience')) return `- XP: ${r}`;
            if (lower.includes('gold') || lower.includes('coin') || lower.includes('currency')) return `- Gold: ${r}`;
            if (lower.includes('loot') || lower.includes('item') || lower.includes('gear') || lower.includes('artifact'))
              return `- Loot: ${r}`;
            if (lower.includes('reputation') || lower.includes('renown') || lower.includes('favor') || lower.includes('influence'))
              return `- Social: ${r}`;
            return `- ${r}`;
          })
          .join('\n')
      : '- XP: TBD\n- Gold: TBD\n- Loot: TBD\n- Social: TBD';
  const notesSection = formatList(notes, {
    lines: ['- NPCs: Name and role.', '- Consequences: Reputation shifts, follow-up hooks.'],
  });
  const outcomeSection = formatList(outcome, {
    lines: ['- Success unlocks new faction favor.', '- Area stabilizes, revealing an alliance opportunity.'],
  });
  const aftermathSection = formatList(aftermath, {
    lines: ['- Follow-up quest: Investigate the next sabotage clue.', '- NPC relationships shift, revealing new hooks.'],
  });
  const outcomeHooksSection = formatList(outcomeHooks, {
    lines: ['- Hook: Faction requests follow-up mission related to the success.', '- Hook: NPC leverage opens new quest chain.'],
  });
  const conditionsSection = formatList(conditions, {
    lines: ['- Requirement: Reputation, level, or previous quest.', '- Timer: Fail if unresolved after 3 in-game days.'],
  });
  const failSection = formatList(fail, {
    lines: ['- Faction loses trust / price hike.', '- Introduce a rival party that exploits the failure.'],
  });
  const areasSection = areas.length ? areas.map((area) => `- [[${area}]]`).join('\n') : null;
  const stepsBlock = `## Steps
${stepsSection}`;
  const rewardsBlock = `## Rewards
${rewardsSection}`;
  const failBlock = `## Fail State
${failSection}`;

  return `# ${title}

## Summary
${summary}

## Story
${storySection}

## Hooks
${hooksSection}

## Encounters
${encountersSection}

## Notes
${notesSection}
${areasSection ? `\n## Linked Areas\n${areasSection}\n` : ''}
${stepsBlock}
${rewardsBlock}
${areasSection ? '' : ''}
## Outcome
${outcomeSection}

## Aftermath
${aftermathSection}

## Outcome Hooks
${outcomeHooksSection}

## Conditions
${conditionsSection}

${failBlock}

`;
}

export function main(argv: string[] = process.argv): void {
  const args = parseArgs(argv);
  if (!args.title) {
    console.error(
      'Usage: npm run quest:add -- --title "Quest title" [--id quest-slug] [--summary "..."] [--story "..."] [--hooks "Hook A|Hook B"] [--encounters "Fight|Puzzle"] [--steps "Find clue|Defeat boss"] [--rewards "500 XP|Rare item"] [--notes "NPC: ...|Consequence: ..."] [--outcome "Success hook|Faction change"] [--aftermath "Follow-up hook|World change"] [--outcome-hooks "Hook1|Hook2"] [--conditions "Prereq|Timer"] [--fail "Outcome A|Outcome B"] [--areas "..."] [--game demo]',
    );
    process.exit(1);
  }
  const questId = args.id || slugify(args.title);
  if (!questId) {
    console.error('Unable to derive quest_id from title; provide --id explicitly.');
    process.exit(1);
  }
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const availablePath = path.join(gameBase, 'scenario', 'quests', 'available.json');
  const unlockPath = path.join(gameBase, 'scenario', 'quests', 'unlock-triggers.json');
  const explorationLogPath = path.join(gameBase, 'player-data', 'runtime', 'exploration-log.json');
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const questFile = path.join(questDir, `${questId}.md`);
  if (fs.existsSync(questFile)) {
    console.error(`[ERROR] Quest file already exists: ${questFile}`);
    process.exit(1);
  }
  const areasDir = path.join(gameBase, 'scenario', 'areas');
  const areaDetails: AreaDetail[] = args.areas.map((areaId) => {
    const areaFile = path.join(areasDir, `${areaId}.md`);
    if (!fs.existsSync(areaFile)) {
      console.error(`[ERROR] Linked area '${areaId}' not found at ${areaFile}. Create the area file before linking it.`);
      process.exit(1);
    }
    return { areaId, areaFile, content: fs.readFileSync(areaFile, 'utf8') };
  });
  areaDetails.forEach((detail) => {
    if (args.autoAreaNotes && ensureAreaNote(detail, questId, args.title!)) {
      console.log(`   · Added quest note to ${path.relative(process.cwd(), detail.areaFile)}`);
    }
    if (args.autoAreaBacklinks && ensureAreaBacklink(detail, questId, args.title!)) {
      console.log(`   · Added quest backlink under Connections in ${path.relative(process.cwd(), detail.areaFile)}`);
    }
  });
  if (args.areaConditions && areaDetails.length) {
    const conditionSuggestions = areaDetails.flatMap((detail) => buildConditionSuggestions(detail));
    addUniqueLines(args.conditions, conditionSuggestions);
  }
  if (args.areaThreats && areaDetails.length) {
    const threatSuggestions = areaDetails.flatMap((detail) => buildThreatSuggestions(detail));
    addUniqueLines(args.fail, threatSuggestions);
  }
  if (args.autoAftermath && areaDetails.length) {
    const aftermathSuggestions = areaDetails.flatMap((detail) => buildAftermathSuggestions(detail, args.title!));
    addUniqueLines(args.aftermath, aftermathSuggestions);
  }
  if (args.autoOutcomeHooks && areaDetails.length) {
    const hookSuggestions = areaDetails.flatMap((detail) => buildOutcomeHookSuggestions(detail));
    addUniqueLines(args.outcomeHooks, hookSuggestions);
  }
  if (args.autoRewardsBreakdown) {
    autoPopulateRewards(args, areaDetails);
  }
  if (args.syncAreaNotes && areaDetails.length) {
    const areaHookLines: string[] = [];
    const areaEncounterLines: string[] = [];
    areaDetails.forEach((detail) => {
      const noteLines = extractSectionLines(detail.content || '', 'Notes');
      noteLines.forEach((note) => {
        areaHookLines.push(`[[${detail.areaId}]]: ${note}`);
        areaEncounterLines.push(`Encounter near [[${detail.areaId}]]: ${note}`);
      });
    });
    addUniqueLines(args.hooks, areaHookLines);
    addUniqueLines(args.encounters, areaEncounterLines);
  }
  if (args.autoEncounters && areaDetails.length) {
    const suggestions = areaDetails.map((detail) => buildEncounterSuggestion(detail, args.title!)).filter(Boolean);
    addUniqueLines(args.encounters, suggestions);
  }
  if (args.explorationHook && areaDetails.length) {
    const { created, tagged } = syncExplorationHooks(explorationLogPath, areaDetails, questId, args.title!);
    console.log(
      `   · Synced exploration log (${path.relative(process.cwd(), explorationLogPath)}): created ${created}, updated tags on ${tagged}`,
    );
  }

  updateAvailable(availablePath, questId, args.title!);
  const unlockValue = buildUnlockValue(args.unlockCondition, args.unlockRequires);
  updateUnlockTriggers(unlockPath, questId, unlockValue);
  fs.mkdirSync(questDir, { recursive: true });
  fs.writeFileSync(
    questFile,
    buildMarkdown(
      args.title!,
      args.summary,
      args.story,
      args.hooks,
      args.encounters,
      args.steps,
      args.rewards,
      args.notes,
      args.areas,
      args.conditions,
      args.fail,
      args.outcome,
      args.aftermath,
      args.outcomeHooks,
    ),
    'utf8',
  );
  if (args.autoAreaHooks) {
    args.areas.forEach((areaId) => {
      if (appendQuestNoteIfMissing(questFile, areaId, questId)) {
        console.log(`   · Added quest note referencing [[${areaId}]] in ${path.relative(process.cwd(), questFile)}`);
      }
    });
  }

  console.log(`[OK] Quest '${args.title}' (${questId}) created:`);
  console.log(` - updated ${path.relative(process.cwd(), availablePath)}`);
  console.log(` - created ${path.relative(process.cwd(), questFile)}`);
}

if (require.main === module) {
  main();
}
