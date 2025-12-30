"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAreas = checkAreas;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const io_1 = require("../utils/io");
const questContentCache = new Map();
function clearQuestCache() {
    questContentCache.clear();
}
function getQuestContent(base, questId) {
    const cacheKey = `${base}:${questId}`;
    if (questContentCache.has(cacheKey)) {
        return questContentCache.get(cacheKey) ?? null;
    }
    const questPath = path_1.default.join(base, 'scenario/quests', `${questId}.md`);
    if (!fs_1.default.existsSync(questPath)) {
        questContentCache.set(cacheKey, null);
        return null;
    }
    try {
        const content = fs_1.default.readFileSync(questPath, 'utf8');
        questContentCache.set(cacheKey, content);
        return content;
    }
    catch {
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
async function checkAreas(ctx) {
    const { base, issues } = ctx;
    clearQuestCache();
    const areasDir = path_1.default.join(base, 'scenario/areas');
    if (!fs_1.default.existsSync(areasDir))
        return;
    const entries = fs_1.default.readdirSync(areasDir).filter((file) => file.endsWith('.md'));
    if (!entries.length) {
        (0, io_1.add)(issues, 'WARN', 'AREA-EMPTY-LIST', 'scenario/areas', 'No areas defined', 'Add at least one scenario/areas/<id>.md file');
        return;
    }
    entries.forEach((file) => {
        const areaId = path_1.default.basename(file, '.md');
        const relPath = path_1.default.join('scenario/areas', file);
        const areaPath = path_1.default.join(areasDir, file);
        const stat = fs_1.default.statSync(areaPath);
        if (stat.size === 0) {
            (0, io_1.add)(issues, 'WARN', 'AREA-EMPTY', relPath, 'Area file is empty', 'Provide description, POIs, connections');
            return;
        }
        const content = fs_1.default.readFileSync(areaPath, 'utf8');
        if (!/^#\s+.+/m.test(content)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-HEADER', relPath, 'Missing "# Title" header', 'Add H1 heading with area name');
        }
        const description = extractSection(content, 'Description');
        if (!description) {
            (0, io_1.add)(issues, 'WARN', 'AREA-DESCRIPTION', relPath, 'Missing "## Description" section', 'Describe the area vibe and purpose (2-3 sentences)');
        }
        else if (description.replace(/\s+/g, ' ').trim().length < 60) {
            (0, io_1.add)(issues, 'WARN', 'AREA-DESCRIPTION-SHORT', relPath, 'Description is very short', 'Provide at least ~60 characters of context');
        }
        const points = extractSection(content, 'Points of interest');
        if (!points) {
            (0, io_1.add)(issues, 'WARN', 'AREA-POINTS', relPath, 'Missing "## Points of interest" section', 'List at least one POI');
        }
        else if (!hasList(points)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-POINTS-FORMAT', relPath, 'Points of interest should be a list', 'Use "-" bullets or numbered list');
        }
        else if (countListItems(points) < 1) {
            (0, io_1.add)(issues, 'WARN', 'AREA-POINTS-COUNT', relPath, 'Points of interest list is empty', 'Add at least one POI entry');
        }
        const connections = extractSection(content, 'Connections');
        if (!connections) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONNECTIONS', relPath, 'Missing "## Connections" section', 'List exits, fast-travel, or quest hooks');
        }
        else if (!hasList(connections)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONNECTIONS-FORMAT', relPath, 'Connections section should be a list', 'Use "-" bullets or numbered list');
        }
        else if (countListItems(connections) < 1) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONNECTIONS-COUNT', relPath, 'Connections list is empty', 'Add at least one connection/hook');
        }
        const notes = extractSection(content, 'Notes');
        if (!notes) {
            (0, io_1.add)(issues, 'WARN', 'AREA-NOTES-MISSING', relPath, 'Missing "## Notes" section', 'Add key NPC hooks, threats, or GM reminders');
        }
        else if (!hasList(notes)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-NOTES-FORMAT', relPath, 'Notes section should contain a bullet or numbered list', 'Use "-" bullets for NPC hooks/threats');
        }
        const conditions = extractSection(content, 'Conditions');
        if (!conditions) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONDITIONS-MISSING', relPath, 'Missing "## Conditions" section', 'List access requirements, timers, or environmental constraints');
        }
        else if (!hasList(conditions)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONDITIONS-FORMAT', relPath, 'Conditions section should be a list', 'Use "-" bullets for requirements or timers');
        }
        else if (countListItems(conditions) < 1) {
            (0, io_1.add)(issues, 'WARN', 'AREA-CONDITIONS-COUNT', relPath, 'Conditions list is empty', 'Add at least one requirement or warning');
        }
        const threats = extractSection(content, 'Threats');
        if (!threats) {
            (0, io_1.add)(issues, 'WARN', 'AREA-THREATS-MISSING', relPath, 'Missing "## Threats" section', 'Outline fail hooks/escalations tied to this area');
        }
        else if (!hasList(threats)) {
            (0, io_1.add)(issues, 'WARN', 'AREA-THREATS-FORMAT', relPath, 'Threats section should contain a list', 'Use "-" bullets describing escalation or fail hooks');
        }
        else if (countListItems(threats) < 1) {
            (0, io_1.add)(issues, 'WARN', 'AREA-THREATS-COUNT', relPath, 'Threats list is empty', 'Add at least one threat/escalation bullet');
        }
        const linkMatches = [...content.matchAll(/\[\[([^[\]]+)\]\]/g)].map((match) => match[1]);
        linkMatches.forEach((target) => {
            if (!target)
                return;
            if (target === areaId) {
                (0, io_1.add)(issues, 'WARN', 'AREA-LINK-SELF', relPath, 'Area links to itself', 'Maintain outgoing links to other areas/quests instead');
                return;
            }
            const targetAreaPath = path_1.default.join(areasDir, `${target}.md`);
            const targetQuestPath = path_1.default.join(base, 'scenario/quests', `${target}.md`);
            if (fs_1.default.existsSync(targetAreaPath)) {
                return;
            }
            if (fs_1.default.existsSync(targetQuestPath)) {
                const questContent = getQuestContent(base, target);
                const backlinkPattern = new RegExp(`\\[\\[${escapeRegExp(areaId)}\\]\\]`);
                if (questContent && !backlinkPattern.test(questContent)) {
                    (0, io_1.add)(issues, 'WARN', 'AREA-QUEST-BACKLINK', relPath, `Quest [[${target}]] does not mention area '${areaId}'`, 'Add [[area_id]] inside quest file or remove quest link from area');
                }
                return;
            }
            (0, io_1.add)(issues, 'WARN', 'AREA-LINK', relPath, `Link [[${target}]] not found as quest or area`, 'Create file or adjust link target');
        });
    });
}
exports.default = checkAreas;
//# sourceMappingURL=areas.js.map