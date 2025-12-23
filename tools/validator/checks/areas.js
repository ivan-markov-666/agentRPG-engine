const fs = require('fs');
const path = require('path');
const { add } = require('../utils/io');

const questContentCache = new Map();

function clearQuestCache() {
  questContentCache.clear();
}

function getQuestContent(base, questId) {
  const cacheKey = `${base}:${questId}`;
  if (questContentCache.has(cacheKey)) {
    return questContentCache.get(cacheKey);
  }
  const questPath = path.join(base, 'scenario/quests', `${questId}.md`);
  if (!fs.existsSync(questPath)) {
    questContentCache.set(cacheKey, null);
    return null;
  }
  try {
    const content = fs.readFileSync(questPath, 'utf8');
    questContentCache.set(cacheKey, content);
    return content;
  } catch (e) {
    questContentCache.set(cacheKey, null);
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

async function checkAreas(ctx) {
  const { base, issues } = ctx;
  clearQuestCache();
  const areasDir = path.join(base, 'scenario/areas');
  if (!fs.existsSync(areasDir)) return;
  const entries = fs.readdirSync(areasDir).filter((f) => f.endsWith('.md'));
  if (!entries.length) {
    add(issues, 'WARN', 'AREA-EMPTY-LIST', 'scenario/areas', 'No areas defined', 'Add at least one scenario/areas/<id>.md file');
    return;
  }
  entries.forEach((file) => {
    const areaId = path.basename(file, '.md');
    const relPath = path.join('scenario/areas', file);
    const areaPath = path.join(areasDir, file);
    const stat = fs.statSync(areaPath);
    if (stat.size === 0) {
      add(issues, 'WARN', 'AREA-EMPTY', relPath, 'Area file is empty', 'Provide description, POIs, connections');
      return;
    }
    const content = fs.readFileSync(areaPath, 'utf8');
    if (!/^#\s+.+/m.test(content)) {
      add(issues, 'WARN', 'AREA-HEADER', relPath, 'Missing "# Title" header', 'Add H1 heading with area name');
    }
    const description = extractSection(content, 'Description');
    if (!description) {
      add(issues, 'WARN', 'AREA-DESCRIPTION', relPath, 'Missing "## Description" section', 'Describe the area vibe and purpose (2-3 sentences)');
    } else if (description.replace(/\s+/g, ' ').trim().length < 60) {
      add(issues, 'WARN', 'AREA-DESCRIPTION-SHORT', relPath, 'Description is very short', 'Provide at least ~60 characters of context');
    }
    const points = extractSection(content, 'Points of interest');
    if (!points) {
      add(issues, 'WARN', 'AREA-POINTS', relPath, 'Missing "## Points of interest" section', 'List at least one POI');
    } else if (!hasList(points)) {
      add(issues, 'WARN', 'AREA-POINTS-FORMAT', relPath, 'Points of interest should be a list', 'Use "-" bullets or numbered list');
    }
    const connections = extractSection(content, 'Connections');
    if (!connections) {
      add(issues, 'WARN', 'AREA-CONNECTIONS', relPath, 'Missing "## Connections" section', 'List exits, fast-travel, or quest hooks');
    } else if (!hasList(connections)) {
      add(issues, 'WARN', 'AREA-CONNECTIONS-FORMAT', relPath, 'Connections section should be a list', 'Use "-" bullets or numbered list');
    }

    const linkMatches = [...content.matchAll(/\[\[([^[\]]+)\]\]/g)].map((m) => m[1]);
    linkMatches.forEach((target) => {
      if (!target) return;
      if (target === areaId) {
        add(issues, 'WARN', 'AREA-LINK-SELF', relPath, 'Area links to itself', 'Maintain outgoing links to other areas/quests instead');
        return;
      }
      const targetAreaPath = path.join(areasDir, `${target}.md`);
      const targetQuestPath = path.join(base, 'scenario/quests', `${target}.md`);
      if (fs.existsSync(targetAreaPath)) {
        return;
      }
      if (fs.existsSync(targetQuestPath)) {
        const questContent = getQuestContent(base, target);
        const backlinkPattern = new RegExp(`\\[\\[${escapeRegExp(areaId)}\\]\\]`);
        if (questContent && !backlinkPattern.test(questContent)) {
          add(issues, 'WARN', 'AREA-QUEST-BACKLINK', relPath, `Quest [[${target}]] does not mention area '${areaId}'`, 'Add [[area_id]] inside quest file or remove quest link from area');
        }
        return;
      }
      add(issues, 'WARN', 'AREA-LINK', relPath, `Link [[${target}]] not found as quest or area`, 'Create file or adjust link target');
    });
  });
}

module.exports = { checkAreas };
