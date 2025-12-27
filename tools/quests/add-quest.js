#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REWARD_TIER_MULTIPLIERS = { easy: 0.85, standard: 1, epic: 1.4 };
const DEFAULT_REWARD_TIER = 'standard';

function parseArgs(argv) {
  const args = {
    game: 'demo',
    id: null,
    title: null,
    summary: 'Describe the hook, stakes and starting point in 2-3 sentences.',
    story: 'Expand on the background, factions involved, and the stakes for success or failure.',
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
        if (next) args.game = next;
        break;
      case '--id':
        if (next) args.id = next;
        break;
      case '--title':
      case '-t':
        if (next) args.title = next;
        break;
      case '--summary':
        if (next) args.summary = next;
        break;
      case '--story':
        if (next) args.story = next;
        break;
      case '--hooks':
        if (next) args.hooks = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--encounters':
        if (next) args.encounters = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--steps':
        if (next) args.steps = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--rewards':
        if (next) args.rewards = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--notes':
        if (next) args.notes = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--conditions':
        if (next) args.conditions = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--fail':
        if (next) args.fail = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--outcome-hooks':
        if (next) args.outcomeHooks = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--outcome':
        if (next) args.outcome = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--aftermath':
        if (next) args.aftermath = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--areas':
        if (next) args.areas = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--reward-tier':
        if (next) args.rewardTier = next.toLowerCase();
        break;
      case '--exploration-hook':
        args.explorationHook = true;
        i -= 1;
        break;
      case '--unlock':
        if (next) args.unlockCondition = next;
        break;
      case '--unlock-requires':
        if (next) args.unlockRequires = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--auto-area-notes':
        args.autoAreaNotes = true;
        i -= 1;
        break;
      case '--auto-area-backlinks':
        args.autoAreaBacklinks = true;
        i -= 1;
        break;
      case '--auto-area-hooks':
        args.autoAreaHooks = true;
        i -= 1;
        break;
      case '--auto-encounters':
        args.autoEncounters = true;
        i -= 1;
        break;
      case '--sync-area-notes':
        args.syncAreaNotes = true;
        i -= 1;
        break;
      case '--area-conditions':
        args.areaConditions = true;
        i -= 1;
        break;
      case '--area-threats':
        args.areaThreats = true;
        i -= 1;
        break;
      case '--auto-outcome-hooks':
        args.autoOutcomeHooks = true;
        i -= 1;
        break;
      case '--auto-rewards-breakdown':
        args.autoRewardsBreakdown = true;
        i -= 1;
        break;
      case '--auto-aftermath':
        args.autoAftermath = true;
        i -= 1;
        break;
      default:
        break;
    }
  }
  return args;
}

function slugify(value) {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readJson(fp, fallback) {
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.error(`[ERROR] Cannot parse ${fp}: ${e.message}`);
    process.exit(1);
  }
}

function writeJson(fp, data) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function resolveRewardMultiplier(tier) {
  return REWARD_TIER_MULTIPLIERS[tier] || REWARD_TIER_MULTIPLIERS[DEFAULT_REWARD_TIER];
}

function roundRewardValue(value) {
  if (!Number.isFinite(value)) return 10;
  return Math.max(10, Math.round(value / 10) * 10);
}

function ensureDescriptionLength(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length >= 60) {
    return normalized;
  }
  return `${normalized} Expand on factions involved, local dangers, and tangible rewards to keep this entry above the minimum length.`;
}

function generateUniqueExplorationId(existingIds, seed) {
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

function collectQuestIds(data) {
  if (Array.isArray(data)) {
    return data.map((entry) => entry && entry.quest_id).filter(Boolean);
  }
  if (data && typeof data === 'object') {
    return Object.keys(data);
  }
  return [];
}

function buildUnlockValue(unlockCondition, unlockRequires) {
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

function updateUnlockTriggers(unlockPath, questId, unlockValue) {
  const data = readJson(unlockPath, {});
  if (Array.isArray(data)) {
    console.error('[ERROR] unlock-triggers.json must be an object map (quest_id -> condition)');
    process.exit(1);
  }
  const map = data && typeof data === 'object' ? { ...data } : {};
  if (Object.prototype.hasOwnProperty.call(map, questId)) {
    console.error(`[ERROR] unlock-triggers already defines quest '${questId}'. Remove the old entry first.`);
    process.exit(1);
  }
  map[questId] = unlockValue;
  writeJson(unlockPath, map);
}

function updateAvailable(availablePath, questId, title) {
  const data = readJson(availablePath, []);
  let updated = data;
  if (Array.isArray(data)) {
    if (data.some((entry) => entry.quest_id === questId || entry.title === title)) {
      console.error(`[ERROR] quest_id or title already present in available.json (${questId} / ${title})`);
      process.exit(1);
    }
    updated = [...data, { quest_id: questId, title }];
  } else if (data && typeof data === 'object') {
    if (data[questId]) {
      console.error(`[ERROR] quest_id '${questId}' already present in available.json`);
      process.exit(1);
    }
    if (Object.values(data).includes(title)) {
      console.error(`[ERROR] title '${title}' already used in available.json`);
      process.exit(1);
    }
    updated = { ...data, [questId]: title };
  } else {
    updated = [{ quest_id: questId, title }];
  }
  writeJson(availablePath, updated);
}

function formatList(items, fallbackLines) {
  if (items.length) {
    return items.map((item, idx) => (fallbackLines.enumerated ? `${idx + 1}. ${item}` : `- ${item}`)).join('\n');
  }
  if (Array.isArray(fallbackLines.lines)) {
    return fallbackLines.lines.join('\n');
  }
  return fallbackLines.default || '';
}

function addUniqueLines(targetArray, newLines) {
  const existing = new Set(targetArray);
  newLines.forEach((line) => {
    if (line && !existing.has(line)) {
      targetArray.push(line);
      existing.add(line);
    }
  });
  return existing;
}

function extractSectionLines(content, heading) {
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

function ensureAreaSectionLine(areaDetail, heading, line) {
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

function ensureAreaNote(areaDetail, questId, questTitle) {
  const noteLine = `- Quest hook: [[${questId}]] — ${questTitle}`;
  return ensureAreaSectionLine(areaDetail, 'Notes', noteLine);
}

function ensureAreaBacklink(areaDetail, questId, questTitle) {
  const backlinkLine = `- [[${questId}]] quest tie-in: ${questTitle}`;
  return ensureAreaSectionLine(areaDetail, 'Connections', backlinkLine);
}

function appendQuestNoteIfMissing(questFile, areaId, questId) {
  const noteLine = `- [[${areaId}]]: Add encounter/POI hooks for this area.`;
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

function buildEncounterSuggestion(areaDetail, questTitle) {
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

function buildConditionSuggestions(areaDetail) {
  const lines = extractSectionLines(areaDetail.content, 'Conditions');
  return lines.map((line) => `[[${areaDetail.areaId}]] condition: ${line}`);
}

function buildThreatSuggestions(areaDetail) {
  const lines = extractSectionLines(areaDetail.content, 'Threats');
  return lines.map((line) => `[[${areaDetail.areaId}]] threat: ${line}`);
}

function buildAftermathSuggestions(areaDetail, questTitle) {
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaDetail.areaFile, 'utf8');
    areaDetail.content = content;
  }
  const threats = extractSectionLines(content, 'Threats');
  const conditions = extractSectionLines(content, 'Conditions');
  const aftermath = [];
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

function buildOutcomeHookSuggestions(areaDetail) {
  let content = areaDetail.content;
  if (!content) {
    content = fs.readFileSync(areaDetail.areaFile, 'utf8');
    areaDetail.content = content;
  }
  const notes = extractSectionLines(content, 'Notes');
  const threats = extractSectionLines(content, 'Threats');
  const conditions = extractSectionLines(content, 'Conditions');
  const hooks = [];
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

function syncExplorationHooks(logPath, areaDetails, questId, questTitle) {
  if (!areaDetails.length) {
    return { created: 0, tagged: 0 };
  }
  const logData = readJson(logPath, []);
  if (!Array.isArray(logData)) {
    console.error(`[ERROR] Exploration log at ${logPath} must be an array.`);
    process.exit(1);
  }
  const questTag = `quest:${questId}`;
  const existingIds = new Set(
    logData.map((entry) => (entry && typeof entry.id === 'string' ? entry.id : null)).filter(Boolean)
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
        `${questTitle} unlocks scouting opportunities near ${normalizedArea}. Note the factions involved, risks, and rewards to brief the GM.`
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
      limitedTags.length !== entry.tags.length || limitedTags.some((tag, idx) => entry.tags[idx] !== tag);
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

function ensureRewardLine(rewards, matcher, builder) {
  if (!rewards.some((reward) => matcher.test(reward))) {
    const line = builder();
    if (line) rewards.push(line);
  }
}

function autoPopulateRewards(args, areaDetails) {
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
  ensureRewardLine(args.rewards, /^\s*-\s*Gold:/i, () => `- Gold: ${goldAmount} gold coins released by the militia quartermaster.`);
  ensureRewardLine(args.rewards, /^\s*-\s*Loot:/i, () => `- Loot: ${lootSource}.`);
  ensureRewardLine(args.rewards, /^\s*-\s*Social:/i, () => `- Social: ${socialTarget}.`);
}

function buildMarkdown(
  title,
  summary,
  story,
  hooks,
  encounters,
  steps,
  rewards,
  notes,
  areas,
  conditions,
  fail,
  outcome,
  aftermath,
  outcomeHooks
) {
  const storySection = story && story.trim() ? story.trim() : 'Expand on the narrative beats and key NPC motivations.';
  const hooksSection = formatList(hooks, { lines: ['- Hook 1: Who is asking for help?', '- Hook 2: What rumor or complication arises?'] });
  const encountersSection = formatList(encounters, { lines: ['- Encounter 1: Outline enemies, hazards, or puzzles.', '- Encounter 2: Escalation or boss moment.'] });
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
  const notesSection = formatList(notes, { lines: ['- NPCs: Name and role.', '- Consequences: Reputation shifts, follow-up hooks.'] });
  const outcomeSection = formatList(outcome, {
    lines: ['- Success unlocks new faction favor.', '- Area stabilizes, revealing an alliance opportunity.'],
  });
  const aftermathSection = formatList(aftermath, {
    lines: ['- Follow-up quest: Investigate the next sabotage clue.', '- NPC relationships shift, revealing new hooks.'],
  });
  const outcomeHooksSection = formatList(outcomeHooks, {
    lines: [
      '- Hook: Faction requests follow-up mission related to the success.',
      '- Hook: NPC leverage opens new quest chain.',
    ],
  });
  const conditionsSection = formatList(conditions, {
    lines: ['- Requirement: Reputation, level, or previous quest.', '- Timer: Fail if unresolved after 3 in-game days.'],
  });
  const failSection = formatList(fail, {
    lines: ['- Faction loses trust / price hike.', '- Introduce a rival party that exploits the failure.'],
  });
  const areasSection = areas.length ? areas.map((area) => `- [[${area}]]`).join('\n') : null;
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
## Outcome
${outcomeSection}

## Aftermath
${aftermathSection}

## Outcome Hooks
${outcomeHooksSection}

## Conditions
${conditionsSection}

`;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.title) {
    console.error(
      'Usage: npm run quest:add -- --title "Quest title" [--id quest-slug] [--summary "..."] [--story "..."] [--hooks "Hook A|Hook B"] [--encounters "Fight|Puzzle"] [--steps "Find clue|Defeat boss"] [--rewards "500 XP|Rare item"] [--notes "NPC: ...|Consequence: ..."] [--outcome "Success hook|Faction change"] [--aftermath "Follow-up hook|World change"] [--outcome-hooks "Hook1|Hook2"] [--conditions "Prereq|Timer"] [--fail "Outcome A|Outcome B"] [--areas "..."] [--game demo]'
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
  const areaDetails = args.areas.map((areaId) => {
    const areaFile = path.join(areasDir, `${areaId}.md`);
    if (!fs.existsSync(areaFile)) {
      console.error(`[ERROR] Linked area '${areaId}' not found at ${areaFile}. Create the area file before linking it.`);
      process.exit(1);
    }
    return { areaId, areaFile, content: fs.readFileSync(areaFile, 'utf8') };
  });
  areaDetails.forEach((detail) => {
    if (args.autoAreaNotes && ensureAreaNote(detail, questId, args.title)) {
      console.log(`   · Added quest note to ${path.relative(process.cwd(), detail.areaFile)}`);
    }
    if (args.autoAreaBacklinks && ensureAreaBacklink(detail, questId, args.title)) {
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
    const aftermathSuggestions = areaDetails.flatMap((detail) => buildAftermathSuggestions(detail, args.title));
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
    const areaHookLines = [];
    const areaEncounterLines = [];
    areaDetails.forEach((detail) => {
      const noteLines = extractSectionLines(detail.content, 'Notes');
      noteLines.forEach((note) => {
        areaHookLines.push(`[[${detail.areaId}]]: ${note}`);
        areaEncounterLines.push(`Encounter near [[${detail.areaId}]]: ${note}`);
      });
    });
    addUniqueLines(args.hooks, areaHookLines);
    addUniqueLines(args.encounters, areaEncounterLines);
  }
  if (args.autoEncounters && areaDetails.length) {
    const suggestions = areaDetails
      .map((detail) => buildEncounterSuggestion(detail, args.title))
      .filter(Boolean);
    addUniqueLines(args.encounters, suggestions);
  }
  if (args.explorationHook && areaDetails.length) {
    const { created, tagged } = syncExplorationHooks(explorationLogPath, areaDetails, questId, args.title);
    console.log(
      `   · Synced exploration log (${path.relative(process.cwd(), explorationLogPath)}): created ${created}, updated tags on ${tagged}`
    );
  }

  updateAvailable(availablePath, questId, args.title);
  const unlockValue = buildUnlockValue(args.unlockCondition, args.unlockRequires);
  updateUnlockTriggers(unlockPath, questId, unlockValue);
  fs.mkdirSync(questDir, { recursive: true });
  fs.writeFileSync(
    questFile,
    buildMarkdown(
      args.title,
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
      args.outcomeHooks
    ),
    'utf8'
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

main();
