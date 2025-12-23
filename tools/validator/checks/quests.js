const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

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

async function checkQuests(ctx) {
  const { base, issues } = ctx;
  const availablePath = path.join(base, 'scenario/quests/available.json');
  if (!fs.existsSync(availablePath)) return;
  const available = loadData(availablePath, issues);
  if (!available) return;
  // assume map quest_id -> title or array of objects
  const titleMap = new Map();
  const availableIds = new Set();
  const entries = Array.isArray(available)
    ? available
    : Object.entries(available).map(([quest_id, title]) => ({ quest_id, title }));
  if (!entries.length) {
    add(issues, 'WARN', 'QUEST-EMPTY-LIST', 'scenario/quests/available.json', 'No quests listed in available.json', 'Add at least one quest entry');
  }
  entries.forEach(({ quest_id, title }) => {
    if (!quest_id || !title) {
      add(issues, 'ERROR', 'QUEST-ENTRY', 'scenario/quests/available.json', 'Each quest entry needs quest_id and title', 'Fill both quest_id and title');
      return;
    }
    availableIds.add(quest_id);
    if (!/^[a-z0-9-]+$/.test(quest_id)) {
      add(issues, 'WARN', 'QUEST-ID-FORMAT', 'scenario/quests/available.json', `Quest id '${quest_id}' should be slug (a-z0-9-)`, 'Rename to slug-safe id');
    }
    if (titleMap.has(title)) {
      add(issues, 'ERROR', 'TITLE-MISMATCH', 'scenario/quests/available.json', `Duplicate title '${title}'`, 'Rename to be unique');
    } else {
      titleMap.set(title, quest_id);
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
        const stepsText = extractSection(content, 'Steps');
        if (stepsText && !hasList(stepsText)) {
          add(issues, 'WARN', 'QUEST-STEPS-FORMAT', `scenario/quests/${quest_id}.md`, 'Steps section should contain a list', 'Use "-" bullets or numbered list');
        }
        const rewardsText = extractSection(content, 'Rewards');
        if (rewardsText && rewardsText.replace(/\s+/g, ' ').trim().length < 10) {
          add(issues, 'WARN', 'QUEST-REWARDS-SHORT', `scenario/quests/${quest_id}.md`, 'Rewards section seems empty', 'Specify XP/loot/in-game reward');
        }
        const linkMatches = [...content.matchAll(/\[\[([^[\]]+)\]\]/g)].map((m) => m[1]);
        linkMatches.forEach((link) => {
          if (link === quest_id) {
            add(issues, 'WARN', 'QUEST-LINK-SELF', `scenario/quests/${quest_id}.md`, 'Quest links to itself', 'Remove or change link target');
            return;
          }
          const questLink = path.join(base, 'scenario/quests', `${link}.md`);
          const areaLink = path.join(base, 'scenario/areas', `${link}.md`);
          if (!fs.existsSync(questLink) && !fs.existsSync(areaLink)) {
            add(issues, 'WARN', 'QUEST-LINK', `scenario/quests/${quest_id}.md`, `Link [[${link}]] not found as quest or area`, 'Create file or adjust link target');
          }
        });
      }
    }
  });

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
        }
      });
    }
  }
}

module.exports = { checkQuests };
