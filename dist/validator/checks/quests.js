"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQuests = checkQuests;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const io_1 = require("../utils/io");
const XP_RANGE = { min: 50, max: 1000 };
const GOLD_RANGE = { min: 25, max: 500 };
const areaContentCache = new Map();
function clearAreaCache() {
    areaContentCache.clear();
}
function getAreaContent(base, areaId) {
    const cacheKey = `${base}:${areaId}`;
    if (areaContentCache.has(cacheKey)) {
        return areaContentCache.get(cacheKey) ?? null;
    }
    const filePath = path_1.default.join(base, 'scenario/areas', `${areaId}.md`);
    if (!fs_1.default.existsSync(filePath)) {
        areaContentCache.set(cacheKey, null);
        return null;
    }
    try {
        const content = fs_1.default.readFileSync(filePath, 'utf8');
        areaContentCache.set(cacheKey, content);
        return content;
    }
    catch {
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
    if (!match)
        return null;
    return match[0].replace(new RegExp(`##\\s*${heading}`, 'i'), '').trim();
}
function hasList(text) {
    if (!text)
        return false;
    return /^[-*+]\s+/m.test(text) || /^[0-9]+\.\s+/m.test(text);
}
function countListItems(text) {
    if (!text)
        return 0;
    const pattern = /^(\s*)([-*+]|[0-9]+\.)\s+/gm;
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
}
function isIsoDateString(value) {
    if (typeof value !== 'string')
        return false;
    const parsed = Date.parse(value);
    return Number.isFinite(parsed);
}
function parseScenarioIndexQuests(base) {
    const indexPath = path_1.default.join(base, 'scenario/index.md');
    if (!fs_1.default.existsSync(indexPath))
        return null;
    try {
        const content = fs_1.default.readFileSync(indexPath, 'utf8');
        const questRegex = /\[[^[\]]+\]\(scenario\/quests\/([a-z0-9-]+)\.md\)/gi;
        const questIds = [];
        let match = null;
        while ((match = questRegex.exec(content)) !== null) {
            questIds.push(match[1]);
        }
        return questIds;
    }
    catch {
        return null;
    }
}
async function checkQuests(ctx) {
    const { base, issues } = ctx;
    clearAreaCache();
    const availablePath = path_1.default.join(base, 'scenario/quests/available.json');
    if (!fs_1.default.existsSync(availablePath))
        return;
    const availableRaw = (0, io_1.loadData)(availablePath, issues);
    if (!availableRaw)
        return;
    const entries = Array.isArray(availableRaw)
        ? availableRaw
        : Object.entries(availableRaw).map(([quest_id, title]) => ({
            quest_id,
            title: typeof title === 'string' ? title : '',
        }));
    if (!entries.length) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-EMPTY-LIST', 'scenario/quests/available.json', 'No quests listed in available.json', 'Add at least one quest entry');
    }
    const completedPath = path_1.default.join(base, 'player-data/runtime/completed-quests.json');
    const completedEntries = [];
    const completedSet = new Set();
    if (fs_1.default.existsSync(completedPath)) {
        const completedData = (0, io_1.loadData)(completedPath, issues);
        if (Array.isArray(completedData)) {
            completedData.forEach((entry, idx) => {
                if (!entry || typeof entry !== 'object') {
                    (0, io_1.add)(issues, 'WARN', 'COMPLETED-TYPE', completedPath, `Entry #${idx + 1} must be an object with quest_id/title/completed_at`, 'Use { "quest_id": "quest-id", "completed_at": "ISO timestamp" }');
                    return;
                }
                const questId = typeof entry.quest_id === 'string' ? entry.quest_id.trim() : '';
                if (!questId) {
                    (0, io_1.add)(issues, 'WARN', 'COMPLETED-ENTRY', completedPath, `Entry #${idx + 1} is missing quest_id`, 'Provide quest_id referencing scenario/quests/available.json');
                    return;
                }
                if (completedSet.has(questId)) {
                    (0, io_1.add)(issues, 'WARN', 'COMPLETED-DUPLICATE', completedPath, `Completed quest '${questId}' appears multiple times`, 'Keep a single entry per quest_id');
                }
                else {
                    completedSet.add(questId);
                }
                if (entry.completed_at && !isIsoDateString(entry.completed_at)) {
                    (0, io_1.add)(issues, 'WARN', 'COMPLETED-TIMESTAMP', completedPath, `Completed quest '${questId}' has invalid completed_at (expected ISO8601)`, 'Use ISO timestamp, e.g. 2025-01-03T18:45:00Z');
                }
                completedEntries.push({ questId });
            });
        }
    }
    const explorationPath = path_1.default.join(base, 'player-data/runtime/exploration-log.json');
    const hasExplorationLog = fs_1.default.existsSync(explorationPath);
    const explorationByArea = new Map();
    const explorationQuestTags = new Map();
    if (hasExplorationLog) {
        const logData = (0, io_1.loadData)(explorationPath, issues);
        if (Array.isArray(logData)) {
            logData.forEach((entry) => {
                if (!entry || typeof entry !== 'object')
                    return;
                const castEntry = entry;
                const areaId = typeof castEntry.area_id === 'string' ? castEntry.area_id.trim() : null;
                if (areaId) {
                    if (!explorationByArea.has(areaId)) {
                        explorationByArea.set(areaId, []);
                    }
                    explorationByArea.get(areaId)?.push(castEntry);
                }
                if (Array.isArray(castEntry.tags)) {
                    castEntry.tags.forEach((tag) => {
                        if (typeof tag === 'string' && tag.startsWith('quest:')) {
                            const questTag = tag.slice(6).trim();
                            if (questTag) {
                                if (!explorationQuestTags.has(questTag)) {
                                    explorationQuestTags.set(questTag, []);
                                }
                                explorationQuestTags.get(questTag)?.push(castEntry);
                            }
                        }
                    });
                }
            });
        }
    }
    const titleMap = new Map();
    const availableIds = new Set();
    const indexQuestEntries = parseScenarioIndexQuests(base);
    const indexQuestSet = new Set(indexQuestEntries || []);
    if (indexQuestEntries && indexQuestEntries.length) {
        const seenIndexQuests = new Set();
        indexQuestEntries.forEach((questId) => {
            if (seenIndexQuests.has(questId)) {
                (0, io_1.add)(issues, 'WARN', 'INDEX-QUEST-DUPLICATE', 'scenario/index.md', `Quest '${questId}' is listed multiple times`, 'Keep single row per quest in quest table');
            }
            else {
                seenIndexQuests.add(questId);
            }
        });
    }
    const seenQuestIds = new Set();
    entries.forEach(({ quest_id, title }) => {
        if (!quest_id || !title) {
            (0, io_1.add)(issues, 'ERROR', 'QUEST-ENTRY', 'scenario/quests/available.json', 'Each quest entry needs quest_id and title', 'Fill both quest_id and title');
            return;
        }
        if (seenQuestIds.has(quest_id)) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-ID-DUPLICATE', 'scenario/quests/available.json', `Duplicate quest_id '${quest_id}' detected`, 'Ensure quest ids are unique');
        }
        else {
            seenQuestIds.add(quest_id);
        }
        availableIds.add(quest_id);
        if (!/^[a-z0-9-]+$/.test(quest_id)) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-ID-FORMAT', 'scenario/quests/available.json', `Quest id '${quest_id}' should be slug (a-z0-9-)`, 'Rename to slug-safe id');
        }
        if (typeof title === 'string' && title.trim().length < 5) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-TITLE-SHORT', 'scenario/quests/available.json', `Quest '${quest_id}' title is very short`, 'Use at least 5 characters for quest titles');
        }
        if (titleMap.has(title)) {
            (0, io_1.add)(issues, 'ERROR', 'TITLE-MISMATCH', 'scenario/quests/available.json', `Duplicate title '${title}'`, 'Rename to be unique');
        }
        else {
            titleMap.set(title, quest_id);
        }
        if (indexQuestEntries && indexQuestEntries.length && !indexQuestSet.has(quest_id)) {
            (0, io_1.add)(issues, 'WARN', 'INDEX-QUEST-MISSING', 'scenario/index.md', `Quest '${quest_id}' missing from scenario index quest table`, 'Run scenario:index or add row under "Quest Overview" table');
        }
        const questFile = path_1.default.join(base, 'scenario/quests', `${quest_id}.md`);
        if (!fs_1.default.existsSync(questFile)) {
            (0, io_1.add)(issues, 'ERROR', 'QUEST-ORPHAN', `scenario/quests/${quest_id}.md`, 'Quest listed but file missing', 'Create quest file or remove from available');
        }
        else {
            validateQuestFile({
                base,
                issues,
                questId: quest_id,
                title,
                questFile,
                hasExplorationLog,
                explorationByArea,
            });
        }
    });
    if (completedEntries.length) {
        completedEntries.forEach(({ questId }) => {
            if (!availableIds.has(questId)) {
                (0, io_1.add)(issues, 'WARN', 'COMPLETED-QUEST-UNKNOWN', completedPath, `Completed quest '${questId}' not found in scenario/quests/available.json`, 'Remove the entry or add the quest back to available.json');
            }
        });
    }
    if (hasExplorationLog) {
        explorationQuestTags.forEach((_entries, questTag) => {
            if (!availableIds.has(questTag)) {
                (0, io_1.add)(issues, 'WARN', 'EXPLORATION-QUEST-UNKNOWN', 'player-data/runtime/exploration-log.json', `Exploration log references quest '${questTag}' via quest:${questTag} tag but quest is missing`, 'Remove the tag or create the quest');
            }
        });
    }
    const unlockPath = path_1.default.join(base, 'scenario/quests/unlock-triggers.json');
    if (fs_1.default.existsSync(unlockPath)) {
        const unlocks = (0, io_1.loadData)(unlockPath, issues);
        if (unlocks && typeof unlocks === 'object') {
            availableIds.forEach((qid) => {
                if (!Object.prototype.hasOwnProperty.call(unlocks, qid)) {
                    (0, io_1.add)(issues, 'WARN', 'UNLOCK-MISSING', 'scenario/quests/unlock-triggers.json', `No unlock policy for quest '${qid}'`, 'Add trigger (e.g. "always") or explicit condition');
                }
            });
            Object.keys(unlocks).forEach((qid) => {
                if (!availableIds.has(qid)) {
                    (0, io_1.add)(issues, 'ERROR', 'UNLOCK-UNKNOWN', 'scenario/quests/unlock-triggers.json', `Unlock references missing quest '${qid}'`, 'Add quest to available.json or remove trigger');
                }
                const value = unlocks[qid];
                if (!(typeof value === 'string' || Array.isArray(value))) {
                    (0, io_1.add)(issues, 'WARN', 'UNLOCK-FORMAT', 'scenario/quests/unlock-triggers.json', `Unlock value for '${qid}' should be string or array`, 'Use string condition or array of conditions');
                    return;
                }
                if (typeof value === 'string') {
                    if (!value.trim()) {
                        (0, io_1.add)(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition for '${qid}' is empty`, 'Use e.g. "always" or concrete condition');
                    }
                }
                else if (Array.isArray(value)) {
                    if (value.length === 0) {
                        (0, io_1.add)(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition array for '${qid}' is empty`, 'Provide at least one condition or "always"');
                    }
                    const seenConds = new Set();
                    value.forEach((cond, idx) => {
                        if (typeof cond !== 'string') {
                            (0, io_1.add)(issues, 'WARN', 'UNLOCK-VALUE-TYPE', 'scenario/quests/unlock-triggers.json', `Unlock condition #${idx + 1} for '${qid}' must be string`, 'Use string tokens, e.g. quest ids or tags');
                            return;
                        }
                        const trimmed = cond.trim();
                        if (!trimmed) {
                            (0, io_1.add)(issues, 'WARN', 'UNLOCK-EMPTY', 'scenario/quests/unlock-triggers.json', `Unlock condition #${idx + 1} for '${qid}' is empty`, 'Remove empty entries or add condition');
                            return;
                        }
                        if (seenConds.has(trimmed)) {
                            (0, io_1.add)(issues, 'WARN', 'UNLOCK-DUPLICATE', 'scenario/quests/unlock-triggers.json', `Unlock condition '${trimmed}' for '${qid}' is duplicated`, 'Remove duplicate conditions');
                        }
                        else {
                            seenConds.add(trimmed);
                        }
                        if (/^[a-z0-9-]+$/.test(trimmed) && !availableIds.has(trimmed)) {
                            (0, io_1.add)(issues, 'WARN', 'UNLOCK-DEPENDENCY-UNKNOWN', 'scenario/quests/unlock-triggers.json', `Quest '${qid}' unlock references missing quest '${trimmed}'`, 'Add the dependency quest to available.json or adjust the unlock condition');
                        }
                    });
                }
            });
        }
    }
    if (indexQuestEntries && indexQuestEntries.length) {
        indexQuestEntries.forEach((questId) => {
            if (!availableIds.has(questId)) {
                (0, io_1.add)(issues, 'WARN', 'INDEX-QUEST-UNKNOWN', 'scenario/index.md', `Scenario index references quest '${questId}' not found in available.json`, 'Remove obsolete row or add quest to available.json');
            }
        });
    }
}
function validateQuestFile(args) {
    const { base, issues, questId, title, questFile, hasExplorationLog, explorationByArea, } = args;
    const stat = fs_1.default.statSync(questFile);
    if (stat.size === 0) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-EMPTY', questFile, 'Quest file is empty', 'Add summary and steps');
        return;
    }
    const content = fs_1.default.readFileSync(questFile, 'utf8');
    const hasHeader = content.includes('#');
    const hasSummary = /##\s*Summary/i.test(content);
    const hasSteps = /##\s*Steps/i.test(content);
    const hasRewards = /##\s*Rewards/i.test(content);
    if (!hasHeader || content.trim().length < 40) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-CONTENT', questFile, 'Quest file seems too short or missing header', 'Add summary/steps sections');
    }
    validateListSection(content, 'Fail State', 'QUEST-FAILSTATE', questFile, issues, {
        missing: 'Describe what happens if players fail or abort the quest',
        format: 'Fail State section should contain a list',
    });
    validateListSection(content, 'Outcome', 'QUEST-OUTCOME', questFile, issues, {
        missing: 'Summarize what success means for the world/factions',
        format: 'Outcome section should contain a list',
    });
    validateListSection(content, 'Aftermath', 'QUEST-AFTERMATH', questFile, issues, {
        missing: 'List follow-up hooks unlocked after completion',
        format: 'Aftermath section should contain a list',
    });
    validateListSection(content, 'Outcome Hooks', 'QUEST-OUTCOMEHOOKS', questFile, issues, {
        missing: 'Describe quest leads unlocked after resolving the outcome.',
        format: 'Outcome Hooks section should contain a list',
    });
    validateListSection(content, 'Conditions', 'QUEST-CONDITIONS', questFile, issues, {
        missing: 'List entry requirements, timers, or prerequisites',
        format: 'Conditions section should contain a list',
    });
    validateListSection(content, 'Notes', 'QUEST-NOTES', questFile, issues, {
        missing: 'Add GM notes, NPC hooks, or special conditions under "## Notes"',
        format: 'Notes section should contain a bullet or numbered list',
    });
    if (!hasSummary) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-CONTENT', questFile, 'Missing "Summary" section', 'Add "## Summary" with brief description');
    }
    if (!hasSteps) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-CONTENT', questFile, 'Missing "Steps" section', 'Add "## Steps" with bullet/numbered steps');
    }
    if (!hasRewards) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-CONTENT', questFile, 'Missing "Rewards" section', 'Add "## Rewards" with XP/loot');
    }
    if (hasHeader && title) {
        const headerMatch = content.match(/^#\s*(.+)$/m);
        if (headerMatch) {
            const headerTitle = headerMatch[1].trim();
            if (headerTitle !== title.trim()) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-TITLE-MISMATCH', questFile, `Heading "${headerTitle}" differs from available title "${title}"`, 'Align quest heading with available.json title');
            }
        }
    }
    const summaryText = extractSection(content, 'Summary');
    if (summaryText && summaryText.replace(/\s+/g, ' ').trim().length < 30) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-SUMMARY-SHORT', questFile, 'Summary section is very short', 'Add more context (>=30 chars)');
    }
    if (!extractSection(content, 'Story')) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-STORY-MISSING', questFile, 'Missing "## Story" section', 'Describe the narrative beats for the quest');
    }
    validateListSection(content, 'Hooks', 'QUEST-HOOKS', questFile, issues, {
        missing: 'Describe encounter hooks, tables, or narrative prompts under "## Hooks"',
        format: 'Hooks section should contain a bullet or numbered list',
    });
    validateListSection(content, 'Encounters', 'QUEST-ENCOUNTERS', questFile, issues, {
        missing: 'Outline enemy groups or challenges in an encounters list',
        format: 'Encounters section should contain a bullet or numbered list',
    });
    const stepsText = extractSection(content, 'Steps');
    if (stepsText && !hasList(stepsText)) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-STEPS-FORMAT', questFile, 'Steps section should contain a list', 'Use "-" bullets or numbered list');
    }
    else if (stepsText && countListItems(stepsText) < 2) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-STEPS-COUNT', questFile, 'Steps list has fewer than 2 entries', 'Add more detail to the quest flow');
    }
    const rewardsText = extractSection(content, 'Rewards');
    if (rewardsText) {
        if (!hasList(rewardsText)) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-FORMAT', questFile, 'Rewards section should be a list', 'Use "-" bullets or numbered list');
        }
        if (rewardsText.replace(/\s+/g, ' ').trim().length < 10) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-SHORT', questFile, 'Rewards section seems empty', 'Specify XP/loot/in-game reward');
        }
        if (countListItems(rewardsText) < 1) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-COUNT', questFile, 'Rewards list is empty', 'List at least one tangible reward');
        }
        validateRewardLines(questFile, rewardsText, issues);
    }
    else {
        (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-MISSING', questFile, 'Missing "## Rewards" section', 'List XP/loot/outcomes for completing the quest');
    }
    const linkMatches = [...content.matchAll(/\[\[([^[\]]+)\]\]/g)].map((match) => match[1]);
    const linkedAreas = new Set();
    linkMatches.forEach((link) => {
        if (!link)
            return;
        if (link === questId) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-LINK-SELF', questFile, 'Quest links to itself', 'Remove or change link target');
            return;
        }
        const questLink = path_1.default.join(base, 'scenario/quests', `${link}.md`);
        const areaLink = path_1.default.join(base, 'scenario/areas', `${link}.md`);
        const questExists = fs_1.default.existsSync(questLink);
        const areaExists = fs_1.default.existsSync(areaLink);
        if (!questExists && !areaExists) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-LINK', questFile, `Link [[${link}]] not found as quest or area`, 'Create file or adjust link target');
        }
        else if (areaExists) {
            linkedAreas.add(link);
            const areaContent = getAreaContent(base, link);
            const questPattern = new RegExp(`\\[\\[${escapeRegExp(questId)}\\]\\]`);
            if (areaContent && !questPattern.test(areaContent)) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-AREA-BACKLINK', questFile, `Area [[${link}]] does not reference this quest`, 'Add [[quest_id]] inside area file to keep navigation bidirectional');
            }
        }
    });
    if (linkedAreas.size === 0) {
        (0, io_1.add)(issues, 'WARN', 'QUEST-AREA-LINK', questFile, 'Quest does not reference any area via [[area-id]] links', 'Link at least one relevant area to anchor the quest');
    }
    else if (hasExplorationLog) {
        linkedAreas.forEach((areaId) => {
            const entries = explorationByArea.get(areaId) || [];
            const questTag = `quest:${questId}`.toLowerCase();
            const hasTaggedEntry = entries.some((entry) => Array.isArray(entry.tags) &&
                entry.tags.some((tag) => typeof tag === 'string' && tag.trim().toLowerCase() === questTag));
            if (!hasTaggedEntry) {
                (0, io_1.add)(issues, 'WARN', 'EXPLORATION-QUEST-MISMATCH', 'player-data/runtime/exploration-log.json', `Quest '${questId}' links [[${areaId}]] but exploration log lacks entry tagged quest:${questId}`, 'Add quest:<id> tag to the relevant exploration entry or run quest:add with --exploration-hook');
            }
        });
    }
}
function validateListSection(content, heading, codePrefix, questFile, issues, messages) {
    const section = extractSection(content, heading);
    if (!section) {
        (0, io_1.add)(issues, 'WARN', `${codePrefix}-MISSING`, questFile, `Missing "## ${heading}" section`, messages.missing);
    }
    else if (!hasList(section)) {
        (0, io_1.add)(issues, 'WARN', `${codePrefix}-FORMAT`, questFile, `${heading} section should contain a list`, messages.format);
    }
}
function validateRewardLines(questFile, rewardsText, issues) {
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
            (0, io_1.add)(issues, 'WARN', `QUEST-REWARDS-${category}`, questFile, `${category} reward missing or malformed`, `Add "- ${category[0] + category.slice(1).toLowerCase()}: ..." line with details/numbers`);
        }
    });
    const xpLine = rewardLines.find((line) => /^-\s*XP:/i.test(line));
    if (xpLine) {
        const xpMatch = xpLine.match(/(-?\d[\d,]*)/);
        if (!xpMatch) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-XP-VALUE', questFile, 'XP reward line is missing numeric value', 'Use "- XP: 150 XP ..." format with digits');
        }
        else {
            const xpValue = Number(xpMatch[1].replace(/,/g, ''));
            if (!Number.isFinite(xpValue)) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-XP-VALUE', questFile, 'XP reward line does not contain a valid number', 'Ensure the XP amount is numeric (e.g. 150)');
            }
            else if (xpValue < XP_RANGE.min || xpValue > XP_RANGE.max) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-XP-RANGE', questFile, `XP reward (${xpValue}) is outside recommended ${XP_RANGE.min}-${XP_RANGE.max} range`, 'Adjust XP to stay within the standard balance window');
            }
        }
    }
    const goldLine = rewardLines.find((line) => /^-\s*Gold:/i.test(line));
    if (goldLine) {
        const goldMatch = goldLine.match(/(-?\d[\d,]*)/);
        if (!goldMatch) {
            (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-GOLD-VALUE', questFile, 'Gold reward line is missing numeric value', 'Use "- Gold: 75 gold ..." format with digits');
        }
        else {
            const goldValue = Number(goldMatch[1].replace(/,/g, ''));
            if (!Number.isFinite(goldValue)) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-GOLD-VALUE', questFile, 'Gold reward line does not contain a valid number', 'Ensure the gold amount is numeric (e.g. 75)');
            }
            else if (goldValue < GOLD_RANGE.min || goldValue > GOLD_RANGE.max) {
                (0, io_1.add)(issues, 'WARN', 'QUEST-REWARDS-GOLD-RANGE', questFile, `Gold reward (${goldValue}) is outside recommended ${GOLD_RANGE.min}-${GOLD_RANGE.max} range`, 'Adjust gold to stay within the standard balance window');
            }
        }
    }
}
exports.default = checkQuests;
//# sourceMappingURL=quests.js.map