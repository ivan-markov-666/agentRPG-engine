const fs = require('fs');
const path = require('path');
const { loadData, add } = require('../utils/io');

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
    if (!quest_id || !title) return;
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
