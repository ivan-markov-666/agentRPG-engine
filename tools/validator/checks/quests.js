/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

const XP_RANGE = { min: 50, max: 1000 };
const GOLD_RANGE = { min: 25, max: 500 };
/**
 * @typedef {import('../../../dist/types').QuestDefinition} QuestDefinition
 * @typedef {import('../../../dist/types').UnlockTrigger} UnlockTrigger
 */

const areaContentCache = new Map();

function clearAreaCache() {
  areaContentCache.clear();
}

function getAreaContent(base, areaId) {
  const cacheKey = `${base}:${areaId}`;
  if (areaContentCache.has(cacheKey)) {
    return areaContentCache.get(cacheKey);
  }
  const filePath = path.join(base, 'scenario/areas', `${areaId}.md`);
  if (!fs.existsSync(filePath)) {
    areaContentCache.set(cacheKey, null);
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    areaContentCache.set(cacheKey, content);
    return content;
  } catch (_err) {
    areaContentCache.set(cacheKey, null);
    return null;
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(content, heading) {
  const pattern = new RegExp(`##\\s*${heading}[\\s\\S]*?(?=\\n##\\s|$)`, 'i');
  const match = content.match(pattern);
  if (!match) return null;
  return match[0].replace(new RegExp(`##\\s*${heading}`, 'i'), '').trim();
}

function hasList(text) {
  if (!text) return false;
  return /^[-*+]\s+/m.test(text) || /^[0-9]+\.\s+/m.test(text);
}

function countListItems(text) {
  if (!text) return 0;
  const pattern = /^(\s*)([-*+]|[0-9]+\.)\s+/gm;
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function isIsoDateString(value) {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

function parseScenarioIndexQuests(base) {
  const indexPath = path.join(base, 'scenario/index.md');
  if (!fs.existsSync(indexPath)) return null;
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const questRegex = /\[[^[\]]+\]\(scenario\/quests\/([a-z0-9-]+)\.md\)/gi;
    const questIds = [];
    let match;
    while ((match = questRegex.exec(content)) !== null) {
      questIds.push(match[1]);
    }
    return questIds;
  } catch (_err) {
    return null;
  }
}

async function checkQuests(ctx) {
  const { base, issues } = ctx;
  clearAreaCache();
  const availablePath = path.join(base, 'scenario/quests/available.json');
  if (!fs.existsSync(availablePath)) return;
  const available = loadData(availablePath, issues);
  if (!available) return;
  const completedPath = path.join(base, 'player-data/runtime/completed-quests.json');
  const completedEntries = [];
  const completedSet = new Set();
  if (fs.existsSync(completedPath)) {
    const completedData = loadData(completedPath, issues);
    if (Array.isArray(completedData)) {
      completedData.forEach((entry, idx) => {
        if (!entry || typeof entry !== 'object') {
          add(
            issues,
            'WARN',
            'COMPLETED-TYPE',
            completedPath,
            `Entry #${idx + 1} must be an object with quest_id/title/completed_at`,
            'Use { "quest_id": "quest-id", "completed_at": "ISO timestamp" }'
          );
          return;
        }
        const questId = typeof entry.quest_id === 'string' ? entry.quest_id.trim() : '';
        if (!questId) {
          add(
            issues,
            'WARN',
            'COMPLETED-ENTRY',
            completedPath,
            `Entry #${idx + 1} is missing quest_id`,
            'Provide quest_id referencing scenario/quests/available.json'
          );
          return;
        }
        if (completedSet.has(questId)) {
          add(
            issues,
            'WARN',
            'COMPLETED-DUPLICATE',
            completedPath,
            `Completed quest '${questId}' appears multiple times`,
            'Keep a single entry per quest_id'
          );
        } else {
          completedSet.add(questId);
        }
        if (entry.completed_at) {
          if (!isIsoDateString(entry.completed_at)) {
            add(
              issues,
              'WARN',
              'COMPLETED-TIMESTAMP',
              completedPath,
              `Completed quest '${questId}' has invalid completed_at (expected ISO8601)`,
              'Use ISO timestamp, e.g. 2025-01-03T18:45:00Z'
            );
          }
        }
        completedEntries.push({ questId });
      });
    }
  }
  const explorationPath = path.join(base, 'player-data/runtime/exploration-log.json');
  const hasExplorationLog = fs.existsSync(explorationPath);
  const explorationByArea = new Map();
  const explorationQuestTags = new Map();
  if (hasExplorationLog) {
    const logData = loadData(explorationPath, issues);
    if (Array.isArray(logData)) {
      logData.forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;
        const areaId = typeof entry.area_id === 'string' ? entry.area_id.trim() : null;
        if (areaId) {
          if (!explorationByArea.has(areaId)) {
            explorationByArea.set(areaId, []);
          }
          explorationByArea.get(areaId).push(entry);
        }
        if (Array.isArray(entry.tags)) {
          entry.tags.forEach((tag) => {
            if (typeof tag === 'string' && tag.startsWith('quest:')) {
              const questTag = tag.slice(6).trim();
              if (questTag) {
                if (!explorationQuestTags.has(questTag)) {
                  explorationQuestTags.set(questTag, []);
                }
                explorationQuestTags.get(questTag).push(entry);
              }
            }
          });
        }
      });
    }
  }
  // assume map quest_id -> title or array of objects
  const titleMap = new Map();
  const availableIds = new Set();
  const entries = Array.isArray(available)
    ? available
    : Object.entries(available).map(([quest_id, title]) => ({ quest_id, title }));
  if (!entries.length) {
    add(issues, 'WARN', 'QUEST-EMPTY-LIST', 'scenario/quests/available.json', 'No quests listed in available.json', 'Add at least one quest entry');
  }
  const indexQuestEntries = parseScenarioIndexQuests(base);
  const indexQuestSet = new Set(indexQuestEntries || []);
  if (indexQuestEntries && indexQuestEntries.length) {
    const seenIndexQuests = new Set();
    indexQuestEntries.forEach((questId) => {
      if (seenIndexQuests.has(questId)) {
        add(issues, 'WARN', 'INDEX-QUEST-DUPLICATE', 'scenario/index.md', `Quest '${questId}' is listed multiple times`, 'Keep single row per quest in quest table');
      } else {
        seenIndexQuests.add(questId);
      }
    });
  }
  const seenQuestIds = new Set();
  entries.forEach(({ quest_id, title }) => {
    if (!quest_id || !title) {
      add(issues, 'ERROR', 'QUEST-ENTRY', 'scenario/quests/available.json', 'Each quest entry needs quest_id and title', 'Fill both quest_id and title');
      return;
    }
    if (seenQuestIds.has(quest_id)) {
      add(issues, 'WARN', 'QUEST-ID-DUPLICATE', 'scenario/quests/available.json', `Duplicate quest_id '${quest_id}' detected`, 'Ensure quest ids are unique');
    } else {
      seenQuestIds.add(quest_id);
    }
    availableIds.add(quest_id);
    if (!/^[a-z0-9-]+$/.test(quest_id)) {
      add(issues, 'WARN', 'QUEST-ID-FORMAT', 'scenario/quests/available.json', `Quest id '${quest_id}' should be slug (a-z0-9-)`, 'Rename to slug-safe id');
    }
    if (typeof title === 'string' && title.trim().length < 5) {
      add(issues, 'WARN', 'QUEST-TITLE-SHORT', 'scenario/quests/available.json', `Quest '${quest_id}' title is very short`, 'Use at least 5 characters for quest titles');
    }
    if (titleMap.has(title)) {
      add(issues, 'ERROR', 'TITLE-MISMATCH', 'scenario/quests/available.json', `Duplicate title '${title}'`, 'Rename to be unique');
    } else {
      titleMap.set(title, quest_id);
    }
    if (indexQuestEntries && indexQuestEntries.length && !indexQuestSet.has(quest_id)) {
      add(
        issues,
        'WARN',
        'INDEX-QUEST-MISSING',
        'scenario/index.md',
        `Quest '${quest_id}' missing from scenario index quest table`,
        'Run scenario:index or add row under "Quest Overview" table'
      );
    }
    const questFile = path.join(base, 'scenario/quests', `${quest_id}.md`);
    if (!fs.existsSync(questFile)) {
      add(issues, 'ERROR', 'QUEST-ORPHAN', `scenario/quests/${quest_id}.md`, 'Quest listed but file missing', 'Create quest file or remove from available');
    } else {
      const stat = fs.statSync(questFile);
      if (stat.size === 0) {
        add(issues, 'WARN', 'QUEST-EMPTY', `scenario/quests/${quest_id}.md`, 'Quest file is empty', 'Add summary and steps');
      } else {
        const content = fs.readFileSync(questFile, 'utf8');
        const hasHeader = content.includes('#');
        const hasSummary = /##\s*Summary/i.test(content);
        const hasSteps = /##\s*Steps/i.test(content);
        const hasRewards = /##\s*Rewards/i.test(content);
        if (!hasHeader || content.trim().length < 40) {
          add(issues, 'WARN', 'QUEST-CONTENT', `scenario/quests/${quest_id}.md`, 'Quest file seems too short or missing header', 'Add summary/steps sections');
        }
        const failStateText = extractSection(content, 'Fail State');
        if (!failStateText) {
          add(issues, 'WARN', 'QUEST-FAILSTATE-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Fail State" section', 'Describe what happens if players fail or abort the quest');
        } else if (!hasList(failStateText)) {
          add(issues, 'WARN', 'QUEST-FAILSTATE-FORMAT', `scenario/quests/${quest_id}.md`, 'Fail State section should contain a list', 'List outcomes, consequences, or fallback hooks as "-" bullets');
        }
        const outcomeText = extractSection(content, 'Outcome');
        if (!outcomeText) {
          add(issues, 'WARN', 'QUEST-OUTCOME-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Outcome" section', 'Summarize what success means for the world/factions');
        } else if (!hasList(outcomeText)) {
          add(issues, 'WARN', 'QUEST-OUTCOME-FORMAT', `scenario/quests/${quest_id}.md`, 'Outcome section should contain a list', 'Use "-" bullets outlining narrative consequences of success');
        }
        const aftermathText = extractSection(content, 'Aftermath');
        if (!aftermathText) {
          add(issues, 'WARN', 'QUEST-AFTERMATH-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Aftermath" section', 'List follow-up hooks unlocked after completion');
        } else if (!hasList(aftermathText)) {
          add(issues, 'WARN', 'QUEST-AFTERMATH-FORMAT', `scenario/quests/${quest_id}.md`, 'Aftermath section should contain a list', 'Use "-" bullets for future quest hooks or world changes');
        }
        const outcomeHooksText = extractSection(content, 'Outcome Hooks');
        if (!outcomeHooksText) {
          add(issues, 'WARN', 'QUEST-OUTCOMEHOOKS-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Outcome Hooks" section', 'Describe quest leads unlocked after resolving the outcome.');
        } else if (!hasList(outcomeHooksText)) {
          add(issues, 'WARN', 'QUEST-OUTCOMEHOOKS-FORMAT', `scenario/quests/${quest_id}.md`, 'Outcome Hooks section should contain a list', 'Use "-" bullets summarizing future quest seeds or NPC reactions.');
        }
        const conditionsText = extractSection(content, 'Conditions');
        if (!conditionsText) {
          add(issues, 'WARN', 'QUEST-CONDITIONS-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Conditions" section', 'List entry requirements, timers, or prerequisites');
        } else if (!hasList(conditionsText)) {
          add(issues, 'WARN', 'QUEST-CONDITIONS-FORMAT', `scenario/quests/${quest_id}.md`, 'Conditions section should contain a list', 'Use "-" bullets for requirements or timers');
        }
        const notesText = extractSection(content, 'Notes');
        if (!notesText) {
          add(issues, 'WARN', 'QUEST-NOTES-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Notes" section', 'Add GM notes, NPC hooks, or special conditions under "## Notes"');
        } else if (!hasList(notesText)) {
          add(issues, 'WARN', 'QUEST-NOTES-FORMAT', `scenario/quests/${quest_id}.md`, 'Notes section should contain a bullet or numbered list', 'List key GM reminders, NPC hooks, or special conditions');
        }
        if (!hasSummary) {
          add(issues, 'WARN', 'QUEST-CONTENT', `scenario/quests/${quest_id}.md`, 'Missing "Summary" section', 'Add "## Summary" with brief description');
        }
        if (!hasSteps) {
          add(issues, 'WARN', 'QUEST-CONTENT', `scenario/quests/${quest_id}.md`, 'Missing "Steps" section', 'Add "## Steps" with bullet/numbered steps');
        }
        if (!hasRewards) {
          add(issues, 'WARN', 'QUEST-CONTENT', `scenario/quests/${quest_id}.md`, 'Missing "Rewards" section', 'Add "## Rewards" with XP/loot');
        }
        if (hasHeader && title) {
          const headerMatch = content.match(/^#\s*(.+)$/m);
          if (headerMatch) {
            const headerTitle = headerMatch[1].trim();
            if (headerTitle !== title.trim()) {
              add(issues, 'WARN', 'QUEST-TITLE-MISMATCH', `scenario/quests/${quest_id}.md`, `Heading "${headerTitle}" differs from available title "${title}"`, 'Align quest heading with available.json title');
            }
          }
        }
        const summaryText = extractSection(content, 'Summary');
        if (summaryText && summaryText.replace(/\s+/g, ' ').trim().length < 30) {
          add(issues, 'WARN', 'QUEST-SUMMARY-SHORT', `scenario/quests/${quest_id}.md`, 'Summary section is very short', 'Add more context (>=30 chars)');
        }
        const storyText = extractSection(content, 'Story');
        if (!storyText) {
          add(issues, 'WARN', 'QUEST-STORY-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Story" section', 'Describe the narrative beats for the quest');
        }
        const hooksText = extractSection(content, 'Hooks');
        if (!hooksText) {
          add(issues, 'WARN', 'QUEST-HOOKS-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Hooks" section', 'Describe encounter hooks, tables, or narrative prompts under "## Hooks"');
        } else if (!hasList(hooksText)) {
          add(issues, 'WARN', 'QUEST-HOOKS-FORMAT', `scenario/quests/${quest_id}.md`, 'Hooks section should contain a bullet or numbered list', 'List encounter ideas or player prompts as "-" bullets');
        }
        const encountersText = extractSection(content, 'Encounters');
        if (!encountersText) {
          add(issues, 'WARN', 'QUEST-ENCOUNTERS-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Encounters" section', 'Outline enemy groups or challenges in an encounters list');
        } else if (!hasList(encountersText)) {
          add(issues, 'WARN', 'QUEST-ENCOUNTERS-FORMAT', `scenario/quests/${quest_id}.md`, 'Encounters section should contain a bullet or numbered list', 'List foes/obstacles as "-" bullets or numbered entries');
        }
        const stepsText = extractSection(content, 'Steps');
        if (stepsText && !hasList(stepsText)) {
          add(issues, 'WARN', 'QUEST-STEPS-FORMAT', `scenario/quests/${quest_id}.md`, 'Steps section should contain a list', 'Use "-" bullets or numbered list');
        } else if (stepsText) {
          const stepCount = countListItems(stepsText);
          if (stepCount < 2) {
            add(issues, 'WARN', 'QUEST-STEPS-COUNT', `scenario/quests/${quest_id}.md`, 'Steps list has fewer than 2 entries', 'Add more detail to the quest flow');
          }
        }
        const rewardsText = extractSection(content, 'Rewards');
        if (rewardsText) {
          if (!hasList(rewardsText)) {
            add(issues, 'WARN', 'QUEST-REWARDS-FORMAT', `scenario/quests/${quest_id}.md`, 'Rewards section should be a list', 'Use "-" bullets or numbered list');
          }
          if (rewardsText.replace(/\s+/g, ' ').trim().length < 10) {
            add(issues, 'WARN', 'QUEST-REWARDS-SHORT', `scenario/quests/${quest_id}.md`, 'Rewards section seems empty', 'Specify XP/loot/in-game reward');
          }
          if (countListItems(rewardsText) < 1) {
            add(issues, 'WARN', 'QUEST-REWARDS-COUNT', `scenario/quests/${quest_id}.md`, 'Rewards list is empty', 'List at least one tangible reward');
          }
          const rewardLines = rewardsText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.startsWith('-'));
          const rewardPatterns = {
            XP: /^-\s*XP:\s*.+/i,
            GOLD: /^-\s*Gold:\s*.+/i,
            LOOT: /^-\s*Loot:\s*.+/i,
            SOCIAL: /^-\s*Social:\s*.+/i,
          };
          Object.entries(rewardPatterns).forEach(([category, pattern]) => {
            if (!rewardLines.some((line) => pattern.test(line))) {
              add(issues, 'WARN', `QUEST-REWARDS-${category}`, `scenario/quests/${quest_id}.md`, `${category} reward missing or malformed`, `Add "- ${category[0] + category.slice(1).toLowerCase()}: ..." line with details/numbers`);
            }
          });
          const xpLine = rewardLines.find((line) => /^-\s*XP:/i.test(line));
          if (xpLine) {
            const xpMatch = xpLine.match(/(-?\d[\d,]*)/);
            if (!xpMatch) {
              add(
                issues,
                'WARN',
                'QUEST-REWARDS-XP-VALUE',
                `scenario/quests/${quest_id}.md`,
                'XP reward line is missing numeric value',
                'Use "- XP: 150 XP ..." format with digits'
              );
            } else {
              const xpValue = Number(xpMatch[1].replace(/,/g, ''));
              if (!Number.isFinite(xpValue)) {
                add(
                  issues,
                  'WARN',
                  'QUEST-REWARDS-XP-VALUE',
                  `scenario/quests/${quest_id}.md`,
                  'XP reward line does not contain a valid number',
                  'Ensure the XP amount is numeric (e.g. 150)'
                );
              } else if (xpValue < XP_RANGE.min || xpValue > XP_RANGE.max) {
                add(
                  issues,
                  'WARN',
                  'QUEST-REWARDS-XP-RANGE',
                  `scenario/quests/${quest_id}.md`,
                  `XP reward (${xpValue}) is outside recommended ${XP_RANGE.min}-${XP_RANGE.max} range`,
                  'Adjust XP to stay within the standard balance window'
                );
              }
            }
          }
          const goldLine = rewardLines.find((line) => /^-\s*Gold:/i.test(line));
          if (goldLine) {
            const goldMatch = goldLine.match(/(-?\d[\d,]*)/);
            if (!goldMatch) {
              add(
                issues,
                'WARN',
                'QUEST-REWARDS-GOLD-VALUE',
                `scenario/quests/${quest_id}.md`,
                'Gold reward line is missing numeric value',
                'Use "- Gold: 75 gold ..." format with digits'
              );
            } else {
              const goldValue = Number(goldMatch[1].replace(/,/g, ''));
              if (!Number.isFinite(goldValue)) {
                add(
                  issues,
                  'WARN',
                  'QUEST-REWARDS-GOLD-VALUE',
                  `scenario/quests/${quest_id}.md`,
                  'Gold reward line does not contain a valid number',
                  'Ensure the gold amount is numeric (e.g. 75)'
                );
              } else if (goldValue < GOLD_RANGE.min || goldValue > GOLD_RANGE.max) {
                add(
                  issues,
                  'WARN',
                  'QUEST-REWARDS-GOLD-RANGE',
                  `scenario/quests/${quest_id}.md`,
                  `Gold reward (${goldValue}) is outside recommended ${GOLD_RANGE.min}-${GOLD_RANGE.max} range`,
                  'Adjust gold to stay within the standard balance window'
                );
              }
            }
          }
        } else {
          add(issues, 'WARN', 'QUEST-REWARDS-MISSING', `scenario/quests/${quest_id}.md`, 'Missing "## Rewards" section', 'List XP/loot/outcomes for completing the quest');
        }
        const linkMatches = [...content.matchAll(/\[\[([^[\]]+)\]\]/g)].map((m) => m[1]);
        const linkedAreas = new Set();
        linkMatches.forEach((link) => {
          if (link === quest_id) {
            add(issues, 'WARN', 'QUEST-LINK-SELF', `scenario/quests/${quest_id}.md`, 'Quest links to itself', 'Remove or change link target');
            return;
          }
          const questLink = path.join(base, 'scenario/quests', `${link}.md`);
          const areaLink = path.join(base, 'scenario/areas', `${link}.md`);
          if (!fs.existsSync(questLink) && !fs.existsSync(areaLink)) {
            add(issues, 'WARN', 'QUEST-LINK', `scenario/quests/${quest_id}.md`, `Link [[${link}]] not found as quest or area`, 'Create file or adjust link target');
          } else if (fs.existsSync(areaLink)) {
            linkedAreas.add(link);
            const areaContent = getAreaContent(base, link);
            const questPattern = new RegExp(`\\[\\[${escapeRegExp(quest_id)}\\]\\]`);
            if (areaContent && !questPattern.test(areaContent)) {
              add(issues, 'WARN', 'QUEST-AREA-BACKLINK', `scenario/quests/${quest_id}.md`, `Area [[${link}]] does not reference this quest`, 'Add [[quest_id]] inside area file to keep navigation bidirectional');
            }
          }
        });
        if (linkedAreas.size === 0) {
          add(issues, 'WARN', 'QUEST-AREA-LINK', `scenario/quests/${quest_id}.md`, 'Quest does not reference any area via [[area-id]] links', 'Link at least one relevant area to anchor the quest');
        } else if (hasExplorationLog) {
          linkedAreas.forEach((areaId) => {
            const entries = explorationByArea.get(areaId) || [];
            const questTag = `quest:${quest_id}`;
            const hasTaggedEntry = entries.some(
              (entry) =>
                Array.isArray(entry.tags) &&
                entry.tags.some((tag) => typeof tag === 'string' && tag.trim().toLowerCase() === questTag)
            );
            if (!hasTaggedEntry) {
              add(
                issues,
                'WARN',
                'EXPLORATION-QUEST-MISMATCH',
                'player-data/runtime/exploration-log.json',
                `Quest '${quest_id}' links [[${areaId}]] but exploration log lacks entry tagged quest:${quest_id}`,
                'Add quest:<id> tag to the relevant exploration entry or run quest:add with --exploration-hook'
              );
            }
          });
        }
      }
    }
  });

  if (completedEntries.length) {
    completedEntries.forEach(({ questId }) => {
      if (!availableIds.has(questId)) {
        add(
          issues,
          'WARN',
          'COMPLETED-QUEST-UNKNOWN',
          completedPath,
          `Completed quest '${questId}' not found in scenario/quests/available.json`,
          'Remove the entry or add the quest back to available.json'
        );
      }
    });
  }

  if (hasExplorationLog) {
    explorationQuestTags.forEach((entries, questTag) => {
      if (!availableIds.has(questTag)) {
        add(
          issues,
          'WARN',
          'EXPLORATION-QUEST-UNKNOWN',
          'player-data/runtime/exploration-log.json',
          `Exploration log references quest '${questTag}' via quest:${questTag} tag but quest is missing`,
          'Remove the tag or create the quest'
        );
      }
    });
  }

  // unlock triggers must reference existing quests
  const unlockPath = path.join(base, 'scenario/quests/unlock-triggers.json');
  if (fs.existsSync(unlockPath)) {
    const unlocks = loadData(unlockPath, issues);
    if (unlocks && typeof unlocks === 'object') {
      availableIds.forEach((qid) => {
        if (!Object.prototype.hasOwnProperty.call(unlocks, qid)) {
          add(issues, 'WARN', 'UNLOCK-MISSING', 'scenario/quests/unlock-triggers.json', `No unlock policy for quest '${qid}'`, 'Add trigger (e.g. "always") or explicit condition');
        }
      });
      Object.keys(unlocks).forEach((qid) => {
        if (!availableIds.has(qid)) {
          add(issues, 'ERROR', 'UNLOCK-UNKNOWN', 'scenario/quests/unlock-triggers.json', `Unlock references missing quest '${qid}'`, 'Add quest to available.json or remove trigger');
        }
        const val = unlocks[qid];
        if (!(typeof val === 'string' || Array.isArray(val))) {
          add(issues, 'WARN', 'UNLOCK-FORMAT', 'scenario/quests/unlock-triggers.json', `Unlock value for '${qid}' should be string or array`, 'Use string condition or array of conditions');
          return;
        }
        if (typeof val === 'string') {
          if (!val.trim()) {
            add(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition for '${qid}' is empty`, 'Use e.g. "always" or concrete condition');
          }
        } else if (Array.isArray(val)) {
          if (val.length === 0) {
            add(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition array for '${qid}' is empty`, 'Provide at least one condition or "always"');
          }
          const seenConds = new Set();
          val.forEach((cond, idx) => {
            if (typeof cond !== 'string') {
              add(issues, 'WARN', 'UNLOCK-VALUE-TYPE', 'scenario/quests/unlock-triggers.json', `Unlock condition #${idx + 1} for '${qid}' must be string`, 'Use string tokens, e.g. quest ids or tags');
              return;
            }
            const trimmed = cond.trim();
            if (!trimmed) {
              add(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition #${idx + 1} for '${qid}' is empty`, 'Remove empty entries or add condition');
              return;
            }
            if (seenConds.has(trimmed)) {
              add(issues, 'WARN', 'UNLOCK-DUPLICATE', 'scenario/quests/unlock-triggers.json', `Unlock condition '${trimmed}' for '${qid}' is duplicated`, 'Remove duplicate conditions');
            } else {
              seenConds.add(trimmed);
            }
            if (/^[a-z0-9-]+$/.test(trimmed) && !availableIds.has(trimmed)) {
              add(
                issues,
                'WARN',
                'UNLOCK-DEPENDENCY-UNKNOWN',
                'scenario/quests/unlock-triggers.json',
                `Quest '${qid}' unlock references missing quest '${trimmed}'`,
                'Add the dependency quest to available.json or adjust the unlock condition'
              );
            }
          });
        }
      });
    }
  }
  if (indexQuestEntries && indexQuestEntries.length) {
    indexQuestEntries.forEach((questId) => {
      if (!availableIds.has(questId)) {
        add(
          issues,
          'WARN',
          'INDEX-QUEST-UNKNOWN',
          'scenario/index.md',
          `Scenario index references quest '${questId}' not found in available.json`,
          'Remove obsolete row or add quest to available.json'
        );
      }
    });
  }
}

module.exports = { checkQuests };
